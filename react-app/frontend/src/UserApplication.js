import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import {auth} from './backend/firebase-db'; // 🔹 Используем существующий Firebase Auth

console.log("Auth instance:", auth)
function UserApplication() {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserData(currentUser.uid);
        fetchApplications(currentUser.uid);
      }
    });
    return () => unsub();
  }, []);

  // ✅ Запрос данных пользователя
  const fetchUserData = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/user/${userId}`);
      const data = await res.json();
      console.log('User Data:', data);
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  // ✅ Запрос заявок пользователя
  const fetchApplications = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/applications/${userId}`);
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Отправка заявки
  const createApplication = async (applicationData) => {
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:5000/applications/${user.uid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData),
      });
      const data = await res.json();
      console.log('Application Response:', data);
    } catch (err) {
      console.error('Error creating application:', err);
    }
  };

  // ✅ Создание пользователя
  const createUser = async (userData) => {
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:5000/user/${user.uid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      console.log('User Response:', data);
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  if (loading) return <p>Завантаження...</p>;

  return (
    <div>
      <h2>Подані заявки</h2>
      {applications.length === 0 ? (
        <p>У вас ще немає поданих заявок.</p>
      ) : (
        <ul>
          {applications.map(app => (
            <li key={app.id}>
              Заявка на вакансію: {app.vacancyId} 
            </li>
          ))}
        </ul>
      )}
      
    </div>
  );
}

export default UserApplication;
