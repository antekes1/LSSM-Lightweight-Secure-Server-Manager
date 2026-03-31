import React from "react";
import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import HomePage from "./routes/HomePage";
import AdminLayout from "./layouts/AdminLayout";
import AuthPage from "./routes/AuthPage";
import ServerDetails from "./routes/server/ServerPage";
import LogsArchive from "./routes/server/ArchivalLogs";
import AddUser from "./routes/AddUserPage";
import { ToastProvider } from "./contexts/ToastContext";

function App() {
  return (
    <ToastProvider>
    <Router>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/server/:id" element={<ServerDetails />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/logs" element={<LogsArchive />} />
        </Route>
        <Route path="/login" element={<AuthPage/>} />
      </Routes>
    </Router>
    </ToastProvider>
  )
}

export default App;
