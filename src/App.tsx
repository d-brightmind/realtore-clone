import { BrowserRouter as Router, Routes, Route } from "react-router";
import Home from "./pages/home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import Offers from "./pages/Offers";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/sign-in" element={<SignIn />}/>
          <Route path="/sign-up" element={<SignUp />}/>
          <Route path="/forgot-password" element={<Profile />}/>
          <Route path="/profile" element={<Offers />}/>
          <Route path="/offers" element={<ForgotPassword />}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
