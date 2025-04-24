import express from "express";
import prisma from "../prisma/prismaClient.js";

const fumettiRouter = express.Router();

fumettiRouter.get("/fumetti", async (req, res) => {
  const { title, volume, author, date } = req.query;
  try {
    const fumetti = await prisma.fumetti.findMany({
      orderBy: { createdAt: "asc" },
      where: { title, volume, author, date },
    });
    res.json(fumetti);
  } catch (error) {
    console.error("Error fetching fumetti:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

fumettiRouter.post("/aggiungifumetto", async (req, res) => {
  const { title, author, volume, date, fumetteriaId } = req.body;
  try {
    const newFumetto = await prisma.fumetti.create({
      data: { title, author, volume, date, fumetteriaId },
    });
    res.status(201).json(newFumetto);
  } catch (error) {
    console.error("Errore nel creare il fumetto:", error);
    res.status(500).json({ error: "problema con il server" });
  }
});

export default fumettiRouter;
