import Navbar from "../../components/Navbar/navbar";
import { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/footer";
import logos from "../../data/footers";
import { Eye, EyeClosed } from "lucide-react";
import { login as dbLogin } from "@/db/queries";

const Login = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  //const [error, setError] = useState("");
  const login = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (id === "" || password === "") {
      alert("Por favor, llena todos los campos");
    } else {
      // Save localstorage token
      // Redirect for now to /nueva-noticia
      const user = await dbLogin(id, password);
      if (!user) {
        alert("Error de credenciales");
        return;
      }
      const userToken = {
        name: user.name,
        role: user.role,
        pictureUrl: user.profile_picture,
      };
      localStorage.setItem("mano-a-mano-token", JSON.stringify(userToken));
      window.dispatchEvent(new Event("manoAManoLogin"));
      navigate("/nueva-noticia");
    }
  };
  return (
    <div className="login-layout">
      <Navbar activeSection="login" />
      <div className="login-content">
        <main className="login-container">
          <h2 className="font-bold">INICIO DE SESIÓN</h2>
          <p>Ingresa con tus credenciales</p>

          <label htmlFor="id">ID</label>
          <input
            type="text"
            id="id"
            placeholder="0000 00000 0000"
            value={id}
            onChange={(e) => {
              const numericValue = e.target.value
                .replace(/\D/g, "")
                .slice(0, 14);
              setId(numericValue);
            }}
            onKeyDown={(e) => {
              if (
                !/[0-9]/.test(e.key) &&
                e.key !== "Backspace" &&
                e.key !== "Delete" &&
                e.key !== "ArrowLeft" &&
                e.key !== "ArrowRight"
              ) {
                e.preventDefault();
              }
            }}
            maxLength={14}
          />

          <label htmlFor="password">Contraseña</label>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="***"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <button
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <EyeClosed />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Eye />
                </svg>
              )}
            </button>
          </div>

          <div className="options">
            <div className="remember-me">
              <input type="checkbox" id="remember-me" />
              <label id="remember-label" htmlFor="remember-me">
                Recordar mis datos
              </label>
            </div>
          </div>
          <button className="continue-button" onClick={login}>
            Continuar
          </button>
        </main>
      </div>
      <Footer logos={logos} />
    </div>
  );
};

export default Login;
