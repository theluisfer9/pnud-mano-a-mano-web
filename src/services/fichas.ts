import axios from "axios";

// Configure environment variables
const ENV = import.meta.env.VITE_ENV;
const API_BASE_URL =
  ENV === "DEV"
    ? "http://64.23.148.189:5000"
    : ENV === "LOCAL"
    ? "http://localhost:5000"
    : "https://manoamano.mides.gob.gt/api";
const API_KEY = import.meta.env.VITE_API_KEY;

// Create axios instance with auth token handling
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${API_KEY}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Types matching the backend data models
export interface Ficha {
  id: number;
  nombre: string;
  ano: string;
  estado: string;
  cabecera: FichaCabecera;
  programas: Programa[];
}

export interface FichaCabecera {
  id: number;
  institucion: string;
  siglas: string;
  nombreCorto: string;
  delegados: Delegado[];
  autoridad: Autoridad;
}

export interface Delegado {
  id: number;
  nombre: string;
  telefono: string;
  rol: string;
  correo: string;
}

export interface Autoridad {
  nombre: string;
  cargo: string;
}

export interface Programa {
  id: number;
  codigo: string;
  codigoSicoin: string;
  tipo: "programa" | "intervencion";
  nombreSicoin: string;
  nombreComun: string;
  descripcion: string;
  objetivo: string;
  marcoLegal: string;
  autoridad: Autoridad;
  funcionario: Funcionario;
  beneficios?: New_Beneficio[];
}

export interface Funcionario {
  nombre: string;
  cargo: string;
}

export interface Beneficio {
  id: string;
  codigoPrograma: string;
  nombrePrograma: string;
  codigo: string;
  codigoSicoin: string;
  nombreSubproducto: string;
  nombreCorto: string;
  nombre: string;
  descripcion: string;
  objetivo: string;
  tipo: string;
  criteriosInclusion: string;
  atencionSocial: string;
  rangoEdad: string;
  poblacionObjetivo: PoblacionObjetivo;
  finalidad: Finalidad;
  clasificadorTematico: ClasificadorTematico;
  objeto: Objeto;
  forma: Forma;
  focalizacion: Focalizacion;
  funcionarioFocal: Funcionario;
}

// Additional interfaces for Beneficio
export interface PoblacionObjetivo {
  porCondicionSocioeconomica: {
    personasEnPobrezaExtrema: boolean;
    hogaresConIngresos: boolean;
    nivelDeSalarioMinimo: boolean;
  };
  porCondicionDeVulnerabilidad: {
    personasConDiscapacidad: boolean;
    mujeresEnViolenciaDeGenero: boolean;
    poblacionGuatemalteca: boolean;
    personasIndocumentadas: boolean;
    migrantes: boolean;
  };
  porPertenenciaEtnicaOCultural: {
    comunidadesIndigenas: boolean;
    pueblosAfrodescendientes: boolean;
    gruposEtnicos: boolean;
    idiomas: boolean;
    sentidos: boolean;
  };
  porSituacionLaboral: {
    desempleados: boolean;
    personasEnSubempleo: boolean;
    jovenesEnExperienciaLaboral: boolean;
  };
  porGeneroYDomicilio: {
    personasJefasDeHogar: boolean;
    personasLGBTIQEnSituacionDeRiesgo: boolean;
  };
  porCondicionDeSalud: {
    personasConEnfermedadesCronicas: boolean;
    mujeresEmbarazadasEnRiesgo: boolean;
    ninosConDesnutricion: boolean;
  };
}

export interface Finalidad {
  reduccionPobreza: boolean;
  mejoraAccesoEducacion: boolean;
  fortalecimientoSeguridadAlimentaria: boolean;
  promocionSaludBienestar: boolean;
  prevencionAtencionViolencia: boolean;
}

export interface ClasificadorTematico {
  ninez: boolean;
  adolescentesYJovenes: boolean;
  mujeres: boolean;
  adultos: boolean;
  adultosMayores: boolean;
  poblacionIndigena: boolean;
  personasConDiscapacidad: boolean;
  poblacionMigrante: boolean;
  areasPrecarizadas: boolean;
}

