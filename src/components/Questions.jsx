import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import { GoogleGenerativeAI } from "@google/generative-ai";

const Questions = () => {
  const [token] = useContext(UserContext);
  const [questions, setQuestions] = useState([]);
  const [id, setId] = useState(localStorage.getItem("user_id"));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [generatedText, setGeneratedText] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Estado para manejo de carga
  const location = useLocation();
  const cuestionarioId = new URLSearchParams(location.search).get("id");
  const genAI = new GoogleGenerativeAI('AIzaSyAam0Dijv-W-ryrl_fuJN6ZP9hPjUHbuuM');

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`https://back-rendimiento-estudiantes.onrender.com/verCuestionario/${cuestionarioId}`);
      const data = await response.json();
      if (response.ok) {
        setQuestions(data.preguntas);
        setAnswers(Array(data.preguntas.length).fill("")); // Inicializa respuestas vacías
      } else {
        console.error("Error fetching questions:", data.detail);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    setAnswer(answers[questionIndex]);
  }, [questionIndex]);

  const handleAnswerSelect = (value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = value;
    setAnswers(updatedAnswers);
    setAnswer(value);
  };

  const nextQuestion = () => {
    if (questionIndex < questions.length - 1) setQuestionIndex(questionIndex + 1);
  };

  const previousQuestion = () => {
    if (questionIndex > 0) setQuestionIndex(questionIndex - 1);
  };

  const goToQuestion = (index) => {
    setQuestionIndex(index);
  };

  async function run() {
    setIsLoading(true); // Inicia el estado de carga
    const questionanswers = questions
      .map((question, index) => {
        return `${question.pregunta} ${answers[index]}`;
      })
      .join("\n");

    const prompt = `Por favor, genérame un análisis FODA (Fortalezas, Oportunidades, Debilidades, Amenazas) en base a las siguientes preguntas y respuestas:
    ${questionanswers}
    
    Se está utilizando la escala siguiente para las respuestas:

   5 (Muy de acuerdo) 4 (De acuerdo) 3 (Neutro) 2 (En desacuerdo) 1 (Muy en desacuerdo)
  
   Tienes que ser lo más objetivo posible, no importa si el resultado es bueno o malo.

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

    setGeneratedText(generatedText); // Actualiza el estado con el texto generado

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resultados: generatedText, id_usuario: id, id_cuestionario: cuestionarioId }),
    };

    const resultResponse = await fetch(`https://back-rendimiento-estudiantes.onrender.com/registrarResultadoFODA/`, requestOptions);
    const data = await resultResponse.json();

    setIsLoading(false); // Detiene el estado de carga

    if (!resultResponse.ok) {
      console.log(data);
    } else {
      console.log(data);
    }
  }

  if (!token) {
    return <p>No hay sesión activa</p>;
  }

  return (
    <MDBContainer className="my-5 gradient-form fs-3">
      <MDBRow className="justify-content-center fs-4"
        style={{
          minHeight: "100vh",
          border: "2px solid #ddd",
          borderRadius: "10px",
          width: "60vw",
          maxWidth: "800px",
          minWidth: "500px",
          padding: "20px",
          margin: "0 auto"
        }}>
        <MDBCol col='6' className="mb-5">
        <Link to="/page" className="text-secondary fw-bold text-decoration-none">
                <MDBBtn color="success">Volver</MDBBtn>
              </Link>
          <div className="d-flex flex-column ms-5">
            <div className="text-center mb-4">
              <h4>Pregunta {questionIndex + 1} de {questions.length}</h4>
              {questions.length > 0 && <p>{questions[questionIndex].pregunta}</p>}
            </div>

            <div className="btn-group mb-4" role="group">
              {[...Array(5)].map((_, i) => (
                <MDBBtn
                  key={i}
                  color={answer === String(i + 1) ? "primary" : "secondary"}
                  onClick={() => handleAnswerSelect(String(i + 1))}
                >
                  {i + 1}
                </MDBBtn>
              ))}
            </div>

            <div className="d-flex justify-content-between mb-4">
              {questionIndex > 0 && (
                <MDBBtn onClick={previousQuestion} outline>
                  Regresar
                </MDBBtn>
              )}
              {questionIndex < questions.length - 1 && (
                <MDBBtn onClick={nextQuestion} outline>
                  Siguiente
                </MDBBtn>
              )}
            </div>

            {answers.every(ans => ans !== "") && (
              <MDBBtn
              onClick={run}
              className="gradient-custom-2"
              disabled={generatedText !== ""} // Deshabilita el botón si ya hay resultado generado
            >
              {isLoading ? (
                <span>Cargando{'.'.repeat((new Date().getSeconds() % 3) + 1)}</span> // Animación "Cargando..."
              ) : (
                "Enviar respuestas"
              )}
            </MDBBtn>
            )}

            {generatedText && (
              <div className="mt-4 p-3 rounded bg-light">
                <h5>Resultado generado, puedes mirarlo en: </h5>
                <Link to="/resultsfoda" className="w-100">
                  <button className="btn btn-success text-light rounded-4 w-100 my-3">Resultados</button>
                </Link>
              </div>
            )}
            <div className="d-flex justify-content-center mt-4">
              {questions.map((_, index) => (
                <MDBIcon
                  key={index}
                  icon="circle"
                  fas
                  size="sm"
                  className={`mx-1 ${answers[index] ? "text-primary" : "text-secondary"}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => goToQuestion(index)}
                />
              ))}
            </div>
            <div className="text-center mt-4">
              <p className="fw-bold fs-5">Por favor, responde cada pregunta utilizando la escala siguiente:</p>
              <ul className="list-inline">
                <li className="list-inline-item px-2 fs-5">5 (Muy de acuerdo)</li>
                <li className="list-inline-item px-2 fs-5">4 (De acuerdo)</li>
                <li className="list-inline-item px-2 fs-5">3 (Neutro)</li>
                <li className="list-inline-item px-2 fs-5">2 (En desacuerdo)</li>
                <li className="list-inline-item px-2 fs-5">1 (Muy en desacuerdo)</li>
              </ul>
            </div>

            

            
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Questions;
