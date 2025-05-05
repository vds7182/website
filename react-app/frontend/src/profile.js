import React, { useState, useEffect } from "react";
import "./profile.css";
import { auth, db } from "./backend/firebase-config"; // Import Firebase Auth and Firestore
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

function Profile() {
  const [user, setUser] = useState(null); // To store the logged-in user
  const [profileData, setProfileData] = useState({
    workExperience: "",
    skills: "",
  }); // To store profile data
  const [editing, setEditing] = useState(false); // Track edit mode

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setProfileData(userDoc.data());
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleSave = async () => {
    if (user) {
      try {
        await setDoc(doc(db, "users", user.uid), profileData);
        setEditing(false);
        alert("Profile updated successfully!");
      } catch (error) {
        console.error("Error saving profile:", error);
        alert("Failed to save profile.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="profile">
      <header>
        <div className="profile-container">
          <img
            src="/ava.jpg"
            width="200"
            height="200"
            alt="Аватар користувача"
          />
         
        {editing ? (
          <textarea
            name="Name"
            value={profileData.Name}
            onChange={handleChange}
            placeholder="Додайте ваше імʼя"
          className="small-textarea"/>
        ) : (
          <p>{profileData.Name || "Імʼя не вказано"}</p>
        )}        </div>
      </header>

      <div className="bottom-text">
        <p>Телефон: {user ? user.phoneNumber || "Не вказано" : "Не авторизовано"}</p>
        <p>Email: {user ? user.email : "Не авторизовано"}</p>
      </div>

      <div className="text_l">
        <p>ПРОФЕСІЙНИЙ ДОСВІД</p>
        {editing ? (
          <textarea
            name="workExperience"
            value={profileData.workExperience}
            onChange={handleChange}
            placeholder="Додайте досвід роботи"
          className="big-textarea"/>
        ) : (
          <p>{profileData.workExperience || "Досвід роботи не вказано"}</p>
        )}

        <p>НАВИЧКИ</p>
        {editing ? (
          <textarea
            name="skills"
            value={profileData.skills}
            onChange={handleChange}
            placeholder="Додайте навички"
            className="big-textarea"/>
        ) : (
          <p>{profileData.skills || "Навички не вказано"}</p>
        )}

        {user && (
          <button onClick={editing ? handleSave : handleEditToggle} className="change">
            {editing ? "Зберегти" : "Редагувати"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Profile;
