import React, { useEffect, useState } from "react";
import { getDocs, collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./backend/firebase-config"; // Your initialized Firebase config
import './vacancies.css';

function Vacancies() {
  const [user, setUser] = useState(null);
  const [vacancies, setVacancies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Track authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 🔹 Fetch all vacancies from Firestore
  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "vacations"));
        const fetchedVacancies = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVacancies(fetchedVacancies);
      } catch (error) {
        console.error("Error fetching vacancies from Firestore:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVacancies();
  }, []);

  // 🔹 Handle job application
  const handleApply = async (vacancyId, e) => {
    try {
      const applicationId = `${user.uid}_${vacancyId}`;
      const applyForm = {
        userId: user.uid,
        vacancyId: vacancyId,
        appliedAt: serverTimestamp(),
      };
  
      await setDoc(doc(db, "apply", applicationId), applyForm);
  
      e.target.textContent = "Заявку подано";
      e.target.style.backgroundColor = "green";
      e.target.disabled = true;
      console.log("Nice");
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  };
  

  // 🔹 Display all vacancy cards
  const displayVacancies = () => {
    return vacancies.map((vacancy) => (
      <div className="vacancy-card" key={vacancy.id}>
        <h3>{vacancy.City}</h3>
        <p className="salary">₴ {vacancy.Salary}</p>
        <p className="description">{vacancy.About}</p>
        {user && (
          <button
            onClick={(e) => handleApply(vacancy.id, e)}
            style={{ backgroundColor: "#007bff", color: "white" }}
          >
            Подати заявку
          </button>
        )}
      </div>
    ));
  };

  return (
    <div>
      <h1>Available Vacancies</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div id="grid-container" className="vacancy-grid">
          {displayVacancies()}
        </div>
      )}
    </div>
  );
}

export default Vacancies;
