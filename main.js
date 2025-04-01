const petTemplate = document.querySelector("#pet-card-template");
const wrapper = document.createDocumentFragment();

const petsDataUrl = "https://emil19ro.github.io/Pet-Adoption/data/pets.json";
async function start() {
  const weatherPromise = await fetch("https://api.weather.gov/gridpoints/MFL/110,50/forecast");
  const weatherData = await weatherPromise.json();
  const ourTemperature = weatherData.properties.periods[0].temperature;
  document.querySelector("#temperature-output").textContent = ourTemperature;
}
start();

function createAgeText(birthYear) {
  const curentYear = new Date().getFullYear();
  const age = curentYear - birthYear;
  if (age == 1) return "1 year old";
  if (age == 0) return "Less than 1 year old";
  return `${age} years old`;
}

async function petsArea() {
  const petsPromise = await fetch(petsDataUrl);
  const petsData = await petsPromise.json();
  petsData.forEach(pet => {
    const clone = petTemplate.content.cloneNode(true);
    clone.querySelector(".pet-card").dataset.species = pet.species;
    clone.querySelector("h3").textContent = pet.name;
    clone.querySelector(".pet-description").textContent = pet.description;
    clone.querySelector(".pet-age").textContent = createAgeText(pet.birthYear);

    const img = clone.querySelector(".pet-card-photo img");
    img.src = `./images/${pet.name.toLowerCase()}.jpg`;
    img.onerror = () => img.src = "./images/fallback.jpg";

    clone.querySelector(".pet-card-photo img").alt = `A ${pet.species} named ${pet.name}.`;
    wrapper.appendChild(clone);
  });
  document.querySelector(".list-of-pets").appendChild(wrapper);
}
petsArea();

// pet filter button code
const allButtons = document.querySelectorAll(".pet-filter button");
function handleButtonClick(e) {
  // remove active class from any and all buttons
  allButtons.forEach(button => button.classList.remove("active"));

  // add active class to the specific button that just got clicked
  e.target.classList.add("active");

  // actualy filter the pets down below
  const currentFilter = e.target.dataset.filter;
  document.querySelectorAll(".pet-card").forEach(el => {
    if (currentFilter == el.dataset.species || currentFilter == "all") {
      el.style.display = "grid";
    } else {
      el.style.display = "none";
    }
  });
}

allButtons.forEach(button => {
  button.addEventListener("click", handleButtonClick);
});
