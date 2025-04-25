// contexts/AuthContext.js
"use client";

import { createContext, useContext } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const login = async (email, password) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      return result;
    } catch (error) {
      console.error("Erreur de connexion:", error);
      return { error: "Erreur lors de la connexion" };
    }
  };

  const logout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  const register = async (name, email, password) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de l'inscription");
      }

      const result = await login(email, password);
      return result;
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      return { error: error.message || "Erreur lors de l'inscription" };
    }
  };

  return (
    <AuthContext.Provider value={{ session, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
