import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importa useNavigate
import { UserContext } from "../context/UserContext";
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import Alert from "./Alert";

const Register = () => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [, setToken] = useContext(UserContext);
  const navigate = useNavigate(); // Hook para redireccionar

  // Redirección y limpieza de mensajes
  useEffect(() => {
    if (confirmationMessage) {
      const timer = setTimeout(() => {
        setConfirmationMessage("");
        navigate("/login"); // Redirige al login después de 3 segundos
      }, 3000);

      return () => clearTimeout(timer); // Limpia el temporizador al desmontar
    }
  }, [confirmationMessage, navigate]);

  const submitRegistration = async () => {
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, correo: email, contrasena: password, codigo: 0 }),
      };

      const response = await fetch("https://b14d-2806-2f0-21c0-fd27-dd43-6331-feef-454d.ngrok-free.app/registrarUsers/", requestOptions);
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.detail || "Error al registrar el usuario");
      } else {
        setToken(data.access_token);
        setConfirmationMessage("¡Te has registrado correctamente! Redirigiendo a inicio de sesión...");
        setErrorMessage("");
        
        // Limpia los campos del formulario
        setNickname("");
        setEmail("");
        setPassword("");
        setConfirmationPassword("");
      }
    } catch (error) {
      setErrorMessage(
        error.message === "Failed to fetch" 
          ? "Usuario ya existente. Intenta con otro nombre de usuario o inicia sesión."
          : error.message || "Error en el registro. Por favor, inténtalo más tarde."
      );
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
    <MDBContainer className="my-5 gradient-form">
      <MDBRow className="justify-content-center">
        <MDBCol md="6">
          <div className="text-center">
            <h4 className="mt-1 mb-5 pb-1">Crea tu cuenta</h4>
          </div>

          {/* Mensajes de error y confirmación */}
          <Alert message={errorMessage} type="danger" />
          <Alert message={confirmationMessage} type="success" />

          <form onSubmit={handleSubmit}>
            <MDBInput 
              wrapperClass="mb-4" 
              label="Correo electrónico" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <MDBInput 
              wrapperClass="mb-4" 
              label="Nombre de usuario" 
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
            <MDBInput 
              wrapperClass="mb-4" 
              label="Contraseña" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <MDBInput 
              wrapperClass="mb-4" 
              label="Confirma tu contraseña" 
              type="password"
              value={confirmationPassword}
              onChange={(e) => setConfirmationPassword(e.target.value)}
              required
            />

            <div className="text-center pt-1 mb-5 pb-1">
              <MDBBtn type="submit" className="mb-4 w-100 gradient-custom-2">
                Registrarse
              </MDBBtn>
            </div>
          </form>

          <div className="text-center">
            <p className="mb-0">¿Ya tienes una cuenta?</p>
            <MDBBtn outline color="primary" className="mx-2 w-75">
              <Link to="/login" className="text-primary text-decoration-none">
                Inicia sesión 
              </Link>
            </MDBBtn>
          </div>
        </MDBCol>

        <MDBCol col='6' className="mb-5">
  <div className="d-flex flex-column justify-content-center gradient-custom-2 h-100 mb-4">
    <div className="text-white px-3 py-4 p-md-5 mx-md-4">
      <h4 className="mb-4">Bienvenido a tu portal de crecimiento personal</h4>
      <p className="small mb-0">
        Explora nuestros cuestionarios diseñados para ayudarte a descubrir tus fortalezas, oportunidades de mejora y predicciones de rendimiento. Lleva tu desarrollo personal y académico al siguiente nivel.
      </p>
    </div>
  </div>
</MDBCol>

      </MDBRow>
    </MDBContainer>
  );
};

export default Register;
