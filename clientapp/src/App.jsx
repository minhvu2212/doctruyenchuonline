import { Route, Routes } from "react-router-dom";
import "./App.css";
import IndexPage from "./pages/IndexPage";
import RegisterPage from "./pages/RegisterPage";
import CreateStoryPage from "./pages/CreateStoryPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import AddChapterPage from "./pages/AddChapterPage";
import StoryPage from "./pages/StoryPage";
import ChapterPage from "./pages/ChapterPage";
import Layout from "./Layout";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3001/";
axios.defaults.withCredentials = true;

function App() {
  return (
    <div>
      <Layout>
    <Routes>
      <Route path="/" element={<Layout />}/>
      <Route index element={<IndexPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/story/create" element={<CreateStoryPage />} />
      <Route path="/story/chapter/add/:storyId" element={<AddChapterPage />} />
      <Route path="/stories/:storyId" element={<StoryPage />} />
      <Route path="/stories/:storyId/chapter/:chapterId" element={<ChapterPage />}/>
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
    </Layout>
    </div>
  );
}

export default App;
