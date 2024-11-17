import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminTestResults = () => {
  const [token] = useContext(AdminContext);
  const [resultados, setResultados] = useState([]);
  const [id, setId] = useState(localStorage.getItem("admin_id"));

  const getResults = async () => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    const response = await fetch(`https://3708-2806-2f0-21c0-fd27-dd43-6331-feef-454d.ngrok-free.app/verPruebas/${id}/`, requestOptions);
    const data = await response.json();

    if (!response.ok) {
      console.log(data.detail);
    } else {
      setResultados(data);
    }
  };

  useEffect(() => {
    getResults();
  }, []);

  // Verifica si hay un token activo
  if (!token) {
    return <p>No hay sesión activa delincuente</p>; // No renderiza nada si el token es null
  }

  // Función para dividir el texto basado en Fortalezas, Oportunidades, Debilidades y Amenazas
  const dividirTexto = (texto) => {
    const inicioFortalezas = texto.indexOf("Fortalezas:");
    const inicioOportunidades = texto.indexOf("Oportunidades:");
    const inicioDebilidades = texto.indexOf("Debilidades:");
    const inicioAmenazas = texto.indexOf("Amenazas:");

    const fortalezas = texto.substring(inicioFortalezas + "Fortalezas:".length, inicioOportunidades).replace(/\*/g, '').trim();
    const oportunidades = texto.substring(inicioOportunidades + "Oportunidades:".length, inicioDebilidades).replace(/\*/g, '').trim();
    const debilidades = texto.substring(inicioDebilidades + "Debilidades:".length, inicioAmenazas).replace(/\*/g, '').trim();
    const amenazas = texto.substring(inicioAmenazas + "Amenazas:".length).replace(/\*/g, '').trim();

    return [fortalezas, oportunidades, debilidades, amenazas];
  };

  return (
    <div className="container-fluid position-absolute top-50 start-50 translate-middle">
        <div className="row">
            <div className="d-flex flex-column border rounded-5 shadow bg-secondary bg-opacity-10 bg-gradient col-8 offset-2 align-items-center p-4" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                <h2 className="mb-4 text-primary">Resultados FODA</h2>
                {resultados.length === 0 ? (
                    <div className="alert alert-warning w-100 text-center">
                        No tienes resultados disponibles :(
                    </div>
                ) : (
                    <table className="table table-hover table-striped">
                        <thead className="table-dark">
                            <tr>
                                <th scope="col" className= "text-white">Cuestionario ID</th>
                                <th scope="col" className= "text-white">Fortalezas</th>
                                <th scope="col" className= "text-white">Oportunidades</th>
                                <th scope="col" className= "text-white">Debilidades</th>
                                <th scope="col" className= "text-white">Amenazas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultados.map((resultado, index) => (
                                <tr key={index}>
                                    <td className="fw-bold">{resultado.id_cuestionario}</td>
                                    {dividirTexto(resultado.resultados).map((seccion, idx) => (
                                        <td key={idx}>{seccion}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <Link to="/adminpage" className="my-3 text-secondary fw-bold text-decoration-none">
                    <button className="btn btn-success text-light rounded-4">Volver</button>
                </Link>
            </div>
        </div>
    </div>
);
};

export default AdminTestResults;