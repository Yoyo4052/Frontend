import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem("awesomeLeadsToken"));

  useEffect(() => {
    const fetchUser = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };

      const response = await fetch("https://back-rendimiento-estudiantes.onrender.com/users/me", requestOptions);
      const data = await response.json();
      if (!response.ok) {
        setToken(null);
      }
      localStorage.setItem("awesomeLeadsToken", token);
      console.log(data)
      localStorage.setItem("user_id", data.id)
      localStorage.setItem("user_nickname", data.nickname)

    };
    fetchUser();
  }, [token]);

  return (
    <UserContext.Provider value={[token, setToken]}>
      {props.children}
    </UserContext.Provider>
  );
};
