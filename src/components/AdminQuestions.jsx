import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorMessage from "./ErrorMessage";
import { AdminContext } from "../context/AdminContext";
import Questionary from "./Questionary";
import RegisterQuestionary from "./RegisterQuestionary";

const AdminQuestions = () => {
  const [token] = useContext(AdminContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [cuestionarios, setCuestionarios] = useState([]);
  const [selectedCuestionario, setSelectedCuestionario] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [descCuestionario, setDescCuestionario] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getQuestionaries();
  }, []);

  const getQuestionaries = async () => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    };

    const response = await fetch("https://99c1-2806-2f0-21c0-fd27-dd43-6331-feef-454d.ngrok-free.app/verCuestionarios/", requestOptions);
    const data = await response.json();

    if (!response.ok) {
      setErrorMessage(data.detail);
    } else {
      setCuestionarios(data);
    }
  };

  const handleEditClick = (cuestionario) => {
    setShowEdit(true);
    setSelectedCuestionario(cuestionario);
  };

  const handleRegisterClick = () => {
    setShowRegister(true);
  };

  const handleDescChange = (descripcion) => {
    setDescCuestionario(descripcion);
  };

  const deleteQuestionary = async (cuestionario_id) => {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };

    const response = await fetch(`https://99c1-2806-2f0-21c0-fd27-dd43-6331-feef-454d.ngrok-free.app/EliminarCuestionario/${cuestionario_id}/`, requestOptions);
    const data = await response.json();

    if (!response.ok) {
      console.log(data.detail);
    } else {
      getQuestionaries();
    }
  };

  const handleNavigateClick = (cuestionario) => {
    navigate(`/admintest?id=${cuestionario.id}`);
};

  // Verifica si hay un token activo
  if (!token) {
    return <p>No hay sesión activa delincuente</p>;
  }

  return (
    <div className="container-fluid position-absolute top-50 start-50 translate-middle">
      <div className="row justify-content-center">
        <div className="d-flex flex-column border rounded-5 shadow-lg bg-light col-lg-6 col-md-8 col-sm-10 align-items-center p-4" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <Link to="/adminpage" className="w-100 mb-3">
            <button className="btn btn-success text-light rounded-4">Volver</button>
          </Link>
          <h1 className="text-center mb-4">Lista de Cuestionarios</h1>
          <div className="w-100">
            {cuestionarios.map((cuestionario) => (
              <div className="border rounded-4 p-3 mb-3" key={cuestionario.id}>
                <h4 className="mb-3">Cuestionario #{cuestionario.id}: {cuestionario.descripcion}</h4>
                <button className="btn btn-primary text-light rounded-4 w-100 mb-2" onClick={() => handleEditClick(cuestionario)}>Editar</button>
                <button className="btn btn-danger text-light rounded-4 w-100 mb-2" onClick={() => deleteQuestionary(cuestionario.id)}>Eliminar</button>
                <button className="btn btn-success text-light rounded-4 w-100 mb-2" onClick={() => handleNavigateClick(cuestionario)}>Probar cuestionario</button>
              </div>
            ))}
          </div>
          {showEdit && (
            <Questionary 
              cuestionario={selectedCuestionario} 
              setShowEdit={setShowEdit} 
              descCuestionario={descCuestionario} 
              handleDescChange={handleDescChange} 
              getQuestionaries={getQuestionaries} 
            />
          )}
          {showRegister && (
            <RegisterQuestionary 
              cuestionario={selectedCuestionario} 
              setShowRegister={setShowRegister} 
              descCuestionario={descCuestionario} 
              handleDescChange={handleDescChange} 
              getQuestionaries={getQuestionaries} 
            />
          )}
          <button className="btn btn-success text-light rounded-4 w-100 mt-3" onClick={handleRegisterClick}>Añadir cuestionario</button>
          <ErrorMessage message={errorMessage} />
        </div>
      </div>
    </div>
  );
};

export default AdminQuestions;
