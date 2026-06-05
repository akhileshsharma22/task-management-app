import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("token")));

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const handleUnauthorized = (event) => {
      logout();
      toast.error(event.detail || "Your session expired. Please sign in again.");
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);

    const loadUser = async () => {
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.data.user);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    if (localStorage.getItem("token")) loadUser();
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  const authenticate = async (mode, values) => {
    const { data } = await api.post(`/auth/${mode}`, values);
    localStorage.setItem("token", data.data.token);
    setUser(data.data.user);
    return data.data.user;
  };

  const updateUser = (nextUser) => setUser(nextUser);

  const value = useMemo(
    () => ({ user, loading, login: (v) => authenticate("login", v), register: (v) => authenticate("register", v), logout, updateUser }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
