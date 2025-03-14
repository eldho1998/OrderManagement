import "./App.css";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import HomePage from "./Pages/HomePage";
import OrdersPage from "./Pages/OrdersPage";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="user/login" element={<LoginPage />} />
        <Route path="user/home" element={<HomePage />} />
        <Route path="/orders/:userId" element={<OrdersPage />} />
      </Routes>
    </div>
  );
};

export default App;
