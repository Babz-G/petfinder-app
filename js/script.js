const form = document.querySelector(".petForm");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  getToken().then((token) => {
    fetch(
      `https://api.petfinder.com/v2/animals?type=${data.option}&location=${data.zipcode}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => showPets(data.animals))
      .catch((err) => console.log("Error fetching pets:", err));
  });

  form.reset();
});

function getToken() {
  return fetch("https://api.petfinder.com/v2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: "JTtzxFWPxVRN4IxdEwkVf5iPGcv2pIxSqQmU5uBCCISztW4pEy",
      client_secret: "SggcSXBKsIficupx9WgfC80qIAdUSjeVygEh2VI5",
    }),
  })
    .then((res) => res.json())
    .then((data) => data.access_token);
}

function showPets(pets) {
  const container = document.querySelector(".card-container");
  container.innerHTML = "";

  if (!pets || pets.length === 0) {
    container.innerHTML = "<p>No pets found. Try a different search!</p>";
    return;
  }

  pets.forEach((pet) => {
    const card = document.createElement("div");
    card.classList.add("pet-card");

    // Check if pet has a photo
    if (pet.photos?.[0]?.medium) {
      const image = document.createElement("img");
      image.src = pet.photos[0].medium;
      image.alt = pet.name;
      card.appendChild(image);
    } else {
      // Create a placeholder div with text and paw print background
      const placeholder = document.createElement("div");
      placeholder.classList.add("image-placeholder");
      placeholder.innerHTML = `
        <p>Sorry, there's no image<br>of ${pet.name}<br>at this time</p>
      `;
      card.appendChild(placeholder);
    }

    const name = document.createElement("h3");
    name.textContent = pet.name;
    card.appendChild(name);

    const breed = document.createElement("p");
    breed.textContent = `Breed: ${pet.breeds.primary || "Unknown"}`;
    card.appendChild(breed);

    const color = document.createElement("p");
    color.textContent = `Color: ${pet.colors.primary || "Unknown"}`;
    card.appendChild(color);

    const description = document.createElement("p");
    description.textContent = pet.description || "No description available.";
    card.appendChild(description);

    container.appendChild(card);
  });
}
