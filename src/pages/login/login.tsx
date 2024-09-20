import Navbar from "../../components/Navbar/navbar";
import "./login.css";
//import { useState } from "react";

const Login = () => {
  //const [id, setId] = useState("");
  //const [password, setPassword] = useState("");
  //const [error, setError] = useState("");

  return (
    <div className="login-layout">
      <Navbar activeSection="login" />
      <div className="login-content">
        <main className="login-container">
          <h2>INICIO DE SESIÓN</h2>
          <p>Ingresa con tus credenciales</p>

          <label htmlFor="id">ID</label>
          <input type="text" id="id" placeholder="0000 00000 0000" />

          <label htmlFor="password">Contraseña</label>
          <input type="password" id="password" placeholder="Contraseña" />

          <div className="options">
            <div className="remember-me">
              <input type="checkbox" id="remember-me" />
              <label id="remember-label" htmlFor="remember-me">
                Recordar mis datos
              </label>
            </div>
            <a href="/" className="forgot-password">
              Olvidé mi contraseña
            </a>
          </div>

          <button className="continue-button">Continuar</button>
        </main>
      </div>
    </div>
  );
};

export default Login;
