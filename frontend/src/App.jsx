import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OtpVerification from "./pages/OtpVerification";
import OAuthCallback from "./pages/OAuthCallback";
import ForgotPassword from "./pages/ForgotPassword";
import CreateContest from "./pages/CreateContest";
import GetContest from "./pages/GetContest";
import GetAllProblems from "./pages/GetAllProblems";
import GetProblem from "./pages/GetProblem";

export default function App() {

  return (
		<BrowserRouter>
      <Routes>
				<Route path='/' element={<Home />} />
				<Route path='/login' element={<Login />} />
				<Route path='/register' element={<Register />} />
        <Route path='/otp-verification' element={<OtpVerification />} />
        <Route path='/oauth/callback' element={<OAuthCallback />} />
        <Route path='forgot-password' element={<ForgotPassword />} />
        <Route path='/contests/create' element={<CreateContest />} />
        <Route path='/:contestCode' element={<GetContest />} />
        <Route path='/contests/id/:contestId/problems' element={<GetAllProblems />} />
        <Route path='/contests/id/:contestId/problems/number/:problemNo' element={< GetProblem />} />
			</Routes>
		</BrowserRouter>
  );
}
