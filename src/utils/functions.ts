import { useMediaQuery } from "@mui/material";

export const useRenderMobileOrDesktop = () => {
  const isWindowPhone = useMediaQuery(`(max-width:950px)`);

  return { isWindowPhone, loading: false };
};

export const isCuiValid = (cui: string) => {
  if (!cui) {
    return false;
  }

  const cuiRegExp = /^[0-9]{4}\s?[0-9]{5}\s?[0-9]{4}$/;

  if (!cuiRegExp.test(cui)) {
    return false;
  }

  const cuiWithoutSpaces = cui.replace(/\s/, "");
  const depto = parseInt(cuiWithoutSpaces.substring(9, 11), 10);
  const muni = parseInt(cuiWithoutSpaces.substring(11, 13));
  const numero = cuiWithoutSpaces.substring(0, 8);
  const verificador = parseInt(cuiWithoutSpaces.substring(8, 9));

  const munisPorDepto = [
    /* 01 - Guatemala tiene:      */ 17 /* municipios. */,
    /* 02 - El Progreso tiene:    */ 8 /* municipios. */,
    /* 03 - Sacatepéquez tiene:   */ 16 /* municipios. */,
    /* 04 - Chimaltenango tiene:  */ 16 /* municipios. */,
    /* 05 - Escuintla tiene:      */ 13 /* municipios. */,
    /* 06 - Santa Rosa tiene:     */ 14 /* municipios. */,
    /* 07 - Sololá tiene:         */ 19 /* municipios. */,
    /* 08 - Totonicapán tiene:    */ 8 /* municipios. */,
    /* 09 - Quetzaltenango tiene: */ 24 /* municipios. */,
    /* 10 - Suchitepéquez tiene:  */ 21 /* municipios. */,
    /* 11 - Retalhuleu tiene:     */ 9 /* municipios. */,
    /* 12 - San Marcos tiene:     */ 30 /* municipios. */,
    /* 13 - Huehuetenango tiene:  */ 32 /* municipios. */,
    /* 14 - Quiché tiene:         */ 21 /* municipios. */,
    /* 15 - Baja Verapaz tiene:   */ 8 /* municipios. */,
    /* 16 - Alta Verapaz tiene:   */ 17 /* municipios. */,
    /* 17 - Petén tiene:          */ 14 /* municipios. */,
    /* 18 - Izabal tiene:         */ 5 /* municipios. */,
    /* 19 - Zacapa tiene:         */ 11 /* municipios. */,
    /* 20 - Chiquimula tiene:     */ 11 /* municipios. */,
    /* 21 - Jalapa tiene:         */ 7 /* municipios. */,
    /* 22 - Jutiapa tiene:        */ 17 /* municipios. */,
  ];

  if (depto === 0 || muni === 0) {
    return false;
  }

  if (depto > munisPorDepto.length) {
    return false;
  }

  if (muni > munisPorDepto[depto - 1]) {
    return false;
  }

  // Se verifica el correlativo con base
  // en el algoritmo del complemento 11.
  let total = 0;

  for (let i = 0; i < numero.length; i++) {
    total += parseInt(numero[i]) * (i + 2);
  }

  const modulo = total % 11;

  return modulo === verificador;
};
