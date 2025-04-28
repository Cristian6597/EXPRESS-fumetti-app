//npm i --save express express-session passport passport-google-oauth2
import express from "express";
import fumettiRouter from "./routes/fumetti.route.js";
import fumetterieRouter from "./routes/fumetterie.route.js";
import authRouter from "./routes/auth.route.js";
import "./utils/authgoogle.js";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import chatbotRouter from "./routes/chatbot.route.js";
dotenv.config();

function isLoggedIn(req, res, next) {
  req.user ? next() : res.status(401).send("Non sei autenticato");
}

const PORT = process.env.PORT || 3009;

const app = express();
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
// Routes
app.use(fumettiRouter);
app.use(fumetterieRouter);
app.use(authRouter);
app.use("/api", chatbotRouter);
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send('<a href="/auth/google">Autenticati con Google</a>');
});

// l'endpoint di callback deve essere lo stesso che hai impostato nella console di google, si può cambiare anche con facebook, github, ecc
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  (req, res) => {
    res.redirect("/protected");
  }
);

app.get("/auth/failure", (req, res) => {
  res.send("Failed to authenticate..");
});

app.get("/protected", isLoggedIn, (req, res) => {
  res.send(`Ciao ${req.user.displayName}, sei autenticato!`);
});

app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
  req.session.destroy();
  res.send("Logout effettuato con successo.");
});

app.listen(PORT, () => {
  console.log("Server in ascolto sulla porta " + PORT);
});