export interface Objeto {
  ingresosFamiliares: boolean;
  condicionesDeVivienda: boolean;
  accesoAServiciosBasicos: boolean;
  nutricionYSalud: boolean;
  educacionYHabilidadesLaborales: boolean;
}

export interface Forma {
  censoORegistrosOficiales: boolean;
  autoseleccion: boolean;
  seleccionPorIntermediacion: boolean;
  identificacionPorDemandaEspontanea: boolean;
}

export interface Focalizacion {
  geografica: {
    municipiosConMayoresNivelesDePobreza: boolean;
    comunidadesRuralesDeOfidicilAcceso: boolean;
    zonasUrbanoMarginales: boolean;
  };
  demografica: {
    segunGrupoEtarioGeneroYEtnia: boolean;
  };
  socioeconomica: {
    basadoEnIngresosPerCapita: boolean;
    basadoEnAccesoAServiciosBasicos: boolean;
  };
  porVulnerabilidad: {
    personasConNecesidadesUrgentes: boolean;
    desplazadosVictimasDeViolencia: boolean;
  };
  multidimensional: {
    combinacionDeCriterios: boolean;
  };
}

// Error handling helper
const handleApiError = (error: any) => {
  if (error.response) {
    // The request was made and the server responded with an error status
    console.error("API Error Response:", error.response.data);
    return {
      error: error.response.data.error || "Error en la solicitud",
      status: error.response.status,
    };
  } else if (error.request) {
    // The request was made but no response was received
    console.error("API No Response:", error.request);
    return { error: "No se recibió respuesta del servidor", status: 0 };
  } else {
    // Something happened in setting up the request that triggered an error
    console.error("API Request Error:", error.message);
    return { error: "Error al realizar la solicitud", status: 0 };
  }
};

// ===== FICHAS API CALLS =====

/**
 * Get all fichas
 */
export const getAllFichas = async (): Promise<
  Ficha[] | { error: string; status: number }
