import { createContext, useContext, useState, useEffect } from "react";
import { getMe } from "../services/api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("dz_token");
    if (!token) { setLoading(false); return; }
    getMe()
      .then(setUser)
      .catch(() => localStorage.removeItem("dz_token"))
      .finally(() => setLoading(false));
  }, []);

  const loginUser = (token, userData) => {
    localStorage.setItem("dz_token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("dz_token");
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, loading, loginUser, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
