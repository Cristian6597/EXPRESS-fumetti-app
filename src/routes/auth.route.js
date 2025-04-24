import express from "express";
import prisma from "../prisma/prismaClient.js";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import validatorMiddleware from "../middleware/validator.middleware.js";
import {
  loginValidator,
  registerValidator,
} from "../validators/authValidator.js";

const authRouter = express.Router();

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
        omit: {
          password: true,
        },
      });
      res.json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "impossibile registrare l'utente" });
    }
  }
);

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
      if (!user || !pswCheck) {
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

export default authRouter;
