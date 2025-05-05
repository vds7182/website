let vacanciesData = []; // Store vacancies globally

document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3001/vacancies")
    .then(response => response.json())
    .then(data => {
      vacanciesData = data;
      displayVacancies(vacanciesData);
    })
    .catch(error => console.error("Fetch error:", error));
});

function displayVacancies(data) {
  const gridContainer = document.getElementById("grid-container");
  gridContainer.innerHTML = "";

  data.forEach(vacancy => {
    const gridItem = document.createElement("div");
    gridItem.className = "vacancy-card";
    
    // Create the button
    const button = document.createElement("button");
    button.textContent = "Подати заявку";
    button.style.backgroundColor = "#007bff"; // Initial color
    button.style.color = "white"; 

    // Add click event to change text and color
    button.addEventListener("click", () => {
        button.textContent = "Заявку подано";
        button.style.backgroundColor = "green"; // Change color to green
        button.disabled = true; // Optional: Disable the button after clicking
    });

    gridItem.innerHTML = `
      <h3>${vacancy.City}</h3>
      <p class="salary">$${vacancy.Salary}</p>
      <p class="description">${vacancy.About}</p>
    `;

    // Append button separately to avoid overwriting innerHTML
    gridItem.appendChild(button);

    gridContainer.appendChild(gridItem);
});

}

function applySorting() {
  const sortBy = document.getElementById("sort-options").value;
  let sortedData = [...vacanciesData];

  if (sortBy === "salary_asc") sortedData.sort((a, b) => a.Salary - b.Salary);
  if (sortBy === "salary_desc") sortedData.sort((a, b) => b.Salary - a.Salary);
  if (sortBy === "city") sortedData.sort((a, b) => a.City.localeCompare(b.City));

  displayVacancies(sortedData);
}
