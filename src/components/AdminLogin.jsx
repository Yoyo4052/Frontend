import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import ErrorMessage from "./ErrorMessage";
import { AdminContext } from "../context/AdminContext";
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdb-react-ui-kit';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [, setToken] = useContext(AdminContext);

  const submitLogin = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: JSON.stringify(
        `grant_type=&username=${email}&password=${password}&scope=&client_id=&client_secret=`
      ),
    };

    const response = await fetch("https://b14d-2806-2f0-21c0-fd27-dd43-6331-feef-454d.ngrok-free.app/tokenAdmin/", requestOptions);
    const data = await response.json();

    if (!response.ok) {
      setErrorMessage(data.detail);
    } else {
      setToken(data.access_token);
      navigate('/adminpage');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitLogin();
  };

  return (
    <MDBContainer className="my-5 gradient-form">
      <MDBRow className="justify-content-center">
        <MDBCol col='6' className="mb-5">
          <div className="d-flex flex-column ms-5">
            <div className="text-center">
              <h4 className="mt-1 mb-5 pb-1">Inicio de sesión de administrador</h4>
            </div>

            <form onSubmit={handleSubmit}>
              <MDBInput 
                wrapperClass='mb-4' 
                label='Nombre de usuario' 
                id='form1' 
                type='text'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <MDBInput 
                wrapperClass='mb-4' 
                label='Contraseña' 
                id='form2' 
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <ErrorMessage message={errorMessage} />

              <div className="text-center pt-1 mb-5 pb-1">
                <MDBBtn type="submit" className="mb-4 w-100 gradient-custom-2">
                  Iniciar sesión
                </MDBBtn>
              </div>
            </form>

            <div className="d-flex flex-column align-items-center pb-4">
              <MDBBtn outline color='primary' className='mx-2 w-75'>
                <Link to="/login" className="text-primary text-decoration-none">
                  Inicia sesión como usuario normal
                </Link>
              </MDBBtn>
            </div>
          </div>
        </MDBCol>

        <MDBCol col='6' className="mb-5">
          <div className="d-flex flex-column justify-content-center gradient-custom-2 h-100 mb-4">
            <div className="text-white px-3 py-4 p-md-5 mx-md-4">
              <h4 className="mb-4">Acceso exclusivo para administradores</h4>
              <p className="small mb-0">
                Utiliza tu cuenta de administrador para gestionar los contenidos y usuarios de la plataforma.
              </p>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default AdminLogin;
