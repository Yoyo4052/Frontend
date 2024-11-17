import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Page from "./components/Page";
import Questions from "./components/Questions";
import Results from "./components/Results";
import AdminPage from "./components/AdminPage";
import AdminLogin from "./components/AdminLogin";
import AdminQuestions from "./components/AdminQuestions";
import AdminRegister from "./components/AdminRegister";
import Questionaries from "./components/Questionaries";
import Predict from "./components/Predict";
import ResultsFODA from "./components/ResultsFODA";
import AdminTest from "./components/AdminTest";
import AdminTestResults from "./components/AdminTestResults";

const App = () => {
  
  return (
    <Router>    
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/login" element = {<Login/>}>
          </Route>
          <Route path="/adminlogin" element = {<AdminLogin/>}>
          </Route>
          <Route path="/register" element = {<Register/>}>   
          </Route>
          <Route path="/adminregister" element = {<AdminRegister/>}>   
          </Route>
          <Route path="/page" element = {<Page/>}>
          </Route>
          <Route path="/adminpage" element = {<AdminPage/>}>
          </Route>
          <Route path="/questions" element = {<Questions/>}>
          </Route>
          <Route path="/questionaries" element = {<Questionaries/>}>
          </Route>
          <Route path="/adminquestions" element = {<AdminQuestions/>}>
          </Route>
          <Route path="/admintest" element = {<AdminTest/>}>
          </Route>
          <Route path="/admintestresults" element = {<AdminTestResults/>}>
          </Route>
          <Route path="/results" element = {<Results/>}>
          </Route>
          <Route path="/resultsFODA" element = {<ResultsFODA/>}>
          </Route>
          <Route path="/predict" element = {<Predict/>}>
          </Route>
        </Routes>
    </Router>
  );
};

export default App;
