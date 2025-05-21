import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import TodoList from "./TodoList";
import SignUp from "./SignUp";
import LogIn from "./LogIn";
import { AuthProvider, useAuth } from "./AuthContext";
import type { ReactNode } from "react";

function App() {
  const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
      return;
    }

    if (!user) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <ProtectedRoute> <TodoList/> </ProtectedRoute> } />
          <Route path="/login" element={ <LogIn/> } />
          <Route path="/signup" element={ <SignUp/> }/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
