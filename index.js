const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static(__dirname + "/views"));

const urlPokemon = "https://pokeapi.co/api/v2/pokemon";
const urlPokemonSpecie = "https://pokeapi.co/api/v2/pokemon-species";
const nbTotalPokemon = 905;

app.get("/", async (req, res) => {
  let numberOfPokemon = 10;
  let offset = 1;

  try {
    const nbTotalsPages = Math.ceil(nbTotalPokemon / 10);
    const { page } = req.query;
    if (page > 1) {
      numberOfPokemon = page * 10;
      offset = (page - 1) * 10 + 1;
    }

    const pokemonsCaract = [];
    for (let i = offset; i <= numberOfPokemon && i <= 905; i++) {
      const {
        data: { id, name, sprites, types },
      } = await axios.get(`${urlPokemon}/${i}`);
      const caract = {
        id,
        name,
        sprites,
        types,
      };
      pokemonsCaract.push(caract);
    }

    pokemonsCaract.sort(function compare(a, b) {
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;
      return 0;
    });
    res.render("index", {
      pokemons: pokemonsCaract,
      pagination: { nbTotalsPages },
    });
  } catch (error) {
    res.status(500);
    console.log(error);
  }
});

app.get("/pokemon/:id", async (req, res) => {
  const { id } = req.params;
  const {
    data: {
      name,
      sprites: { front_default },
      stats,
    },
  } = await axios.get(`${urlPokemon}/${id}`);
  const {
    data: { flavor_text_entries },
  } = await axios.get(`${urlPokemonSpecie}/${id}`);
  const entryEng = flavor_text_entries.filter((entry) => {
    if (entry.language.name === "en") {
      return 1;
    }
  });
  const pokemon = {
    name,
    sprite: front_default,
    stats,
    description: entryEng[0].flavor_text,
  };
  res.render("partials/pokemon", {
    pokemon,
  });
});

app.listen(3000, () => {
  console.log("Server is running...");
});
