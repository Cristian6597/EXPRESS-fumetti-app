import express from "express";
import fumettiRouter from "./routes/fumetti.route.js";
import fumetterieRouter from "./routes/fumetterie.route.js";
import authRouter from "./routes/auth.route.js";

const PORT = process.env.PORT || 3009;

const app = express();
app.use(express.json());
// Routes
app.use(fumettiRouter);
app.use(fumetterieRouter);
app.use(authRouter);

app.get("/", (req, res) => {
  res.send("Ciao, mondo!");
});
app.listen(PORT, () => {
  console.log("Server in ascolto sulla porta " + PORT);
});
