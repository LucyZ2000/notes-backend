import dotenv from 'dotenv';
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get("/api/notes", async (req, res) => {

    const notes = await prisma.note.findMany();

    res.json(notes);
});

app.post("/api/notes", async(req, res) => {
    const { title, content } = req.body;
    
    if (!title || !content) {
        return res
        .status(400)
        .send("title and content fields required");
    }

    try{
        const note = await prisma.note.create({
            data: {title, content}
        });
        res.json(note);
    
    } catch (error) {
        res
        .status(500)
        .send("Oops something went wrong")
    }
});

app.put("/api/notes/:id", async (req, res) => {
    const {title, content} = req.body;
    const id = parseInt(req.params.id);

    if(!id || isNaN(id)) {
        return res.status(400).send("ID must be a valid number");
    }
    try {
        const updatedNote = await prisma.note.update({
            where: { id },
            data: { title, content }
        })
        res.json(updatedNote)
    } catch (error) {
        res.status(500).send("oops, something went wrong")
    }
});

app.delete("/api/notes/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if(!id || isNaN(id)) {
        return res.status(400).send("ID must be valid integer");
    }

    try {
        await prisma.note.delete({
            where: { id }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).send("oops, something went wrong");
    }
});

const port = process.env.PORT || 5000;  // Use dynamic port if available, otherwise fallback to 5000
const host = '0.0.0.0';  // Bind to all network interfaces

app.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}`);
});
