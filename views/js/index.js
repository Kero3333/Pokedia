const pokemonSelect = () => {
  // pagination
  const page = parseInt(document.location.search.split("?page=")[1]);
  document.querySelector("select").value = page;
  if (page > 1) {
    document.querySelector(".previous").addEventListener("click", () => {
      document.location.search = `?page=${page - 1}`;
    });
  }
  if (page - 1 < document.querySelector("select").lastElementChild.value) {
    document.querySelector(".next").addEventListener("click", () => {
      document.location.search = `?page=${page + 1}`;
    });
  }
  document.querySelector("select").addEventListener("change", () => {
    const newPage = document.querySelector("select").value;
    document.location.search = `?page=${newPage}`;
  });

  // liste de pokémon
  const pokemons = document.querySelectorAll(".pokemon");

  pokemons.forEach((pokemon) => {
    // fiche pokémon
    pokemon.addEventListener("click", async () => {
      const id = pokemon.id;
      const container = document.querySelector(".container");

      const res = await (
        await fetch(`http://${window.location.host}/pokemon/${id}`)
      ).text();
      const containerPokemonList = container.innerHTML;
      container.innerHTML = res;

      document.querySelector(".back").addEventListener("click", () => {
        container.innerHTML = containerPokemonList;
        pokemonSelect();
      });
    });
  });
};
pokemonSelect();
