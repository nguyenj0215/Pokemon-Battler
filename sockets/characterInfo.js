var pokemonArry = [
  {
    name: bulbasaur,
    num: 1,
    species: "Bulbasaur",
    types: ["Grass", "Poison"],
    genderRatio: { M: 0.875, F: 0.125 },
    baseStats: { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
    abilities: { 0: "Overgrow", H: "Chlorophyll" },
    heightm: 0.7,
    weightkg: 6.9,
    color: "Green",
    evos: ["ivysaur"],
    eggGroups: ["Monster", "Grass"]
  },

  {
    name: charmander,
    num: 4,
    species: "Charmander",
    types: ["Fire"],
    genderRatio: { M: 0.875, F: 0.125 },
    baseStats: { hp: 39, atk: 52, def: 43, spa: 60, spd: 50, spe: 65 },
    abilities: { 0: "Blaze", H: "Solar Power" },
    heightm: 0.6,
    weightkg: 8.5,
    color: "Red",
    evos: ["charmeleon"],
    eggGroups: ["Monster", "Dragon"]
  },

  {
    name: squirtle,
    num: 7,
    species: "Squirtle",
    types: ["Water"],
    genderRatio: { M: 0.875, F: 0.125 },
    baseStats: { hp: 44, atk: 48, def: 65, spa: 50, spd: 64, spe: 43 },
    abilities: { 0: "Torrent", H: "Rain Dish" },
    heightm: 0.5,
    weightkg: 9,
    color: "Blue",
    evos: ["wartortle"],
    eggGroups: ["Monster", "Water 1"]
  }
];

module.exports = pokemonArry;
