import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const AdminTest = () => {
  const [token] = useContext(AdminContext);
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState(0);
  const [answer, setAnswer] = useState(""); // Respuesta inicial vacía
  const [answers, setAnswers] = useState([]); // Estado para las respuestas
  const [id, setId] = useState(localStorage.getItem("admin_id"));
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const cuestionarioId = queryParams.get("id");
  const [text, setText] = useState(""); // Estado para almacenar el texto generado

  const genAI = new GoogleGenerativeAI('AIzaSyBOiy67W-3C1VopAvsaqvEnKWJ_sd0AHQA');

  const getQuestions = async () => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    const response = await fetch(`http://127.0.0.1:8000/verCuestionario/${cuestionarioId}`, requestOptions);
    const data = await response.json();

    if (!response.ok) {
      console.log(data.detail);
    } else {
      setQuestions(data.preguntas);
      // Inicializa con respuestas vacías, sin valor por defecto
      setAnswers(Array.from({ length: data.preguntas.length }, () => ""));
      console.log(questions);
    }
  };

  useEffect(() => {
    getQuestions();
  }, []);

  useEffect(() => {
    setAnswer(answers[question]); // Sincroniza la respuesta con la pregunta actual
  }, [question]);

  const nextQuestion = () => {
    setQuestion((actualQuestion) => actualQuestion + 1);
  };

  const backQuestion = () => {
    setQuestion((actualQuestion) => actualQuestion - 1);
  };

  const saveAnswer = (value) => {
    answers[question] = value;
    setAnswers([...answers]); // Actualiza el estado de las respuestas
    setAnswer(value); // Actualiza el valor de la respuesta seleccionada
  };

  async function run() {
    const questionanswers = questions
      .map((question, index) => {
        return `${question.pregunta} ${answers[index]}`;
      })
      .join("\n");

      const prompt = `Por favor, genérame un análisis FODA (Fortalezas, Oportunidades, Debilidades, Amenazas) en base a las siguientes preguntas y respuestas:
      ${questionanswers}
      
El análisis debe estar estructurado de la siguiente manera:

1. Usa "Fortalezas:", "Oportunidades:", "Debilidades:" y "Amenazas:" como encabezados claros.
2. Desglosa cada sección en puntos de lista usando un asterisco (*) al inicio de cada punto.
3. Asegúrate de que cada sección esté claramente diferenciada y bien organizada, con una lista de al menos 3 elementos por sección.
4. El texto final debe seguir este formato:

Fortalezas:
* Primer punto de fortaleza
* Segundo punto de fortaleza
* ...

Oportunidades:
* Primer punto de oportunidad
* Segundo punto de oportunidad
* ...

Debilidades:
* Primer punto de debilidad
* Segundo punto de debilidad
* ...

Amenazas:
* Primer punto de amenaza
* Segundo punto de amenaza
* ...

Gracias.`;

    console.log(prompt);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = await response.text();

    setText(generatedText); // Actualiza el estado con el texto generado

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resultados: generatedText, id_admin: id, id_cuestionario: cuestionarioId }),
    };

    const resultResponse = await fetch(`http://127.0.0.1:8000/registrarPrueba/`, requestOptions);
    const data = await resultResponse.json();

    if (!response.ok) {
      console.log(data);
    } else {
      console.log(data);
    }
  }

  // Verifica si todas las respuestas han sido completadas
  const allAnswersCompleted = answers.length === questions.length && answers.every((ans) => ans !== "");

  if (!token) {
    return <p>No hay sesión activa delincuente</p>;
  }

  return (
    <div className="container-fluid position-absolute top-50 start-50 translate-middle">
      <div className="row">
        <div className="d-flex flex-column border rounded-5 shadow bg-secondary bg-opacity-10 bg-gradient col-4 offset-4 p-4">
          <div className="d-flex justify-content-between w-100 mb-3">
            <Link to="/adminpage" className="text-secondary fw-bold text-decoration-none">
              <button className="btn btn-success text-light rounded-4">Volver</button>
            </Link>
            <span className="badge bg-primary fs-6">
              Pregunta {question + 1} de {questions.length}
            </span>
          </div>
          <div className="row mb-4">
            <div className="col-12">
              {questions.length > 0 && (
                <div key={questions[question].id}>
                  <h2>Pregunta {question + 1}</h2>
                  <p>{questions[question].pregunta}</p>
                </div>
              )}
            </div>
          </div>
          <div className="row mb-4">
            <div className="btn-group" role="group" aria-label="Basic example">
              {[...Array(5)].map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`btn ${answer === String(i + 1) ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => saveAnswer(String(i + 1))} // Guardar la respuesta al clickar
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
          <div className="row mb-4">
            {question > 0 && (
              <button className="btn col-4 bg-primary bg-opacity-50 text-light rounded-4 my-3" onClick={backQuestion}>
                Regresar
              </button>
            )}
            {question < questions.length - 1 && (
              <button className="btn col-4 offset-4 bg-primary bg-opacity-50 text-light rounded-4 my-3" onClick={nextQuestion}>
                Siguiente
              </button>
            )}
          </div>
          {allAnswersCompleted && (
            <button className="btn bg-primary text-light rounded-4 my-3" onClick={run}>
              Enviar respuestas
            </button>
          )}
          {text && <p>{text}</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminTest;