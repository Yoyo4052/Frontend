import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import { MDBCard, MDBCardBody, MDBTypography } from "mdb-react-ui-kit";

const Results = () => {
  const [token] = useContext(UserContext);
  const [resultados, setResultados] = useState([]);
  const [id, setId] = useState(localStorage.getItem("user_id"));
  const [openResultados, setOpenResultados] = useState({}); // Controlar visibilidad de cada resultado

  const getResults = async () => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    const response = await fetch(`https://back-rendimiento-estudiantes.onrender.com/verResultados/${id}/`, requestOptions);
    const data = await response.json();

    if (!response.ok) {
      console.log(data.detail);
    } else {
      setResultados(data);
      // Inicializar la visibilidad de cada resultado en falso (cerrado)
      const initialVisibility = data.reduce((acc, resultado) => {
        acc[resultado.id] = false;
        return acc;
      }, {});
      setOpenResultados(initialVisibility);
    }
  };

  useEffect(() => {
    getResults();
  }, []);

  const deleteResult = async (resultado_id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este resultado?");
    if (!confirmDelete) return; // Detener si el usuario cancela
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };

    const response = await fetch(`https://back-rendimiento-estudiantes.onrender.com/EliminarResultado/${resultado_id}/`, requestOptions);
    const data = await response.json();

    if (!response.ok) {
      console.log(data.detail);
    } else {
      getResults();
    }
  };

  // Verifica si hay un token activo
  if (!token) {
    return <p>No hay sesión activa</p>; // No renderiza nada si el token es null
  }

  // Función para dividir el texto en secciones y quitar asteriscos y palabras redundantes
  const dividirTexto = (texto) => {
    const inicioAnalisis = texto.indexOf("Análisis de Rendimiento");
    const inicioPrediccion = texto.indexOf("Predicción de Rendimiento a Futuro");
    const inicioRecomendaciones = texto.indexOf("Recomendaciones");

    const analisis = texto.substring(inicioAnalisis + "Análisis de Rendimiento".length, inicioPrediccion).replace(/\*/g, '').trim();
    const prediccion = texto.substring(inicioPrediccion + "Predicción de Rendimiento a Futuro".length, inicioRecomendaciones).replace(/\*/g, '').trim();
    const recomendaciones = texto.substring(inicioRecomendaciones + "Recomendaciones".length).replace(/\*/g, '').trim();

    return { analisis, prediccion, recomendaciones };
  };

  const toggleResultado = (id) => {
    setOpenResultados((prev) => ({
      ...prev,
      [id]: !prev[id], // Alternar solo el estado de este resultado
    }));
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">Resultados</h2>
      {resultados.length === 0 ? (
        <div className="alert alert-warning text-center">
          No tienes resultados disponibles :(
        </div>
      ) : (
        resultados.map((resultado, index) => {
          const { analisis, prediccion, recomendaciones } = dividirTexto(resultado.resultados);
          return (
            <div key={index} className="mb-3">
              <div className="row">
                <button
                  onClick={() => toggleResultado(resultado.id)}
                  className="btn btn-outline-primary mx-2 text-start col-md-10"
                >
                  {`Resultado # ${resultado.id} de Cuestionario de análisis de rendimiento`}
                </button>
                <button
                  className="btn btn-danger text-start col-md-1 mx-4"
                  onClick={() => deleteResult(resultado.id)}
                >
                  Eliminar
                </button>
              </div>

              {openResultados[resultado.id] && ( // Mostrar las tarjetas solo si el resultado está abierto
                <div className="row mt-3">
                  <MDBCard className="col-md-3 m-2 p-3 shadow-sm MDBCardBody">
                    <MDBTypography tag="h5" className="fw-bold text-primary">
                      A
                    </MDBTypography>
                    <MDBCardBody>
                      <h6 className="fw-bold">Análisis</h6>
                      <p>{analisis}</p>
                    </MDBCardBody>
                  </MDBCard>
                  <MDBCard className="col-md-3 m-2 p-3 shadow-sm MDBCardBody">
                    <MDBTypography tag="h5" className="fw-bold text-primary">
                      P
                    </MDBTypography>
                    <MDBCardBody>
                      <h6 className="fw-bold">Predicción</h6>
                      <p>{prediccion}</p>
                    </MDBCardBody>
                  </MDBCard>
                  <MDBCard className="col-md-5 m-2 p-3 shadow-sm MDBCardBody">
                    <MDBTypography tag="h5" className="fw-bold text-primary">
                      R
                    </MDBTypography>
                    <MDBCardBody>
                      <h6 className="fw-bold">Recomendaciones</h6>
                      <p>{recomendaciones}</p>
                    </MDBCardBody>
                  </MDBCard>
                </div>
              )}
            </div>
          );
        })
      )}
      <Link to="/page" className="text-secondary fw-bold text-decoration-none d-flex justify-content-center mt-4">
        <button className="btn btn-success text-light rounded-4">Volver</button>
      </Link>
    </div>
  );
};

export default Results;
