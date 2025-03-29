let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");
  const toyUrl = "http://localhost:3000/toys";

  // Fetch and display toys
  function fetchToys() {
      fetch(toyUrl)
          .then(response => response.json())
          .then(toys => {
              toyCollection.innerHTML = ""; // Clear before rendering
              toys.forEach(renderToy);
          });
  }

  function renderToy(toy) {
      let card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
          <h2>${toy.name}</h2>
          <img src="${toy.image}" class="toy-avatar" />
          <p>${toy.likes} Likes</p>
          <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
      `;

      card.querySelector(".like-btn").addEventListener("click", () => increaseLikes(toy));

      toyCollection.appendChild(card);
  }

  // Add a new toy
  toyForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const newToy = {
          name: e.target.name.value,
          image: e.target.image.value,
          likes: 0
      };

      fetch(toyUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newToy)
      })
      .then(response => response.json())
      .then(toy => renderToy(toy));

      e.target.reset();
  });

  // Increase likes on a toy
  function increaseLikes(toy) {
      let newLikes = toy.likes + 1;

      fetch(`${toyUrl}/${toy.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ likes: newLikes })
      })
      .then(response => response.json())
      .then(updatedToy => {
          document.querySelector(`button[data-id="${toy.id}"]`).previousElementSibling.textContent = `${updatedToy.likes} Likes`;
      });
  }

  fetchToys();
});
