import React, { useState, useContext } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import Alert from "./Alert"; // Importa Alert en lugar de ErrorMessage
import { UserContext } from "../context/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [, setToken] = useContext(UserContext);

  const submitLogin = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=&username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&scope=&client_id=&client_secret=`,
    };

    try {
      const response = await fetch("https://back-rendimiento-estudiantes.onrender.com/token/", requestOptions);
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage("Error al iniciar sesión. Verifica tus credenciales.");
        setPassword(""); // Limpia el campo de contraseña en caso de error
      } else {
        setToken(data.access_token);
        localStorage.setItem("user_nickname", email);
        navigate('/page');
      }
    } catch (error) {
      setErrorMessage("Error de conexión. Inténtalo más tarde.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitLogin();
  };

  return (
    <MDBContainer className="my-5 gradient-form">
      <MDBRow>
        <MDBCol col='6' className="mb-5">
          <div className="d-flex flex-column ms-5">
            <div className="text-center">
              <h4 className="mt-1 mb-5 pb-1">Bienvenido a la plataforma</h4>
            </div>
            <p>Por favor, inicia sesión en tu cuenta</p>

            {/* Mensaje de error usando Alert */}
            {errorMessage && <Alert message={errorMessage} type="danger" />}

            <form onSubmit={handleSubmit}>
              <MDBInput 
                wrapperClass='mb-4' 
                label='Nombre de usuario' 
                type='text'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <MDBInput 
                wrapperClass='mb-4' 
                label='Contraseña' 
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="text-center pt-1 mb-5 pb-1">
                <MDBBtn type="submit" className="mb-4 w-100 gradient-custom-2">
                  Iniciar sesión
                </MDBBtn>
                
              </div>

            </form>

            <div className="d-flex flex-column align-items-center pb-4">
              <p className="mb-0">¿No tienes una cuenta?</p>
              <MDBBtn outline color='danger' className='mx-2 mb-3 w-75'>
                <Link to="/register" className="text-danger text-decoration-none">
                  Regístrate
                </Link>
              </MDBBtn>

              <p className="mb-0">¿Eres administrador?</p>
              <MDBBtn outline color='primary' className='mx-2 w-75'>
                <Link to="/adminlogin" className="text-primary text-decoration-none">
                  Inicia sesión como administrador
                </Link>
              </MDBBtn>
            </div>
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

export default Login;
