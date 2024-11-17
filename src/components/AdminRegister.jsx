import React, { useState } from "react";
import { Link } from "react-router-dom";
import ErrorMessage from "./ErrorMessage";
import ConfirmationMessage from "./ConfirmationMessage";

const AdminRegister = () => {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const submitRegistration = async () => {
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: nickname, contrasena: password }),
      };

      const response = await fetch("https://99c1-2806-2f0-21c0-fd27-dd43-6331-feef-454d.ngrok-free.app/registrarAdmin/", requestOptions);
      
      let data;
      try {
        data = await response.json();
      } catch (error) {
        throw new Error("Error procesando la respuesta del servidor");
      }

      if (!response.ok) {
        setErrorMessage(data.detail || "Error al registrar el administrador");
      } else {
        setConfirmationMessage("¡Has registrado a un nuevo administrador correctamente!");
        setErrorMessage(null);
      }
    } catch (error) {
      setErrorMessage(error.message || "Error en el registro. Por favor, inténtalo más tarde.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmationPassword && password.length > 5) {
      submitRegistration();
    } else {
      setErrorMessage("Asegúrate de que las contraseñas coinciden y tienen más de 5 caracteres");
    }
  };

  return (
    <div className="container-fluid position-absolute top-50 start-50 translate-middle">
      <div className="row justify-content-center">
        <form 
          className="d-flex flex-column border rounded-5 shadow-lg bg-light col-lg-4 col-md-6 col-sm-8 align-items-center p-4"
          onSubmit={handleSubmit}
        >
          <Link to="/adminpage" className="w-100">
            <button className="btn btn-success text-light rounded-4 w-100 my-3">Volver</button>
          </Link>
          <h2 className="text-center mb-4">Registrar Administrador</h2>
          <div className="form-group w-100">
            <input 
              className="form-control form-control-lg rounded-4 shadow-sm text-center fs-5 fw-bold my-3" 
              type="text"
              placeholder="Ingresa tu nombre de usuario"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
          </div>
          <div className="form-group w-100">
            <input 
              className="form-control form-control-lg rounded-4 shadow-sm text-center fs-5 fw-bold my-3" 
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group w-100">
            <input 
              className="form-control form-control-lg rounded-4 shadow-sm text-center fs-5 fw-bold my-3" 
              type="password"
              placeholder="Confirma tu contraseña"
              value={confirmationPassword}
              onChange={(e) => setConfirmationPassword(e.target.value)}
              required
            />
          </div>
          <ErrorMessage message={errorMessage} />
          <ConfirmationMessage message={confirmationMessage} />
          <button 
            className="btn btn-primary text-light rounded-4 col-6 my-3" 
            type="submit"
          >
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
