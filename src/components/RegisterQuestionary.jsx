import React, { useState } from "react";

function RegisterQuestionary({ getQuestionaries, setShowRegister }) {

  const [descQuestionary, setDescQuestionary] = useState("")

  const handleDescChange = (descripcion) => {
    setDescQuestionary(descripcion);
    };

  const registerQuestionary = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ descripcion: descQuestionary, preguntas: []}),
    };

    const response = await fetch(`https://99c1-2806-2f0-21c0-fd27-dd43-6331-feef-454d.ngrok-free.app/registrarCuestionario/`, requestOptions);
    const data = await response.json();

    if (!response.ok) {
      console.log(data.detail);
    } else {
     getQuestionaries();
    }
  };

  return (
    <div className="position-absolute top-50 start-50 translate-middle bg-light border rounded shadow p-4" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <button className="btn bg-danger bg-opacity-50 text-light rounded-4 my-3" onClick={() => setShowRegister(false)}>Cerrar</button>
      <div>
      <p>Nuevo cuestionario</p>
        <h4>Descripción del cuestionario:</h4>
        <div className="form-floating">
          <textarea className="form-control" value={descQuestionary} onChange={(e) => handleDescChange(e.target.value)}></textarea>
        </div>
        <hr /> 
        <button className="btn bg-success bg-opacity-50 text-light rounded-4 my-3"onClick={registerQuestionary}>Registrar cuestionario</button> 
      </div>
    </div>
  );
}

export default RegisterQuestionary;