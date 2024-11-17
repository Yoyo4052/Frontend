import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { AdminContext } from "../context/AdminContext";

const AdminHeader = () => {
  const [token, setToken] = useContext(AdminContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    navigate('/adminlogin')
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

export default AdminHeader;