import "./App.css";
import { Route, Routes } from "react-router";
import Home from "./containers/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import { useAppDispatch } from "./app/hooks";
import { useEffect } from "react";
import { fetchUser } from "./app/slices/authSlice";
import Dashboard from "./containers/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
