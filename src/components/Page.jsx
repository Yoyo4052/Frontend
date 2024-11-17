import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBCard, MDBCardBody, MDBIcon } from "mdb-react-ui-kit";

const Page = () => {
  const [token, setToken] = useContext(UserContext);
  const [nickname, setNickname] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedNickname = localStorage.getItem("user_nickname");
    if (storedNickname) {
      setNickname(storedNickname);
    }
  }, []);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("user_nickname");
    navigate("/login");
  };

  if (!token) {
    return (
      <MDBContainer fluid className="d-flex align-items-center justify-content-center vh-100">
        <p>No hay sesión activa, por favor <Link to="/login">inicia sesión</Link>.</p>
      </MDBContainer>
    );
  }

  return (
    <MDBContainer fluid className="vh-100 d-flex align-items-center justify-content-center bg-light position-relative">
      <MDBCard className="shadow-lg p-4" style={{ maxWidth: "700px", width: "100%" }}>
        <MDBCardBody className="text-center">
          <h2 className="mb-4">{nickname ? `¡Bienvenido, ${nickname}!` : "Cargando..."}</h2>
          
          {/* Sección de cuestionarios y resultados FODA */}
          <div className="mb-4">
            <h5 className="text-secondary">En esta sección encontrarás los cuestionarios necesarios para la generación de un FODA.</h5>
            <MDBRow>
              <MDBCol md="6" className="mb-3">
                <MDBBtn
                  tag={Link}
                  to="/questionaries"
                  color="light"
                  className="w-100 square-btn gradient-custom-2 MDBCardBody"
                >
                  <MDBIcon icon="clipboard" size="2x" className="mb-2 text-white" />
                  <p className="text-white">Cuestionarios</p>
                </MDBBtn>
              </MDBCol>
              <MDBCol md="6" className="mb-3">
                <MDBBtn
                  tag={Link}
                  to="/resultsFODA"
                  color="light"
                  className="w-100 square-btn gradient-custom-2 MDBCardBody"
                >
                  <MDBIcon icon="th-large" size="2x" className="mb-2 text-white" />
                  <p className="text-white">Resultados FODA</p>
                </MDBBtn>
              </MDBCol>
            </MDBRow>
          </div>

          {/* Sección de predicción de rendimiento */}
          <div className="mb-4">
            <h5 className="text-secondary">Aquí podrás realizar una predicción de tu rendimiento y consultar los resultados.</h5>
            <MDBRow>
              <MDBCol md="6" className="mb-3">
                <MDBBtn
                  tag={Link}
                  to="/predict"
                  color="light"
                  className="w-100 square-btn gradient-custom-2 MDBCardBody"
                >
                  <MDBIcon icon="chart-line" size="2x" className="mb-2 text-white" />
                  <p className="text-white">Predicción de rendimiento</p>
                </MDBBtn>
              </MDBCol>
              <MDBCol md="6" className="mb-3">
                <MDBBtn
                  tag={Link}
                  to="/results"
                  color="light"
                  className="w-100 square-btn gradient-custom-2 MDBCardBody"
                >
                  <MDBIcon icon="list-alt" size="2x" className="mb-2 text-white " />
                  <p className="text-white">Resultados predicción</p>
                </MDBBtn>
              </MDBCol>
            </MDBRow>
          </div>
        </MDBCardBody>
        <MDBBtn
        onClick={handleLogout}
        color="danger"
        className="position-absolute"
        style={{
          bottom: "20px",
          right: "20px",
          padding: "8px 12px",
          fontSize: "0.8rem"
        }}
      >
        <MDBIcon icon="sign-out-alt" size="lg" className="me-1" />
        <span>Cerrar sesión</span>
      </MDBBtn>
      </MDBCard>

      {/* Botón de Cerrar Sesión en la esquina inferior derecha */}
      
    </MDBContainer>
  );
};

export default Page;
