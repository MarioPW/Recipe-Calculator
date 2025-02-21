import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { Link } from "react-router-dom";
import { Menu } from "./calculator/Menu";
import { useMainContext } from "../context/MainContext";

export const NavBar = () => {
  const { user } = useMainContext()
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
      alert("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
  {  !user?  (<nav className="navbar navbar-dark">
        <Link className="navbar-brand text-light fs-6 fst-italic" to="/"><img src="/favicon.png" alt="@PW" style={{ width: "30px" }} /> Recipe Calculator</Link>

        <ul className="d-flex flex-row mb-2 mb-0 gap-3" id="nav-user-info">
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
              <Link to="/login-register" className="btn myButton-success">Log In / Register </Link>
            </li>
          )}
        </ul>
      </nav>): <Menu signOut={signOut} auth={auth} />}
    </>
  );
};
