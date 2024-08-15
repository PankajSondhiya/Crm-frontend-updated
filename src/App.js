import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Auth from "./Pages/Auth";
import { Route, Routes } from "react-router-dom";
import Admin from "./Pages/Admin";
import Customer from "./Pages/Customer";
import Engineer from "./Pages/Engineer";
import Passwordreset from "./Pages/PasswordReset";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/engineer" element={<Engineer />}></Route>
        <Route path="/admin" element={<Admin />}></Route>
        <Route path="/customer" element={<Customer />}></Route>
        <Route path="/" element={<Auth />}></Route>
        <Route path="/passwordreset" element={<Passwordreset />}></Route>
      </Routes>
    </div>
  );
}

export default App;
