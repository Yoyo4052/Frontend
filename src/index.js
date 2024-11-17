import React from "react";
import ReactDOM from "react-dom";
import "bulma/css/bulma.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import App from "./App";
import "./style.css";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

import { UserProvider } from "./context/UserContext";
import { AdminProvider } from "./context/AdminContext";

ReactDOM.render(
  <AdminProvider>
    <UserProvider>
      <App />
    </UserProvider>
  </AdminProvider>,
  document.getElementById("root")
);
