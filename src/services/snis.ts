const ENV = import.meta.env.VITE_ENV;
const API_BASE_URL =
  ENV === "DEV"
    ? "https://mamtest.mides.gob.gt/api"
    : ENV === "LOCAL"
    ? "http://localhost:5000"
    : "https://manoamano.mides.gob.gt/api";
const API_KEY = import.meta.env.VITE_API_KEY;

export interface UserBasic {
  cui: string;
  nombre_completo: string;
  sexo: number;
}

export interface UserFull extends UserBasic {
  id_nucleo?: number;
  id_ocupacion?: number;
  id_parentesco?: number;
  id_escolaridad?: number;
  id_pueblo?: number;
  id_comunidad_linguistica?: number;
  trabaja?: boolean;
  telefono?: string;
  direccion?: string;
  fecha_nacimiento?: string;
  id_municipio_nacimiento?: number;
  id_departamento_nacimiento?: number;
  id_municipio_residencia?: number;
  id_departamento_residencia?: number;
  id_lugar_poblado_residencia?: number;
  orden_cedula?: string;
  registro_cedula?: string;
  libro_partida?: string;
  folio_partida?: string;
  numero_partida?: string;
  discapacidad?: string | null;
  fecha_defuncion?: string | null;
  id_idioma?: number;
  año_nacimiento?: number;
  checksum?: string;
}

export async function getUserFull(cui: string): Promise<UserFull> {
  const response = await fetch(`${API_BASE_URL}/snis/user/full/${cui}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user full data");
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || "Failed to fetch user full data");
  }

  return result.data;
}

export async function getUserBasic(cui: string): Promise<UserBasic> {
  const response = await fetch(`${API_BASE_URL}/snis/user/basic/${cui}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user basic data");
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || "Failed to fetch user basic data");
  }

  return result.data;
}
