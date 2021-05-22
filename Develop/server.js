// Dependencies

const express = require("express");
const path = require("path");
const fs = require("fs");
const db = require("./db/db.json");

// Sets up the Express App

const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes

//Displays notes page where user can POST
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// Displays all notes
app.get("/api/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/db/db.json"))
);
app.post("/api/notes", (req, res) => {
  const newNote = req.body;

  const noteList = JSON.parse(
    fs.readFileSync(path.join(__dirname, "/db/db.json"), {
      encoding: "utf-8",
    })
  );

  if (noteList.length === 0) {
    newNote.id = 0;
  } else {
    newNote.id = noteList[noteList.length - 1].id + 1;
  }
  noteList.push(newNote);
  console.log(noteList);
  fs.writeFileSync(
    path.join(__dirname, "/db/db.json"),
    JSON.stringify(noteList)
  );
  res.json(newNote);
});

// Basic route that sends the user first to the AJAX Page
app.get("*", (req, res) => {
  if (req.url === "/") {
    res.sendFile(path.join(__dirname, "/public/index.html"));
  } else {
    res.sendFile(path.join(__dirname, "/public", req.url));
  }
});

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
