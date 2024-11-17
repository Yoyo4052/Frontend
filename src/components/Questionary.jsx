import React, { useState } from "react";

//Componente para admin!!!
//Componente para EDITAR LOS CUESTIONARIOS

function Questionary({ cuestionario , setShowEdit, descCuestionario, handleDescChange, getQuestionaries}) {

  const [questionText, setQuestionText] = useState("");
  const [preguntas, setPreguntas] = useState(cuestionario.preguntas);

  const handleQuestionText = (value) => {  
    setQuestionText(value);
  };

  const setDescripcion = async () => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ descripcion: descCuestionario, preguntas: cuestionario.preguntas, id: cuestionario.id, resultados: cuestionario.resultados}),
    };

    const response = await fetch(`https://3708-2806-2f0-21c0-fd27-dd43-6331-feef-454d.ngrok-free.app/CambiarCuestionario/${cuestionario.id}`, requestOptions);
    const data = await response.json();

    if (!response.ok) {
      console.log(data.detail);
    } else {
     getQuestionaries();
    }
  };

  const registerQuestion = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_cuestionario: cuestionario.id, pregunta: questionText, tipo: "FODA"}),
    };

    const response = await fetch("https://3708-2806-2f0-21c0-fd27-dd43-6331-feef-454d.ngrok-free.app/registrarPregunta/", requestOptions);
    const data = await response.json();

    if (!response.ok) {
      console.log(data.detail);
    } else {

      setPreguntas(prevPreguntas => [...prevPreguntas, { id: data.id, pregunta: questionText, tipo: "FODA" }]);
    setQuestionText(""); 
    getQuestionaries();
    }
  };

  const deleteQuestion = async (pregunta_id) => {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };

    const response = await fetch(`https://3708-2806-2f0-21c0-fd27-dd43-6331-feef-454d.ngrok-free.app/EliminarPregunta/${pregunta_id}/`, requestOptions);
    const data = await response.json();

    if (!response.ok) {
      console.log(data.detail);
    } else {
      const updatedPreguntas = preguntas.filter(pregunta => pregunta.id !== pregunta_id);
      // Actualizar el estado de las preguntas
      setPreguntas(updatedPreguntas);
      // Refrescar la lista de preguntas
      getQuestionaries();
    }
  };

  return (
    <div className="position-absolute top-50 start-50 translate-middle bg-light border rounded shadow p-4" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <button className="btn bg-danger bg-opacity-50 text-light rounded-4 my-3" onClick={() => setShowEdit(false)}>Cerrar</button>
      <div key={cuestionario.id}>
      <p>Cuestionario #{cuestionario.id}</p>
        <h4>Descripción del cuestionario:</h4>
        <div className="form-floating">
          <textarea className="form-control" defaultValue={cuestionario.descripcion}  onChange={(e) => handleDescChange(e.target.value)}></textarea>
        </div>   
        <button className="btn bg-success bg-opacity-50 text-light rounded-4 my-3"onClick={setDescripcion}>Guardar descripción</button> 
        <h3>Preguntas:</h3>
        <ul className="list-group">
          {preguntas.map((pregunta, index) => (
            <li key={index} className="list-group-item">
              <p>Pregunta {index + 1}: {pregunta.pregunta}</p>
              <p>Tipo de pregunta: {pregunta.tipo}</p>         
              <button className="btn bg-danger bg-opacity-50 text-light rounded-4 my-3" onClick={() => deleteQuestion(pregunta.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
        <hr />
        <div className="form-floating">
          <textarea className="form-control" value={questionText} onChange={(e) => handleQuestionText(e.target.value)}></textarea>
        </div>  
        <button className="btn bg-success bg-opacity-50 text-light rounded-4 my-3"onClick={registerQuestion}>Añadir pregunta</button> 
      </div>
    </div>
  );
}

export default Questionary;


