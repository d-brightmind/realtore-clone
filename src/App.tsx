import { BrowserRouter as Router, Routes, Route } from "react-router";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import Offers from "./pages/Offers";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Router>
        <Header/>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/sign-in" element={<SignIn />}/>
          <Route path="/sign-up" element={<SignUp />}/>
          <Route path="/profile" element={<Profile />}/>
          <Route path="/offers" element={<Offers />}/>
          <Route path="/forgot-password" element={<ForgotPassword />}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
