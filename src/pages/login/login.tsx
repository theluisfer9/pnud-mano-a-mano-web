import Navbar from "../../components/Navbar/navbar";
import { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/footer";
import logos from "../../data/footers";
import { Eye, EyeClosed } from "lucide-react";
import { login as dbLogin } from "@/db/queries";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const Login = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("Restablecer contraseña");
  const [dialogContent, setDialogContent] = useState(
    "Ingresa tu correo electrónico para recibir un enlace de restablecimiento de contraseña."
  );
  const navigate = useNavigate();

  const login = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (id === "" || password === "") {
      alert("Por favor, llena todos los campos");
    } else {
      const user = await dbLogin(id, password);
      console.log(user);
      if (!user) {
        alert("Error de credenciales");
        return;
      }
      const userToken = {
        id: user.id,
        name: user.name,
        role: user.role,
        password: user.password,
        pictureUrl: user.pictureUrl,
        accessFrom: user.accessFrom,
        accessTo: user.accessTo,
        hasChangedPassword: user.hasChangedPassword,
      };
      localStorage.setItem("mano-a-mano-token", JSON.stringify(userToken));
      window.dispatchEvent(new Event("manoAManoLogin"));
      if (user.role === "super-admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  };

  const handleForgotPassword = async () => {
    setIsSending(true);
    // Mock sending email
    setTimeout(() => {
      setIsSending(false);
      setDialogTitle("Correo enviado");
      setDialogContent(
        `Se ha enviado un correo a ${email} con instrucciones para restablecer tu contraseña.`
      );
      setIsSent(true);
    }, 2000);
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
              {showPassword ? <EyeClosed /> : <Eye />}
            </button>
          </div>

          <div className="options">
            <div className="remember-me">
              <input type="checkbox" id="remember-me" />
              <label id="remember-label" htmlFor="remember-me">
                Recordar mis datos
              </label>
            </div>
            <div className="forgot-password">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <a href="#">¿Olvidaste tu contraseña?</a>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogDescription>{dialogContent}</DialogDescription>
                  </DialogHeader>
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={
                      isSent
                        ? "hidden"
                        : "w-full p-2 border border-[#2f4489] rounded-md"
                    }
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <button
                        className="px-4 py-2 rounded-md border"
                        onClick={() => {
                          // Cleanup
                          setIsDialogOpen(false);
                          setIsSent(false);
                          setEmail("");
                          setDialogTitle("Restablecer contraseña");
                          setDialogContent(
                            "Ingresa tu correo electrónico para recibir un enlace de restablecimiento de contraseña."
                          );
                        }}
                      >
                        {isSent ? "Cerrar" : "Cancelar"}
                      </button>
                    </DialogClose>
                    <button
                      className={`bg-[#2f4489] text-white px-4 py-2 rounded-md ${
                        isSent ? "hidden" : ""
                      }`}
                      onClick={handleForgotPassword}
                      disabled={isSending || !email}
                    >
                      {isSending ? "Enviando..." : "Enviar"}
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
