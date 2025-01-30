// Importit
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Määritellään __filename ja __dirname
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

// Luodaan express-palvelin instanssi
const app = express();

// Määritellään vakiot
const port = 3000;
const host = "localhost";

// Asetetaan staattiset tiedostot tarjolle "includes"-kansiosta
app.use(express.static(path.join(__dirname, "templates")));

// Määritellään reitit
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "templates/index.html")); // Lähetetään index.html vastauksena
});

// Käynnistetään palvelin kuuntelemaan vakioiden mukaista osoitetta
app.listen(port, host, () => console.log(`${host}:${port} kuuntelee...`));
