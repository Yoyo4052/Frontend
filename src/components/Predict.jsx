import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn, MDBIcon } from 'mdb-react-ui-kit';

const Predict = () => {
  const [token] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Cargando.");
  const [id] = useState(localStorage.getItem("user_id"));
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState(0);
  const [answer, setAnswer] = useState("3");
  const [answers, setAnswers] = useState([]); 
  const [resultado, setResultado] = useState("");

  useEffect(() => {
    if (isLoading) {
      const messages = ["Cargando.", "Cargando..", "Cargando..."];
      let index = 0;

      const interval = setInterval(() => {
        setLoadingMessage(messages[index]);
        index = (index + 1) % messages.length;
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const getQuestions = async () => {
    const response = await fetch(`https://99c1-2806-2f0-21c0-fd27-dd43-6331-feef-454d.ngrok-free.app/verCuestionario/6`);
    const data = await response.json();

    if (response.ok) {
      setQuestions(data.preguntas);
      setAnswers(Array.from({ length: data.preguntas.length }, () => ""));
    } else {
      console.log(data.detail);
    }
  };

  const registerAnswers = async () => {
    setIsLoading(true);

    if (questions.length !== answers.length) {
      console.error("Los arrays id_pregunta y ponderacion deben tener el mismo tamaño");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_cuestionario: 6,
          pregunta: questions[i].pregunta,
          id_usuario: id,
          ponderacion: answers[i]
        })
      };

      const response = await fetch(`https://99c1-2806-2f0-21c0-fd27-dd43-6331-feef-454d.ngrok-free.app/registrarRespuestas/`, requestOptions);
      if (!response.ok) {
        console.error("Error:", await response.json());
      }
    }

    const resultResponse = await fetch(`https://99c1-2806-2f0-21c0-fd27-dd43-6331-feef-454d.ngrok-free.app/gemini/${id}/`);
    const resultData = await resultResponse.json();
    if (resultResponse.ok) {
      setResultado(resultData);
    } else {
      console.log(resultData);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getQuestions();
  }, []);

  useEffect(() => {
    setAnswer(answers[question]);
  }, [question]);

  const nextQuestion = () => {
    if (question < questions.length - 1) setQuestion(question + 1);
  };

  const backQuestion = () => {
    if (question > 0) setQuestion(question - 1);
  };

  const saveQuestion = () => {
    const updatedAnswers = [...answers];
    updatedAnswers[question] = answer;
    setAnswers(updatedAnswers);
  };

  useEffect(() => {
    saveQuestion();
  }, [answer]);

  const goToQuestion = (index) => {
    setQuestion(index);
  };

  const allAnswersCompleted = answers.every(ans => ans && ans.trim() !== "");

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
          <div className="d-flex flex-column ms-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <Link to="/page" className="text-secondary fw-bold text-decoration-none">
                <MDBBtn color="success">Volver</MDBBtn>
              </Link>
              <span className="badge bg-primary fs-6">Pregunta {question + 1} de {questions.length}</span>
            </div>

            <div className="text-center mb-4">
              {questions.length > 0 && (
                <p className="fs-5">{questions[question].pregunta}</p>
              )}
            </div>

            <div className="btn-group d-flex justify-content-around mb-4" role="group">
              {[...Array(5)].map((_, i) => (
                <MDBBtn
                  key={i}
                  color={answer === String(i + 1) ? "primary" : "secondary"}
                  onClick={() => setAnswer(String(i + 1))}
                >
                  {i + 1}
                </MDBBtn>
              ))}
            </div>

            <div className="d-flex justify-content-between mb-4">
              {question > 0 && (
                <MDBBtn onClick={backQuestion} outline>Regresar</MDBBtn>
              )}
              {question < questions.length - 1 && (
                <MDBBtn onClick={nextQuestion} outline>Siguiente</MDBBtn>
              )}
            </div>

            {allAnswersCompleted && (
              <MDBBtn onClick={registerAnswers} className="gradient-custom-2 w-100 my-3" disabled={resultado !== ""}>
                {isLoading ? loadingMessage : "Enviar respuestas"}
              </MDBBtn>
            )}

            {resultado && (
              <div className="mt-4 p-3 rounded bg-light">
                <h5>Resultado generado, puedes mirarlo en:</h5>
                <Link to="/results" className="w-100">
                  <MDBBtn color="success" className="w-100 my-3">Resultados</MDBBtn>
                </Link>
              </div>
            )}

            {/* Navigation Dots */}
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

export default Predict;
