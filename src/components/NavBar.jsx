import React, { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, signOut  } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { AuxNavBar } from "./calculator/AuxNavBar";


export const NavBar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && currentUser.emailVerified) {
        setUser({
          email: currentUser.email,
          displayName: currentUser.displayName || null,
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/index.html";
      alert("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-dark" id="navbarMain">
      <div className="container-fluid">
        <h1 className="navbar-brand text-light">@PW Recipe Calculator</h1>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarSupportedContent"
        >
          <ul className="d-flex flex-lg-row flex-column mb-2 mb-lg-0 gap-3" id="nav-user-info">
            {user ? (
              <>
                <li className="nav-item list-group-item text-light fs-6">
                  <a className="nav-link text-light fs-6" href="#">
                    {user.displayName || user.email}
                  </a>
                </li>
                <li className="nav-item list-group-item text-light fs-6">
                  <a
                    className="nav-link myButton-success"
                    href="templates/calculator.html"
                  >
                    Go to Calculator
                  </a>
                </li>
                <li className="nav-item list-group-item text-light fs-6">
                  <button className="btn myButton-success" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
                
              </>
            ) : (
              <li className="nav-item list-group-item text-light fs-6">
                <span>Not logged in</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
    {user && <AuxNavBar />}
    </>
  );
};
