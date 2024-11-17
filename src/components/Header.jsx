import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../context/UserContext";

const Header = () => {
  const [token, setToken] = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    localStorage.setItem("user_id", null)
    localStorage.setItem("user_nickname", null)
    navigate('/login')
  };

  return (
    <div className="has-text-centered m-6">
      {token && (
        <button className="button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      )}
    </div>
  );
};

export default Header;
