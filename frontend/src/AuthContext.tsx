import axios from "axios";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { API_BASE_URL } from "./main";

export type TodoEntry = {
  title: string,
  isCompleted: boolean,
}

export type User = {
  username: string,
  entries: Array<TodoEntry>,
  token: string,
}

type CurrentUserContextType = {
  user: User | null,
  updateEntries: (entries: Array<TodoEntry>) => void,
  login: (user: User) => void,
  logout: () => void,
  isLoading: boolean,
}

const AuthContext = createContext<CurrentUserContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (user: User) => {
    if (user.token) {
      setUser(user);
      localStorage.setItem("token", user.token)
    } else {
      console.error("Login failed: Authentication token is missing.");
      throw new Error("Log in failed. Authentication token is missing")
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const updateEntries = (entries: Array<TodoEntry>) => {
    if (user) {
      setUser({ ...user, entries });
    }
  };

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("token");

      if (token) {
        await axios.get(`${API_BASE_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setUser({
          username: response.data.username,
          entries: response.data.entries,
          token,
        }))
        .catch(error => {
          logout();
          console.error(`Error: ${error}`);
        });
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const ContextValue: CurrentUserContextType = {
    user,
    updateEntries,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={ContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
