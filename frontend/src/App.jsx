import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OtpVerificationPage from "./pages/OtpVerificationPage";
import OAuthCallbackPage from "./pages/OAuthCallbackPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import CreateContestPage from "./pages/CreateContestPage";
import GetContestPage from "./pages/GetContestPage";
import GetProblemsPage from "./pages/GetProblemsPage";
import ProblemPage from "./pages/ProblemPage";

export default function App() {

  return (
		<BrowserRouter>
      <Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/login' element={<LoginPage />} />
				<Route path='/register' element={<RegisterPage />} />
        <Route path='/otp-verification' element={<OtpVerificationPage />} />
        <Route path='/oauth/callback' element={<OAuthCallbackPage />} />
        <Route path='forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/contests/create' element={<CreateContestPage />} />
        <Route path='/:contestCode' element={<GetContestPage />} />
        <Route path='/contests/id/:contestId/problems' element={<GetProblemsPage />} />
        <Route path='/contests/id/:contestId/problems/number/:problemNo' element={< ProblemPage />} />
			</Routes>
		</BrowserRouter>
  );
}