> => {
  try {
    const response = await api.get("/fichas");
    return response.data.fichas;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get a ficha by ID
 * @param fichaId ID of the ficha
 * @param detailed Whether to include detailed information
 */
export const getFichaById = async (
  fichaId: number,
  detailed: boolean = false
): Promise<Ficha | { error: string; status: number }> => {
  try {
    const response = await api.get(`/fichas/${fichaId}`, {
      params: { detailed: detailed },
    });
    return response.data.ficha;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getFichasWithDetails = async (): Promise<
  Ficha[] | { error: string; status: number }
> => {
  try {
    const response = await api.get("/fichas/details");
    return response.data.fichas;
  } catch (error) {
    return handleApiError(error);
  }
};
/**
 * Create a new ficha
 * @param fichaData Data for the new ficha
 */
export const createFicha = async (
  fichaData: Partial<Ficha>
): Promise<{ fichaId: number } | { error: string; status: number }> => {
  try {
    const response = await api.post("/fichas", camelCaseToSnakeCase(fichaData));
    return { fichaId: response.data.fichaId };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update an existing ficha
 * @param fichaId ID of the ficha to update
 * @param updateData Updated ficha data
 */
export const updateFicha = async (
  fichaId: number,
  updateData: Partial<Ficha>
): Promise<{ fichaId: number } | { error: string; status: number }> => {
  try {
    const response = await api.put(
      `/fichas/${fichaId}`,
      camelCaseToSnakeCase(updateData)
    );
    return { fichaId: response.data.fichaId };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Delete a ficha
 * @param fichaId ID of the ficha to delete
 */
export const deleteFicha = async (
  fichaId: number
): Promise<boolean | { error: string; status: number }> => {
  try {
    await api.delete(`/fichas/${fichaId}`);
    return true;
  } catch (error) {
    return handleApiError(error);
  }
};

// ===== FICHA CABECERA API CALLS =====

/**
 * Get the cabecera for a ficha
 * @param fichaId ID of the ficha
 */
export const getFichaCabecera = async (
  fichaId: number
): Promise<FichaCabecera | { error: string; status: number }> => {
  try {
    const response = await api.get(`/fichas/${fichaId}/cabecera`);
    return response.data.cabecera;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Create cabecera for a ficha
 * @param fichaId ID of the ficha
 * @param cabeceraData Cabecera data
 */
export const createFichaCabecera = async (
  fichaId: number,
  cabeceraData: Partial<FichaCabecera>
): Promise<boolean | { error: string; status: number }> => {
  try {
    await api.post(
      `/fichas/${fichaId}/cabecera`,
      camelCaseToSnakeCase(cabeceraData)
    );
    return true;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update cabecera for a ficha
 * @param fichaId ID of the ficha
 * @param updateData Updated cabecera data
 */
export const updateFichaCabecera = async (
  fichaId: number,
  updateData: Partial<FichaCabecera>
): Promise<boolean | { error: string; status: number }> => {
  try {
    await api.put(
      `/fichas/${fichaId}/cabecera`,
      camelCaseToSnakeCase(updateData)
    );
    return true;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Delete cabecera for a ficha
 * @param fichaId ID of the ficha
 */
export const deleteFichaCabecera = async (
  fichaId: number
): Promise<boolean | { error: string; status: number }> => {
  try {
    await api.delete(`/fichas/${fichaId}/cabecera`);
    return true;
  } catch (error) {
    return handleApiError(error);
  }
};

// ===== DELEGADOS API CALLS =====

/**
 * Get all delegados for a ficha
 * @param fichaId ID of the ficha
 */
export const getDelegadosByFichaId = async (
  fichaId: number
): Promise<Delegado[] | { error: string; status: number }> => {
  try {
    const response = await api.get(`/fichas/${fichaId}/delegados`);
    return response.data.delegados;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Create a delegado for a ficha
 * @param fichaId ID of the ficha
 * @param delegadoData Delegado data
 */
export const createDelegado = async (
  fichaId: number,
  delegadoData: Partial<Delegado>
): Promise<{ delegadoId: number } | { error: string; status: number }> => {
  try {
    const response = await api.post(
      `/fichas/${fichaId}/delegados`,
      camelCaseToSnakeCase(delegadoData)
    );
    return { delegadoId: response.data.delegadoId };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get a delegado by ID
 * @param delegadoId ID of the delegado
 */
export const getDelegadoById = async (
  delegadoId: number
): Promise<Delegado | { error: string; status: number }> => {
  try {
    const response = await api.get(`/fichas/delegados/${delegadoId}`);
    return response.data.delegado;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update a delegado
 * @param delegadoId ID of the delegado
 * @param updateData Updated delegado data
 */
export const updateDelegado = async (
  delegadoId: number,
  updateData: Partial<Delegado>
): Promise<{ delegadoId: number } | { error: string; status: number }> => {
  try {
    const response = await api.put(
      `/fichas/delegados/${delegadoId}`,
      camelCaseToSnakeCase(updateData)
    );
    return { delegadoId: response.data.delegadoId };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Delete a delegado
 * @param delegadoId ID of the delegado
 */
export const deleteDelegado = async (
  delegadoId: number
): Promise<boolean | { error: string; status: number }> => {
  try {
    await api.delete(`/fichas/delegados/${delegadoId}`);
    return true;
  } catch (error) {
    return handleApiError(error);
  }
};

// ===== AUTORIDADES API CALLS =====

/**
 * Get the autoridad for a ficha
 * @param fichaId ID of the ficha
 */
export const getFichaAutoridad = async (
  fichaId: number
): Promise<Autoridad | { error: string; status: number }> => {
  try {
    const response = await api.get(`/fichas/${fichaId}/autoridad`);
    return response.data.autoridad;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Create autoridad for a ficha
 * @param fichaId ID of the ficha
 * @param autoridadData Autoridad data
 */
export const createFichaAutoridad = async (
  fichaId: number,
  autoridadData: Partial<Autoridad>
): Promise<{ message: string } | { error: string; status: number }> => {
  try {
    const response = await api.post(
      `/fichas/${fichaId}/autoridad`,
      camelCaseToSnakeCase(autoridadData)
    );
    return { message: response.data.message };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update autoridad for a ficha
 * @param fichaId ID of the ficha
 * @param updateData Updated autoridad data
 */
export const updateFichaAutoridad = async (
  fichaId: number,
  updateData: Partial<Autoridad>
): Promise<{ message: string } | { error: string; status: number }> => {
  try {
    const response = await api.put(
      `/fichas/${fichaId}/autoridad`,
      camelCaseToSnakeCase(updateData)
    );
    return { message: response.data.message };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Delete autoridad for a ficha
 * @param fichaId ID of the ficha
 */
export const deleteFichaAutoridad = async (
  fichaId: number
): Promise<boolean | { error: string; status: number }> => {
  try {
    await api.delete(`/fichas/${fichaId}/autoridad`);
    return true;
  } catch (error) {
    return handleApiError(error);
  }
};

// ===== PROGRAMAS API CALLS =====

/**
 * Get all programas for a ficha
 * @param fichaId ID of the ficha
 */
export const getProgramasByFichaId = async (
  fichaId: number
): Promise<Programa[] | { error: string; status: number }> => {
  try {
    const response = await api.get(`/fichas/${fichaId}/programas`);
    return response.data.programas;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get a programa by ID
 * @param programaId ID of the programa
 * @param detailed Whether to include detailed information
 */
export const getProgramaById = async (
  programaId: number,
  detailed: boolean = false
): Promise<Programa | { error: string; status: number }> => {
  try {
    const response = await api.get(`/programas/${programaId}`, {
      params: { detailed: detailed },
    });
    return response.data.programa;
  } catch (error) {
    return handleApiError(error);
  }
};
/**
 * Get all programas with beneficios
 * @returns List of programas with their beneficios
 */
export const getAllProgramasWithBeneficios = async (): Promise<
  Programa[] | { error: string; status: number }
> => {
  try {
    const response = await api.get("/programas");
    return response.data.programas;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Create a programa for a ficha
 * @param fichaId ID of the ficha
 * @param programaData Programa data
 */
export const createPrograma = async (
  fichaId: number,
  programaData: Partial<Programa>
): Promise<{ programaId: number } | { error: string; status: number }> => {
  try {
    const { autoridad, funcionario, beneficios, ...rest } = programaData;
    const response = await api.post(
      `/fichas/${fichaId}/programas`,
      camelCaseToSnakeCase(rest)
    );
    return { programaId: response.data.programaId };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update a programa
 * @param programaId ID of the programa
 * @param updateData Updated programa data
 */
export const updatePrograma = async (
  programaId: number,
  updateData: Partial<Programa>
): Promise<{ programaId: number } | { error: string; status: number }> => {
  try {
    const response = await api.put(
      `/programas/${programaId}`,
      camelCaseToSnakeCase(updateData)
    );
    return { programaId: response.data.programaId };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Delete a programa
 * @param programaId ID of the programa
 */
export const deletePrograma = async (
  programaId: number
): Promise<boolean | { error: string; status: number }> => {
  try {
    await api.delete(`/programas/${programaId}`);
    return true;
  } catch (error) {
    return handleApiError(error);
  }
};

// ===== BENEFICIOS API CALLS =====

/**
 * Get all beneficios for a programa
 * @param programaId ID of the programa
 */
export const getBeneficiosByProgramaId = async (
  programaId: number
): Promise<Beneficio[] | { error: string; status: number }> => {
  try {
    const response = await api.get(`/programas/${programaId}/beneficios`);
    return response.data.beneficios;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get a beneficio by ID
 * @param beneficioId ID of the beneficio
 * @param detailed Whether to include detailed information
 */
export const getBeneficioById = async (
  beneficioId: number,
  detailed: boolean = false
): Promise<Beneficio | { error: string; status: number }> => {
  try {
    const response = await api.get(`/beneficios/${beneficioId}`, {
      params: { detailed: detailed },
    });
    return response.data.beneficio;
  } catch (error) {
    return handleApiError(error);
  }
};
export interface New_ElementoSimple {
  id: number;
  criterio: string;
}

export interface New_ElementoFocalizacion extends New_ElementoSimple {
  subcategoria: string;
}

export interface New_Elemento {
  id: number;
  categoria: string;
  criterio: string;
}

export interface New_RelacionConElemento {
  id: number;
  beneficioId: number;
  elementoId: number;
  elemento: New_Elemento;
}

export interface New_RelacionConElementoSimple {
  id: number;
  beneficioId: number;
  elementoId: number;
  elemento: New_ElementoSimple;
}

export interface New_FuncionarioFocal {
  beneficioId: number;
  nombre: string;
  cargo: string;
}

export interface New_Beneficio {
  id: number;
  programaId: number;
  codigoPrograma: string;
  nombrePrograma: string;
  codigo: string;
  codigoSicoin: string;
  nombreSubproducto: string;
  nombreCorto: string;
  nombre: string;
  descripcion: string;
  objetivo: string;
  tipo: string;
  criteriosInclusion: string;
  atencionSocial: string;
  rangoEdad: string;
  poblacionObjetivo: New_RelacionConElemento[];
  finalidad: New_RelacionConElementoSimple[];
  clasificadorTematico: New_RelacionConElementoSimple[];
  objeto: New_RelacionConElementoSimple[];
  forma: New_RelacionConElementoSimple[];
  focalizacion: New_RelacionConElemento[];
  funcionarioFocal: New_FuncionarioFocal;
}

/**
 * Get all beneficios with details for a programa
 * @param programaId ID of the programa
 */
export const getBeneficiosWithDetailsByProgramaId = async (
  programaId: number
): Promise<New_Beneficio[] | { error: string; status: number }> => {
  try {
    const response = await api.get(
      `/programas/${programaId}/beneficios_details`,
      {
        params: { detailed: true },
      }
    );
    console.log("response", response.data.beneficios[0]);
    return response.data.beneficios;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Create a beneficio for a programa
 * @param programaId ID of the programa
 * @param beneficioData Beneficio data
 */
export const createBeneficio = async (
  programaId: number,
  beneficioData: Partial<New_Beneficio>
): Promise<{ beneficioId: number } | { error: string; status: number }> => {
  try {
    const {
      funcionarioFocal,
      poblacionObjetivo,
      finalidad,
      clasificadorTematico,
      objeto,
      forma,
      focalizacion,
      ...rest
    } = beneficioData;
    const response = await api.post(
      `/programas/${programaId}/beneficios`,
      camelCaseToSnakeCase(rest)
    );
    return { beneficioId: response.data.beneficioId };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update a beneficio
 * @param beneficioId ID of the beneficio
 * @param updateData Updated beneficio data
 */
export const updateBeneficio = async (
  beneficioId: number,
  updateData: Partial<Beneficio>
): Promise<{ beneficioId: number } | { error: string; status: number }> => {
  try {
    const response = await api.put(
      `/beneficios/${beneficioId}`,
      camelCaseToSnakeCase(updateData)
    );
    return { beneficioId: response.data.beneficioId };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Delete a beneficio
 * @param beneficioId ID of the beneficio
 */
export const deleteBeneficio = async (
  beneficioId: number
): Promise<boolean | { error: string; status: number }> => {
  try {
    await api.delete(`/beneficios/${beneficioId}`);
    return true;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Create a funcionario focal for a beneficio
 * @param beneficioId ID of the beneficio
 * @param funcionarioData Funcionario focal data
 */
export const createBeneficioFuncionarioFocal = async (
  beneficioId: number,
  funcionarioData: Funcionario
): Promise<boolean | { error: string; status: number }> => {
  try {
    const response = await api.post(
      `/beneficios/${beneficioId}/funcionario-focal`,
      camelCaseToSnakeCase(funcionarioData)
    );
    if (response.status === 201) {
      return true;
    } else {
      return { error: response.data.error, status: response.status };
    }
  } catch (error) {
    return handleApiError(error);
  }
};
/**
 * Update a funcionario focal for a beneficio
 * @param beneficioId ID of the beneficio
 * @param funcionarioData Funcionario focal data
 */
export const updateBeneficioFuncionarioFocal = async (
  beneficioId: number,
  funcionarioData: Funcionario
): Promise<boolean | { error: string; status: number }> => {
  try {
    const response = await api.put(
      `/beneficios/${beneficioId}/funcionario-focal`,
      camelCaseToSnakeCase(funcionarioData)
    );
    if (response.status === 200) {
      return true;
    } else {
      return { error: response.data.error, status: response.status };
    }
  } catch (error) {
    return handleApiError(error);
  }
};
/**
 * Create a forma for a beneficio
 * @param beneficioId ID of the beneficio
 * @param formaData Forma data
 */
export const createBeneficioForma = async (
  beneficioId: number,
  formaData: Forma,
  formaElementos: FormaElemento[]
): Promise<boolean | { error: string; status: number }> => {
  try {
    // Extract all true criteria from forma
    const criterios: string[] = [];

    // Helper function to convert camelCase to spaced words
    const camelToSpaced = (str: string) => {
      return (
        str
          // insert a space before all caps
          .replace(/([A-Z])/g, " $1")
          // uppercase the first character
          .replace(/^./, (str) => str.toUpperCase())
          .trim()
      );
    };

    // Process forma object to get true values
    Object.entries(formaData).forEach(([key, value]) => {
      if (value === true) {
        // Convert camelCase key to spaced words
        const spacedKey = camelToSpaced(key);
        criterios.push(spacedKey);
      }
    });

    // Match criterios with formaElementos to get element IDs
    const elementoIds = formaElementos
      .filter((elemento) => {
        // Define a stricter normalization for matching that REMOVES spaces
        const normalizeForLooseMatch = (str: string) => {
          return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Remove accents
            .replace(/[^\w]/g, "") // Remove non-word characters INCLUDING spaces
            .trim();
        };

        const match = criterios.some((criterio) => {
          // Normalize both strings using the space-removing function for comparison
          const looseNormalizedCriterio = normalizeForLooseMatch(criterio);
          const looseNormalizedElementoCriterio = normalizeForLooseMatch(
            elemento.criterio
          );
          return looseNormalizedCriterio === looseNormalizedElementoCriterio;
        });
        return match;
      })
      .map((elemento) => elemento.id);

    // Create and execute promises in parallel
    const promises = elementoIds.map((elementoId) =>
      api.post(`/beneficios/${beneficioId}/forma/${elementoId}`)
    );

    const results = await Promise.all(promises);

    // Check if all requests were successful
    const allSuccessful = results.every((response) => response.status === 201);

    if (allSuccessful) {
      return true;
    } else {
      // Find the first error response
      const errorResponse = results.find((response) => response.status !== 201);
      return {
        error: errorResponse?.data?.error || "Some associations failed",
        status: errorResponse?.status || 500,
      };
    }
  } catch (error) {
    return handleApiError(error);
  }
};
/**
 * Add associations between a beneficio and focalización elements
 * @param beneficioId ID of the beneficio
 * @param focalizacion Focalización data with boolean flags
 * @param focalizacionElementos Available focalización elements data
 */
export const addBeneficioFocalizacionAssociation = async (
  beneficioId: number,
  focalizacion: New_RelacionConElemento[]
): Promise<boolean | { error: string; status: number }> => {
  try {
    const promises = focalizacion.map((relacion) =>
      api.post(`/beneficios/${beneficioId}/focalizacion/${relacion.elementoId}`)
    );
    const results = await Promise.all(promises);
    return results.every((response) => response.status === 201);
  } catch (error) {
    return handleApiError(error);
  }
};
/**
 * Delete an association between a beneficio and a focalización element
 * @param beneficioId ID of the beneficio
 * @param elementoId ID of the focalización element
 */
export const deleteBeneficioFocalizacionAssociation = async (
  beneficioId: number,
  elementoId: number
): Promise<boolean | { error: string; status: number }> => {
  try {
    const response = await api.delete(
      `/beneficios/${beneficioId}/focalizaciones/${elementoId}`
    );
    return response.status === 200;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Add associations between a beneficio and población objetivo elements
 * @param beneficioId ID of the beneficio
 * @param poblacionObjetivo Population objetivo data with boolean flags
 */
export const addBeneficioPoblacionObjetivoAssociation = async (
  beneficioId: number,
  poblacionObjetivo: New_RelacionConElemento[]
): Promise<boolean | { error: string; status: number }> => {
  try {
    const promises = poblacionObjetivo.map((relacion) =>
      api.post(
        `/beneficios/${beneficioId}/poblacion_objetivo/${relacion.elementoId}`
      )
    );
    const results = await Promise.all(promises);
    return results.every((response) => response.status === 201);
  } catch (error) {
    return handleApiError(error);
  }
};
/**
 * Delete an association between a beneficio and a población objetivo element
 * @param beneficioId ID of the beneficio
 * @param elementoId ID of the población objetivo element
 */
export const deleteBeneficioPoblacionObjetivoAssociation = async (
  beneficioId: number,
  elementoId: number
): Promise<boolean | { error: string; status: number }> => {
  try {
    const response = await api.delete(
      `/beneficios/${beneficioId}/poblacion-objetivo/${elementoId}`
    );
    return response.status === 200;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Add associations between a beneficio and finalidad elements
 * @param beneficioId ID of the beneficio
 * @param finalidad Finalidad data with boolean flags
 * @param finalidadElementos Available finalidad elements data
 */
export const addBeneficioFinalidadAssociation = async (
  beneficioId: number,
  finalidad: New_RelacionConElementoSimple[]
): Promise<boolean | { error: string; status: number }> => {
  try {
    const promises = finalidad.map((relacion) =>
      api.post(`/beneficios/${beneficioId}/finalidad/${relacion.elementoId}`)
    );
    const results = await Promise.all(promises);
    return results.every((response) => response.status === 201);
  } catch (error) {
    return handleApiError(error);
  }
};
/**
 * Delete an association between a beneficio and a finalidad element
 * @param beneficioId ID of the beneficio
 * @param elementoId ID of the finalidad element
 */
export const deleteBeneficioFinalidadAssociation = async (
  beneficioId: number,
  elementoId: number
): Promise<boolean | { error: string; status: number }> => {
  try {
    const response = await api.delete(
      `/beneficios/${beneficioId}/finalidades/${elementoId}`
    );
    return response.status === 200;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Add associations between a beneficio and clasificador temático elements
 * @param beneficioId ID of the beneficio
 * @param clasificadorTematico Clasificador temático data with boolean flags
 * @param clasificadorTematicoElementos Available clasificador temático elements data
 */
export const addBeneficioClasificadorTematicoAssociation = async (
  beneficioId: number,
  clasificadorTematico: New_RelacionConElementoSimple[]
): Promise<boolean | { error: string; status: number }> => {
  try {
    const promises = clasificadorTematico.map((relacion) =>
      api.post(
        `/beneficios/${beneficioId}/clasificador_tematico/${relacion.elementoId}`
      )
    );
    const results = await Promise.all(promises);
    return results.every((response) => response.status === 201);
  } catch (error) {
    return handleApiError(error);
  }
};
/**
 * Delete an association between a beneficio and a clasificador temático element
 * @param beneficioId ID of the beneficio
 * @param elementoId ID of the clasificador temático element
 */
export const deleteBeneficioClasificadorTematicoAssociation = async (
  beneficioId: number,
  elementoId: number
): Promise<boolean | { error: string; status: number }> => {
  try {
    const response = await api.delete(
      `/beneficios/${beneficioId}/clasificadores_tematicos/${elementoId}`
    );
    return response.status === 200;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Add an association between a beneficio and an objeto
 * @param beneficioId ID of the beneficio
 * @param objeto Objeto data with boolean flags
 * @param objetoElementos Available objeto elements data
 */
export const addBeneficioObjetoAssociation = async (
  beneficioId: number,
  objeto: New_RelacionConElementoSimple[]
): Promise<boolean | { error: string; status: number }> => {
  try {
    const promises = objeto.map((relacion) =>
      api.post(`/beneficios/${beneficioId}/objeto/${relacion.elementoId}`)
    );
    const results = await Promise.all(promises);
    return results.every((response) => response.status === 201);
  } catch (error) {
    return handleApiError(error);
  }
};
/**
 * Delete an association between a beneficio and an objeto element
 * @param beneficioId ID of the beneficio
 * @param elementoId ID of the objeto element
 */
export const deleteBeneficioObjetoAssociation = async (
  beneficioId: number,
  elementoId: number
): Promise<boolean | { error: string; status: number }> => {
  try {
    const response = await api.delete(
      `/beneficios/${beneficioId}/objetos/${elementoId}`
    );
    return response.status === 200;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Add associations between a beneficio and forma elements
 * @param beneficioId ID of the beneficio
 * @param forma Forma data with boolean flags
 * @param formaElementos Available forma elements data
 */
export const addBeneficioFormaAssociation = async (
  beneficioId: number,
  forma: New_RelacionConElementoSimple[]
): Promise<boolean | { error: string; status: number }> => {
  try {
    const promises = forma.map((relacion) =>
      api.post(`/beneficios/${beneficioId}/forma/${relacion.elementoId}`)
    );
    const results = await Promise.all(promises);
    return results.every((response) => response.status === 201);
  } catch (error) {
    return handleApiError(error);
  }
};
/**
 * Delete an association between a beneficio and a forma element
 * @param beneficioId ID of the beneficio
 * @param elementoId ID of the forma element
 */
export const deleteBeneficioFormaAssociation = async (
  beneficioId: number,
  elementoId: number
): Promise<boolean | { error: string; status: number }> => {
  try {
    const response = await api.delete(
      `/beneficios/${beneficioId}/formas/${elementoId}`
    );
    return response.status === 200;
  } catch (error) {
    return handleApiError(error);
  }
};

// Element type definitions
export interface PoblacionObjetivoElemento {
  id: number;
  categoria: string;
  criterio: string;
}

export interface FinalidadElemento {
  id: number;
  criterio: string;
}

export interface ClasificadorTematicoElemento {
  id: number;
  criterio: string;
}

export interface ObjetoElemento {
  id: number;
  criterio: string;
}

export interface FormaElemento {
  id: number;
  criterio: string;
}

export interface FocalizacionElemento {
  id: number;
  subcategoria: string;
  criterio: string;
}

// Association type definitions
export interface BeneficioPoblacionObjetivo {
  id: number;
  beneficio_id: number;
  elemento_id: number;
}

export interface BeneficioFinalidad {
  id: number;
  beneficio_id: number;
  elemento_id: number;
}

export interface BeneficioClasificadorTematico {
  id: number;
  beneficio_id: number;
  elemento_id: number;
}

export interface BeneficioObjeto {
  id: number;
  beneficio_id: number;
  elemento_id: number;
}

export interface BeneficioForma {
  id: number;
  beneficio_id: number;
  elemento_id: number;
}

export interface BeneficioFocalizacion {
  id: number;
  beneficio_id: number;
  elemento_id: number;
}

/**
 * Get all población objetivo elements
 */
export const getPoblacionObjetivoElementos = async (): Promise<
  PoblacionObjetivoElemento[] | { error: string; status: number }
> => {
  try {
    const response = await api.get("/poblacion_objetivo_elementos");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get all finalidad elements
 */
export const getFinalidadElementos = async (): Promise<
  FinalidadElemento[] | { error: string; status: number }
> => {
  try {
    const response = await api.get("/finalidad_elementos");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get all clasificador temático elements
 */
export const getClasificadorTematicoElementos = async (): Promise<
  ClasificadorTematicoElemento[] | { error: string; status: number }
> => {
  try {
    const response = await api.get("/clasificador_tematico_elementos");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get all objeto elements
 */
export const getObjetoElementos = async (): Promise<
  ObjetoElemento[] | { error: string; status: number }
> => {
  try {
    const response = await api.get("/objeto_elementos");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get all forma elements
 */
export const getFormaElementos = async (): Promise<
  FormaElemento[] | { error: string; status: number }
> => {
  try {
    const response = await api.get("/forma_elementos");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get all focalización elements
 */
export const getFocalizacionElementos = async (): Promise<
  FocalizacionElemento[] | { error: string; status: number }
> => {
  try {
    const response = await api.get("/focalizacion_elementos");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Export a default object with all functions
export default {
  getAllFichas,
  getFichaById,
  createFicha,
  updateFicha,
  deleteFicha,

  getFichaCabecera,
  createFichaCabecera,
  updateFichaCabecera,
  deleteFichaCabecera,

  getDelegadosByFichaId,
  createDelegado,
  getDelegadoById,
  updateDelegado,
  deleteDelegado,

  getProgramasByFichaId,
  getProgramaById,
  createPrograma,
  updatePrograma,
  deletePrograma,

  getBeneficiosByProgramaId,
  getBeneficioById,
  createBeneficio,
  updateBeneficio,
  deleteBeneficio,
};

function camelCaseToSnakeCase(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => camelCaseToSnakeCase(item));
  }

  const result = Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key.replace(/([A-Z])/g, "_$1").toLowerCase(),
      typeof value === "object" && value !== null
        ? camelCaseToSnakeCase(value)
        : value,
    ])
  );

  return omit(result, ["id"]);
}

// Helper function to omit properties from an object
const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
};
