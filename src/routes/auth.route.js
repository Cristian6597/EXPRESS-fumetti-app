import express from "express";
import prisma from "../prisma/prismaClient.js";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import validatorMiddleware from "../middleware/validator.middleware.js";
import {
  loginValidator,
  registerValidator,
} from "../validators/authValidator.js";
import transporter from "../utils/emailTransporter.js";

const authRouter = express.Router();

//Registrazione
authRouter.post(
  "/register",
  validatorMiddleware(registerValidator),
  async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: bcrypt.hashSync(password, 10),
        },
      });

      // 1. Creo un token di verifica
      const emailToken = jsonwebtoken.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // 2. Creo il link da inviare
      const url = `http://localhost:3009/api/auth/verify-email?token=${emailToken}`;

      // 3. Mando la mail
      await transporter.sendMail({
        from: '"Fumetti App 👻" <mrhycron@gmail.com>',
        to: user.email,
        subject: "Conferma la tua email",
        html: `Ciao ${firstName}, <br/> Clicca qui per confermare la tua email: <a href="${url}">${url}</a>`,
      });

      res.json({
        message:
          "Utente creato. Controlla la tua email per confermare l'account.",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Impossibile registrare l'utente" });
    }
  }
);

// Login
authRouter.post(
  "/login",
  validatorMiddleware(loginValidator),
  async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      const pswCheck = bcrypt.compareSync(password, user?.password || "");

      //verifica se l'utente esiste, se la password è corretta e se l'utente è verificato
      if (!user || !pswCheck || !user.isVerified) {
        return res.status(401).json({ message: "Credenziali non valide" });
      }

      const { password: psw, ...userWithoutPsw } = user;

      const jwt = jsonwebtoken.sign(userWithoutPsw, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.json({ token: jwt, user: userWithoutPsw });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "impossibile autenticare l'utente" });
    }
  }
);

//Verifica Email
authRouter.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  try {
    const payload = jsonwebtoken.verify(token, process.env.JWT_SECRET);

    await prisma.user.update({
      where: { id: payload.userId },
      data: { isVerified: true },
    });

    res.send("Email verificata con successo! Ora puoi fare login.");
  } catch (error) {
    console.error(error);
    res.status(400).send("Token non valido o scaduto.");
  }
});

export default authRouter;
