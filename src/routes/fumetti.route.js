import express from "express";
import prisma from "../prisma/prismaClient.js";

const fumettiRouter = express.Router();

//get tutti i fumetti
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

//get fumetto by id
fumettiRouter.get("/fumetti/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const fumetto = await prisma.fumetti.findUnique({
      where: { id: Number(id) },
    });
    if (!fumetto) {
      console.log(fumetto);
      return res.status(404).json({ error: "Fumetto not found" });
    }
    res.json(fumetto);
  } catch (error) {
    console.error("Error fetching fumetto:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//post aggiungi fumetto
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

//put modifica fumetto
fumettiRouter.put("/fumetti/:id", async (req, res) => {
  const { id } = req.params;
  const { title, author, volume, date } = req.body;
  try {
    const updatedFumetto = await prisma.fumetti.update({
      where: { id: Number(id) },
      data: { title, author, volume, date },
    });
    res.json(updatedFumetto);
  } catch (error) {
    console.error("Error updating fumetto:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//delete fumetto

fumettiRouter.delete("/fumetti/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedFumetto = await prisma.fumetti.delete({
      where: { id: Number(id) },
    });
    res.json(deletedFumetto);
  } catch (error) {
    console.error("Error deleting fumetto:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default fumettiRouter;
