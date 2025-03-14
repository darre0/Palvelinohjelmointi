import express from "express";
import fetch from "node-fetch";

const port = 3000;
const host = "localhost";
const pokeapi = "https://pokeapi.co/api/v2";

const app = express();

app.use("/includes", express.static("includes"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/sukupolvi/:numero", async (req, res) => {
  const numero = req.params.numero;
  try {
    const vastaus_json = await fetch(pokeapi + "/generation/" + numero);
    let vastaus = await vastaus_json.json();

    res.render("generation", { pokemons: vastaus.pokemon_species });
  } catch (err) {
    console.error(err);

    res.render("generation", {
      pokemons: [{ name: "Pokemoneja ei löytynyt" }],
    });
  }
});

app.get("/pokemon/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const vastaus2 = await fetch(pokeapi + "/pokemon/" + id);
    const pokemon = await vastaus2.json();

    res.render("pokemon", {
      pokemon: pokemon,
    });
  } catch (err) {
    console.error(err);
    res.render("pokemon", {
      pokemon: null,
      virhe: "Pokemonia ei löydetty",
    });
  }
});

app.listen(port, host, () => console.log(`${host}:${port} kuuntelee...`));
