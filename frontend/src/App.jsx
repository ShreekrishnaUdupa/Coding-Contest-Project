import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import GetContestPage from "./pages/GetContestPage";
import GetProblemsPage from "./pages/GetProblemsPage";
import ProblemPage from "./pages/ProblemPage";

export default function App() {
  return (
		<BrowserRouter>
      <Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
        <Route path="/:name" element={<GetContestPage />} />
        <Route path="/:name/problems" element={<GetProblemsPage />} />
        <Route path="/problems" element={< ProblemPage />} />
			</Routes>
		</BrowserRouter>
  );
}
