import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import { MDBCard, MDBCardBody, MDBTypography } from "mdb-react-ui-kit";

const ResultsFODA = () => {
  const [token] = useContext(UserContext);
  const [resultados, setResultados] = useState([]);
  const [id, setId] = useState(localStorage.getItem("user_id"));
  const latestResultId = localStorage.getItem("latest_result_id");
  const [openCuestionarios, setOpenCuestionarios] = useState([]); 

  const getResults = async () => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    const response = await fetch(`https://3708-2806-2f0-21c0-fd27-dd43-6331-feef-454d.ngrok-free.app/verResultadosFODA/${id}/`, requestOptions);
    const data = await response.json();

    if (!response.ok) {
      console.log(data.detail);
    } else {
      setResultados(data);
      const initialVisibility = data.reduce((acc, resultado) => {
        acc[resultado.id] = false;
        return acc;
      }, {});
      setOpenCuestionarios(initialVisibility);
    }
  };

  useEffect(() => {
    getResults();
  }, []);

  const deleteResultFODA = async (resultadoFODA_id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este resultado?");
    if (!confirmDelete) return;

    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };

    const response = await fetch(`https://3708-2806-2f0-21c0-fd27-dd43-6331-feef-454d.ngrok-free.app/EliminarResultadoFODA/${resultadoFODA_id}/`, requestOptions);
    const data = await response.json();

    if (!response.ok) {
      console.log(data.detail);
    } else {
      getResults();
    }
  };

  const dividirTexto = (texto) => {
    const inicioFortalezas = texto.indexOf("Fortalezas:");
    const inicioOportunidades = texto.indexOf("Oportunidades:");
    const inicioDebilidades = texto.indexOf("Debilidades:");
    const inicioAmenazas = texto.indexOf("Amenazas:");

    const fortalezasTexto = texto.substring(inicioFortalezas + "Fortalezas:".length, inicioOportunidades).replace(/\*/g, '').trim();
    const oportunidadesTexto = texto.substring(inicioOportunidades + "Oportunidades:".length, inicioDebilidades).replace(/\*/g, '').trim();
    const debilidadesTexto = texto.substring(inicioDebilidades + "Debilidades:".length, inicioAmenazas).replace(/\*/g, '').trim();
    const amenazasTexto = texto.substring(inicioAmenazas + "Amenazas:".length).replace(/\*/g, '').trim();

    const dividirEnPuntos = (seccionTexto) => {
      return seccionTexto.match(/[A-Z][^A-Z]*/g) || []; 
    };

    return {
      fortalezas: dividirEnPuntos(fortalezasTexto),
      oportunidades: dividirEnPuntos(oportunidadesTexto),
      debilidades: dividirEnPuntos(debilidadesTexto),
      amenazas: dividirEnPuntos(amenazasTexto),
    };
  };

  const toggleCuestionario = (id) => {
    setOpenCuestionarios((prev) => ({
      ...prev,
      [id]: !prev[id], 
    }));
  };

  if (!token) {
    return <p>No hay sesión activa</p>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">Resultados FODA</h2>
      {resultados.length === 0 ? (
        <div className="alert alert-warning text-center">
          No tienes resultados disponibles :(
        </div>
      ) : (
        resultados.map((resultado, index) => {
          const { fortalezas, oportunidades, debilidades, amenazas } = dividirTexto(resultado.resultados);
          return (
            <div key={index} className={`mb-3 ${resultado.id === latestResultId ? "highlight" : ""}`}>
              <div className="row">
                <button
                  onClick={() => toggleCuestionario(resultado.id)}
                  className="btn btn-outline-primary mx-2 text-start col-md-10"
                >
                  {`Resultado # ${resultado.id} de Cuestionario ${resultado.id_cuestionario}`}
                </button>
                <button
                  className="btn btn-danger text-start col-md-1 mx-4"
                  onClick={() => deleteResultFODA(resultado.id)}
                >
                  Eliminar
                </button>
              </div>

              {openCuestionarios[resultado.id] && (
                <div className="row mt-3">
                  <MDBCard className="col-md-5 m-2 p-3 shadow-sm MDBCardBody">
                    <MDBTypography tag="h5" className="fw-bold text-primary">F</MDBTypography>
                    <MDBCardBody>
                      <h6 className="fw-bold">Fortalezas</h6>
                      <ul>
                        {fortalezas.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </MDBCardBody>
                  </MDBCard>

                  <MDBCard className="col-md-5 m-2 p-3 shadow-sm MDBCardBody">
                    <MDBTypography tag="h5" className="fw-bold text-primary">O</MDBTypography>
                    <MDBCardBody>
                      <h6 className="fw-bold">Oportunidades</h6>
                      <ul>
                        {oportunidades.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </MDBCardBody>
                  </MDBCard>

                  <MDBCard className="col-md-5 m-2 p-3 shadow-sm MDBCardBody">
                    <MDBTypography tag="h5" className="fw-bold text-primary">D</MDBTypography>
                    <MDBCardBody>
                      <h6 className="fw-bold">Debilidades</h6>
                      <ul>
                        {debilidades.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </MDBCardBody>
                  </MDBCard>

                  <MDBCard className="col-md-5 m-2 p-3 shadow-sm MDBCardBody">
                    <MDBTypography tag="h5" className="fw-bold text-primary">A</MDBTypography>
                    <MDBCardBody>
                      <h6 className="fw-bold">Amenazas</h6>
                      <ul>
                        {amenazas.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
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

export default ResultsFODA;
