import "./App.css";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import HomePage from "./Pages/HomePage";
import OrdersPage from "./Pages/OrdersPage";
import PrivateRoute from "./PrivateRoute/index";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="user/login" element={<LoginPage />} />
        <Route element={<PrivateRoute role="USER" />}>
          <Route path="user/home" element={<HomePage />} />
          <Route path="/orders/:userId" element={<OrdersPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
