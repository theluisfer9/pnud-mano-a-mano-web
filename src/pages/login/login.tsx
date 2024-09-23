import Navbar from "../../components/Navbar/navbar";
import { useState } from "react";
import "./login.css";

const Login = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  //const [error, setError] = useState("");
  const login = () => {
    if (id === "" || password === "") {
      alert("Por favor, llena todos los campos");
    } else {
      // Save localstorage token
      // Redirect for now to /nueva-noticia
      const user = {
        name: "Admin",
        role: "news-editor",
        pictureUrl: "https://picsum.photos/200",
      };
      localStorage.setItem("mano-a-mano-token", JSON.stringify(user));
      window.location.href = "/nueva-noticia";
    }
  };
  return (
    <div className="login-layout">
      <Navbar activeSection="login" />
      <div className="login-content">
        <main className="login-container">
          <h2>INICIO DE SESIÓN</h2>
          <p>Ingresa con tus credenciales</p>

          <label htmlFor="id">ID</label>
          <input
            type="text"
            id="id"
            placeholder="0000 00000 0000"
            onChange={(e) => {
              setId(e.target.value);
            }}
          />

          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder="Contraseña"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

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

          <button className="continue-button" onClick={login}>
            Continuar
          </button>
        </main>
      </div>
    </div>
  );
};

export default Login;
