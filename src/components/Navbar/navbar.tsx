// Navbar.tsx
import "./navbar.css"; // Import the CSS file for styling
import { useNavigate } from "react-router-dom";
import LogoGobierno from "@/assets/navbar/logo_gob.png";
import LogoManoAMano from "@/assets/navbar/logo_mano_a_mano_2.png";
import { useRenderMobileOrDesktop } from "@/utils/functions";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { DEVELOP_BOX_COLOR } from "@/utils/constants";
import { useState } from "react";
import React from "react";
import { CrossCircledIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";

interface NavbarProps {
  activeSection: string;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const navigate = useNavigate();
  const { isWindowPhone } = useRenderMobileOrDesktop();

  const [openDrawer, setOpenDrawer] = useState(false);
  const scrollToSection = (sectionId: string) => {
    // First check if we're already on the home page
    if (window.location.pathname === "/") {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: "smooth" });
    } else {
      // If not on home page, navigate first then scroll
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };
  const scrollToSectionNoticias = (sectionId: string) => {
    navigate(`/noticias?section=${sectionId}`);
  };
  const menuOptions = [
    {
      label: "MANO A MANO",
      actionType: "navigate",
      actionValue: "/",
      subOptions: [
        {
          label: "Dimensiones de trabajo",
          actionType: "scroll",
          actionValue: "dimensiones",
        },
        {
          label: "Mano a Mano",
          actionType: "scroll",
          actionValue: "manoamano",
        },
        {
          label: "Territorios de trabajo",
          actionType: "scroll",
          actionValue: "lugares",
        },
        {
          label: "Registro Social de Hogares",
          actionType: "scroll",
          actionValue: "registro",
        },
      ],
    },
    {
      label: "NOTICIAS",
      actionType: "navigate",
      actionValue: "/noticias",
      subOptions: [
        {
          label: "Noticias",
          actionType: "scrollNoticias",
          actionValue: "Noticias",
        },
        {
          label: "Historias de Vida",
          actionType: "scrollNoticias",
          actionValue: "Historias_de_vida",
        },
        {
          label: "Comunicados de prensa",
          actionType: "scrollNoticias",
          actionValue: "Comunicados_de_prensa",
        },
        {
          label: "Boletines mensuales",
          actionType: "scrollNoticias",
          disabled: true,
          actionValue: "Boletines_mensuales",
        },
      ],
    },
    { label: "INFORMACIÓN PÚBLICA", disabled: true },
    { label: "DATOS ABIERTOS", disabled: false },
  ];
  const handleAction = (actionType: string, actionValue: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    const actions: Record<string, Function> = {
      navigate: () => navigate(actionValue),
      scroll: () => scrollToSection(actionValue),
      scrollNoticias: () => scrollToSectionNoticias(actionValue),
    };
    actions[actionType]?.();
  };
  return !isWindowPhone ? (
    <div className="navbar-wrapper">
      {" "}
      {/* New wrapper */}
      <nav className="navbar">
        <div className="navbar-left cursor-pointer">
          <a
            href="https://guatemala.gob.gt/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={LogoGobierno}
              alt="Left Logo"
              className="navbar-logo-left"
            />
          </a>
        </div>
        <div className="navbar-center">
          <ul className="navbar-menu button-container">
            <li className="dropdown">
              <a
                href="#manamano"
                className={activeSection === "home" ? "active" : ""}
                onClick={() => navigate("/")}
              >
                MANO A MANO
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a onClick={() => scrollToSection("dimensiones")}>
                    Dimensiones de trabajo
                  </a>
                </li>
                <li>
                  <a onClick={() => scrollToSection("manoamano")}>
                    Mano a Mano
                  </a>
                </li>
                <li>
                  <a onClick={() => scrollToSection("lugares")}>
                    Territorios de trabajo
                  </a>
                </li>
                <li>
                  <a onClick={() => scrollToSection("registro")}>
                    Registro Social de Hogares
                  </a>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a
                href="#noticias"
                className={activeSection === "noticias" ? "active" : ""}
                onClick={() => navigate("/noticias")}
              >
                NOTICIAS
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a onClick={() => scrollToSectionNoticias("Noticias")}>
                    Noticias
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => scrollToSectionNoticias("Historias_de_vida")}
                  >
                    Historias de Vida
                  </a>
                </li>
                <li>
                  <a
                    onClick={() =>
                      scrollToSectionNoticias("Comunicados_de_prensa")
                    }
                  >
                    Comunicados de prensa
                  </a>
                </li>
                <li>
                  <a
                    onClick={() =>
                      scrollToSectionNoticias("Boletines_mensuales")
                    }
                  >
                    Boletines mensuales
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#informacion" className="disabled" aria-disabled>
                INFORMACIÓN PÚBLICA
              </a>
            </li>
            <li>
              <a
                href="#datosabiertos"
                className={`${
                  activeSection === "datosabiertos" ? "active" : ""
                }`}
                onClick={() => navigate("/datos-abiertos")}
              >
                DATOS ABIERTOS
              </a>
            </li>
            <li>
              <a
                href="#iniciarsesion"
                className={activeSection === "login" ? "active" : ""}
                onClick={() => navigate("/login")}
              >
                INICIAR SESIÓN
              </a>
            </li>
          </ul>
        </div>
        <div className="navbar-right">
          <img
            src={LogoManoAMano}
            alt="Right Logo"
            className="navbar-logo-right"
          />
        </div>
      </nav>
    </div>
  ) : (
    <div className="navbar-wrapper">
      <nav className="navbar justify-between p-2">
        <div className="navbar-left ">
          <a className="pr-2 items-center pl-4">
            <HamburgerMenuIcon
              className="text-white w-8 h-8 "
              onClick={() => {
                setOpenDrawer(true);
              }}
            ></HamburgerMenuIcon>
          </a>
        </div>
        <div className=" pl-4">
          <a>
            <img
              src={LogoManoAMano}
              alt="Right Logo"
              className="navbar-logo-right pr-4"
            />
          </a>
        </div>
        <div className="navbar-right cursor-pointer">
          <a
            href="https://guatemala.gob.gt/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={LogoGobierno}
              alt="Left Logo"
              className="navbar-logo-left pr-2 w-32"
            />
          </a>
        </div>
      </nav>
      <Drawer
        anchor={"left"}
        open={openDrawer}
        onClose={() => {
          setOpenDrawer(false);
        }}
        PaperProps={{
          sx: {
            width: "100%",
            p: "16px",
            zIndex: 2000,
            background: DEVELOP_BOX_COLOR.light.light4,
          },
        }}
      >
        <div className="w-full">
          <div className="w-full ml-auto justify-end flex">
            <IconButton
              onClick={() => {
                setOpenDrawer(false);
              }}
            >
              <CrossCircledIcon className="text-blue-800 w-6 h-6" />
            </IconButton>
          </div>
          <List className="w-full ">
            {menuOptions.map((option, index) => (
              <React.Fragment key={index}>
                <ListItem disablePadding className="text-blue-950 ">
                  <ListItemButton
                    sx={{
                      "& .MuiTypography-root": {
                        color: option.disabled ? "#a3a4a5" : "#0338a4",
                        fontFamily: "Fira Sans",
                        fontSize: "16px",
                      },
                    }}
                    onClick={() => {
                      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                      option.actionType &&
                        handleAction(option.actionType, option.actionValue!);
                      setOpenDrawer(false);
                    }}
                  >
                    <ListItemText primary={option.label} />
                  </ListItemButton>
                </ListItem>

                {option.subOptions && (
                  <List component="div">
                    {option.subOptions.map((subOption, subIndex) => (
                      <ListItem key={`${index}-${subIndex}`} disablePadding>
                        <ListItemButton
                          sx={{
                            "& .MuiTypography-root": {
                              color: "#40454f",
                              fontFamily: "Fira Sans",
                              fontSize: "14px",
                            },
                          }}
                          disabled={subOption.disabled}
                          onClick={() => {
                            setOpenDrawer(false);

                            handleAction(
                              subOption.actionType,
                              subOption.actionValue
                            );
                          }}
                        >
                          <ListItemText primary={subOption.label} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                )}
              </React.Fragment>
            ))}
          </List>
        </div>
      </Drawer>
    </div>
  );
};

export default Navbar;
