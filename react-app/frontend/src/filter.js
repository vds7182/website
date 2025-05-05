import React, { useState } from "react";
import { db } from "./backend/firebase-config"; // Import Firestore from your firebase.js file
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import "./filter.css";

function Filter() {
  const [vacancies, setVacancies] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [city, setCity] = useState("");
  const [sortByDate, setSortByDate] = useState(false);

  // Helper to parse Firestore timestamps
  const parseTimestamp = (timestamp) => {
    if (!timestamp) return "Невідома дата";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  // Fetch vacancies from Firebase with filtering and sorting
  const searchVacancies = async () => {
    try {
      let vacancyQuery = collection(db, "vacations");

      if (keyword) {
        vacancyQuery = query(
          vacancyQuery,
          where("About", ">=", keyword),
          where("About", "<=", keyword + "\uf8ff")
        );
      }

      if (minSalary) {
        vacancyQuery = query(vacancyQuery, where("Salary", ">=", Number(minSalary)));
      }

      if (city) {
        vacancyQuery = query(vacancyQuery, where("City", "==", city));
      }

      if (sortByDate) {
        vacancyQuery = query(vacancyQuery, orderBy("add_date", "desc")); // Sort by most recent
      }

      const querySnapshot = await getDocs(vacancyQuery);
      const filteredVacancies = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setVacancies(filteredVacancies);
    } catch (error) {
      console.error("Error fetching vacancies from Firestore:", error);
      setVacancies([]);
    }
  };

  return (
    <div>
      {/* Search Form */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Введіть вакансію"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input
          type="number"
          placeholder="Введіть мінімальну зарплату"
          value={minSalary}
          onChange={(e) => setMinSalary(e.target.value)}
        />
        <select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">Всі міста</option>
          <option value="Львів">Львів</option>
          <option value="Київ">Київ</option>
          <option value="Харків">Харків</option>
          <option value="Одеса">Одеса</option>
          <option value="Дніпро">Дніпро</option>
        </select>
        <label>
          <input
            type="checkbox"
            checked={sortByDate}
            onChange={() => setSortByDate(!sortByDate)}
          />
          Сортувати за датою (від новіших до старших)
        </label>
      </div>

      {/* Search Button */}
      <button onClick={searchVacancies}>Шукати</button>

      {/* Results */}
      <div className="vacancy-results">
        {vacancies.length === 0 ? (
          <p>Вакансій не знайдено.</p>
        ) : (
          vacancies.map((vacancy) => (
            <div key={vacancy.id} className="vacancy-card">
              <h3>{vacancy.City || "Місто не вказано"}</h3>
              <p className="salary">${vacancy.Salary || "Зарплата не вказана"}</p>
              <p className="description">{vacancy.About || "Опис відсутній"}</p>
              <p className="date">Опубліковано: {parseTimestamp(vacancy.add_date)}</p>
              <button
                onClick={(e) => {
                  e.target.textContent = "Заявку подано";
                  e.target.style.backgroundColor = "green";
                  e.target.disabled = true;
                }}
                style={{ backgroundColor: "#007bff", color: "white" }}
              >
                Подати заявку
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Filter;
