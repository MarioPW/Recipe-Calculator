import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { signOut  } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { Link } from "react-router-dom";
import { Menu } from "./calculator/Menu";
import { useMainContext } from "../context/MainContext";

export const NavBar = () => {
  const { user } = useMainContext()
 const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/Recipe-Calculator");
      alert("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-dark" id="navbarMain">
      <div className="container-fluid">
        <Link className="navbar-brand text-light" to="/Recipe-Calculator"><img src="favicon.png" alt="@PW" style={{width: "30px"}} /> Recipe Calculator</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent1"
          aria-controls="navbarSupportedContent1"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarSupportedContent1"
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
                  <button className="btn myButton-success" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item list-group-item text-light fs-6">
                <Link to="/Recipe-Calculator/login-register" className="btn myButton-success">Log In / Register </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
    {user && <Menu />}
    </>
  );
};
