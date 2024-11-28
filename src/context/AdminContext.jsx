import React, { createContext, useEffect, useState } from "react";

export const AdminContext = createContext();

export const AdminProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem("adminToken"));

  useEffect(() => {
    const fetchUser = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };

      const response = await fetch("https://back-rendimiento-estudiantes.onrender.com/usersAdmin/me", requestOptions);
      const data = await response.json();
      if (!response.ok) {
        setToken(null);
      }
      localStorage.setItem("adminToken", token);
      console.log(data)
      localStorage.setItem("admin_id", data.id)
    };
    fetchUser();
  }, [token]);

  return (
    <AdminContext.Provider value={[token, setToken]}>
      {props.children}
    </AdminContext.Provider>
  );
};
