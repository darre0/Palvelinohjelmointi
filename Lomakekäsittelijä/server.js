import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const host = "localhost";
const port = 3000;

const app = express();

// Otetaan käyttöön EJS-moottori
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "templates"));

// Staattiset tiedostot
app.use("/styles", express.static("includes/styles"));

// POST:n body:n lukeminen lomakedatalla
app.use(express.urlencoded({ extended: true }));

// TODO tähän tulevat polut
app.get("/palaute", (req, res) => {
  res.render("palaute");
});

app.post("/palaute", (req, res) => {
  const { nimi, sposti, palaute } = req.body;

  res.send(
    `Kiitos palautteestasi, ${nimi}! Otamme sinuun tarvittaessa yhteyttä sähköpostitse osoitteeseen ${sposti}.`
  );
});

app.listen(port, host, () => `${host}:${port} kuuntelee...`);
