"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<any>(null); 

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedEmail, setLoggedEmail] = useState<string | null>(null);
  const [isAuthLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (token) {
      fetch("http://localhost:8080/api/v1/user/details", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setIsLoggedIn(true);
            setLoggedEmail(email);
            setAuthLoaded(true);
          } else if (response.status === 401) {
            handleLogout();
          }
        })
        .catch(() => {
          handleLogout();
        });
    } else {
      setAuthLoaded(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setIsLoggedIn(false);
    setLoggedEmail(null);
  };

  const login = (token: string, email: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    setIsLoggedIn(true);
    setLoggedEmail(email);
    setAuthLoaded(true);
  };

  const logout = () => {
    handleLogout();
  };

  const getJwtToken = () => {
    return localStorage.getItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, login, logout, getJwtToken, loggedEmail, isAuthLoaded }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
