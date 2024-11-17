import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText } from "mdb-react-ui-kit";
import ErrorMessage from "./ErrorMessage";
import { UserContext } from "../context/UserContext";

const Questionaries = () => {
  const [token] = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [cuestionarios, setCuestionarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getQuestionaries();
  }, []);

  const getQuestionaries = async () => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    const response = await fetch("https://cbc4-2806-2f0-21c0-fd27-dd43-6331-feef-454d.ngrok-free.app/verCuestionarios/", requestOptions);
    const data = await response.json();

    if (!response.ok) {
      setErrorMessage(data.detail);
    } else {
      setCuestionarios(data);
    }
  };

  const handleNavigateClick = (cuestionario) => {
    navigate(`/questions?id=${cuestionario.id}`);
  };

  // Verifica si hay un token activo
  if (!token) {
    return <p className="text-danger text-center mt-5">No hay sesión activa. Inicia sesión para continuar.</p>;
  }

  return (
    <MDBContainer className="my-5">
      <MDBRow className="justify-content-center">
        <MDBCol size="12" md="10" lg="8">
          <div className="text-center mb-4">
            <h1 className="fw-bold text-black">Cuestionarios Disponibles</h1>
            <p className="text-muted">Selecciona uno de los cuestionarios para comenzar.</p>
          </div>

          {cuestionarios.length > 0 ? (
            cuestionarios
              .filter(cuestionario => cuestionario.id !== 6) // Excluir el cuestionario con id = 6
              .map((cuestionario) => (
                <MDBCard className="mb-4 border-0 shadow-sm" key={cuestionario.id}>
                  <MDBCardBody>
                    <MDBCardTitle className="text-secondary">
                      <h5>Cuestionario #{cuestionario.id}</h5>
                    </MDBCardTitle>
                    <MDBCardText>{cuestionario.descripcion}</MDBCardText>
                    <MDBBtn
                      className="w-100 mt-2 gradient-custom-2"
                      onClick={() => handleNavigateClick(cuestionario)}
                    >
                      Empezar Cuestionario
                    </MDBBtn>
                  </MDBCardBody>
                </MDBCard>
              ))
          ) : (
            <p className="text-center text-muted">No hay cuestionarios disponibles en este momento.</p>
          )}

          {errorMessage && <ErrorMessage message={errorMessage} />}

          <div className="text-center mt-5">
            <Link to="/page">
              <MDBBtn color="secondary" className="px-4">Volver al Menú Principal</MDBBtn>
            </Link>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Questionaries;
