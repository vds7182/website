import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth, signOut } from './backend/firebase-config'; // Ensure signOut is exported from firebase.js
import Home from './home';
import Profile from './profile';
import Jobs from './vacancies';
import Filter from './filter';
import Login from './login'; 
import Sing from './singin';
import UserApplications from './UserApplication'
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Set the current user state
    });

    return () => unsubscribe(); // Clean up the listener
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Log out the user
      alert('You have been logged out!');
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <ul>
              <li><Link to="/">Головна</Link></li>
              <li><Link to="/jobs">Вакансії</Link></li>
              <li><Link to="/filter">Сортувати вакансії</Link></li>
              {!user && (
                <>
                  <li><Link to="/login">Вхід</Link></li>
                  <li><Link to="/singin">Створити акаунт</Link></li>
                </>
              )}
              {user && (

                <>
                <li><Link to="/profile">Мій профіль</Link></li>
                <li><Link to="applications">Мої заявки</Link></li>
                <li>
                  <button onClick={handleLogout} className="logout-button">
                    Вийти
                  </button>
                </li>
                
                </>
              )}
            </ul>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/filter" element={<Filter />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/singin" element={!user ? <Sing /> : <Navigate to="/" />} />
          <Route path="applications" element={user ? <UserApplications/> : <Navigate to="/"/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
