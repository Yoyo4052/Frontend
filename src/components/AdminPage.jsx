import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import AdminHeader from "./AdminHeader";

const AdminPage = () => {
  const [token] = useContext(AdminContext);

  // Verifica si hay un token activo
  if (!token) {
    return <p>No hay sesión activa delincuente</p>; // No renderiza nada si el token es null
  }

  return (
    <div className="container-fluid position-absolute top-50 start-50 translate-middle">
      <div className="row justify-content-center">
        <div className="d-flex flex-column border rounded-5 shadow-lg bg-light col-lg-4 col-md-6 col-sm-8 align-items-center p-4">
          <h2 className="text-center mb-4">Página de Administración</h2>
          <Link to="/adminquestions" className="w-100">
            <button className="btn btn-success text-light rounded-4 w-100 my-3">
              Gestionar cuestionarios
            </button>
          </Link>
          <Link to="/adminregister" className="w-100">
            <button className="btn btn-success text-light rounded-4 w-100 my-3">
              Añadir administrador
            </button>
          </Link>
          <Link to="/admintestresults" className="w-100">
            <button className="btn btn-success text-light rounded-4 w-100 my-3">Resultados pruebas</button>
          </Link>
          <footer className="mt-4">
            <p className="text-center text-secondary fw-bold">© 2024 Tu Aplicación</p>
          </footer>
          <AdminHeader />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
