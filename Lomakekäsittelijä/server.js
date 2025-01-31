import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

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

  fs.readFile("data.json", "utf8", function (err, data) {
    if (err) {
      console.log("Tapahtui virhe.");
    } else {
      const palauteData = JSON.parse(data);
      const uusiPalaute = {
        nimi: nimi,
        sähköposti: sposti,
        palaute: palaute,
      };
      palauteData.push(uusiPalaute);
      fs.writeFile(
        "data.json",
        JSON.stringify(palauteData, null, 2),
        { encoding: "utf8" },
        function (err) {
          if (err) {
            console.log("Virhe tiedostoon kirjoittamisessa.");
          } else {
            console.log("Palaute kirjattu tiedostoon.");
          }
        }
      );
    }
  });

  res.send(
    `Kiitos palautteestasi, ${nimi}! Otamme sinuun tarvittaessa yhteyttä sähköpostitse osoitteeseen ${sposti}.`
  );
});

app.listen(port, host, () => `${host}:${port} kuuntelee...`);
