const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();
const port = 3001;

app.use(cors());

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to Bloggy's API");
});

// GET ALL ENTRIES
app.get("/entries", async (req, res) => {
  try {
    const entries = await prisma.entry.findMany();
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: "Error obtaining entries" });
  }
});

// POST ENTRY
app.post("/entries", async (req, res) => {
  const { title, author, publicationDate, content } = req.body;
  try {
    const newEntry = await prisma.entry.create({
      data: {
        title,
        author,
        publicationDate,
        content,
      },
    });

    res.json(newEntry);
  } catch (error) {
    res.status(500).json({ error: "Error creating a new entry" });
  }
});

// DELETE BY ID
app.delete("/entries/:id", async (req, res) => {
  const entryId = parseInt(req.params.id);

  try {
    await prisma.entry.delete({
      where: { id: entryId },
    });

    res.json({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting entry by ID" });
  }
});

app.listen(port, () => {
  console.log(`Started Node.js server in http://localhost:${port}`);
});
