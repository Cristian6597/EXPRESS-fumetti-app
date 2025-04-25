import express from "express";
import prisma from "../prisma/prismaClient.js";

const fumetterieRouter = express.Router();

//get tutti i fumetterie
fumetterieRouter.get("/fumetterie", async (req, res) => {
  const { name, city, adress, cap } = req.query;
  try {
    const fumetterie = await prisma.fumetteria.findMany({
      orderBy: { createdAt: "asc" },
      where: { name, city, adress, cap },
    });
    res.json(fumetterie);
  } catch (error) {
    console.error("Error fetching fumetterie:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//get fumetteria by id
fumetterieRouter.get("/fumetterie/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const fumetteria = await prisma.fumetteria.findUnique({
      where: { id: Number(id) },
    });
    if (!fumetteria) {
      console.log(fumetteria);
      return res.status(404).json({ error: "fumetteria not found" });
    }
    res.json(fumetteria);
  } catch (error) {
    console.error("Error fetching fumetteria:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//post aggiungi fumetteria
fumetterieRouter.post("/aggiungifumetteria", async (req, res) => {
  const { name, city, adress, cap } = req.body;
  try {
    const newFumetteria = await prisma.fumetteria.create({
      data: { name, city, adress, cap },
    });
    res.status(201).json(newFumetteria);
  } catch (error) {
    console.error("Errore nel creare il fumetto:", error);
    res.status(500).json({ error: "problema con il server" });
  }
});

//put modifica fumetteria
fumetterieRouter.put("/fumetterie/:id", async (req, res) => {
  const { id } = req.params;
  const { name, city, adress, cap } = req.body;
  try {
    const updatedFumetteria = await prisma.fumetteria.update({
      where: { id: Number(id) },
      data: { name, city, adress, cap },
    });
    res.json(updatedFumetteria);
  } catch (error) {
    console.error("Error updating fumetteria:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//delete fumetto

fumetterieRouter.delete("/fumetterie/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedFumetto = await prisma.fumetteria.delete({
      where: { id: Number(id) },
    });
    res.json(deletedFumetto);
  } catch (error) {
    console.error("Error deleting fumetteria:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default fumetterieRouter;
