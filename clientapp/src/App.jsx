import { Route, Routes } from "react-router-dom";
import "./App.css";
import IndexPage from "./pages/IndexPage";
import RegisterPage from "./pages/RegisterPage";
import CreateStoryPage from "./pages/CreateStoryPage";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3001/";
axios.defaults.withCredentials = true;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}/>
      <Route index element={<IndexPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/story/create" element={<CreateStoryPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
