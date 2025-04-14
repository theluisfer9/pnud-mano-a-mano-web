import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import guatemalaJSON from "@/data/guatemala.json";
import { Programme } from "@/data/programme";
import type {
  Beneficio as ApiBenefit,
  New_RelacionConElemento,
} from "@/services/fichas";
import {
  addProgram,
  updateProgram,
  getPrograms,
  deleteProgram,
  addBenefit,
  updateBenefit,
  getBenefits,
  deleteBenefit,
} from "@/db/queries";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Combobox } from "@/components/Combobox/combobox";
import { Button } from "@/components/ui/button";
import { guatemalaGeography } from "@/data/geography";
import {
  getFichasWithDetails,
  createFicha,
  updateFicha,
  deleteFicha,
  createFichaCabecera,
  createDelegado,
  createFichaAutoridad,
  Delegado,
  createPrograma,
  updatePrograma,
  deletePrograma,
  createBeneficio,
  updateBeneficio,
  deleteBeneficio,
  createBeneficioFuncionarioFocal,
  addBeneficioPoblacionObjetivoAssociation,
  addBeneficioFinalidadAssociation,
  addBeneficioClasificadorTematicoAssociation,
  addBeneficioObjetoAssociation,
  addBeneficioFormaAssociation,
  addBeneficioFocalizacionAssociation,
  getPoblacionObjetivoElementos,
  getFinalidadElementos,
  getClasificadorTematicoElementos,
  getObjetoElementos,
  getFormaElementos,
  getFocalizacionElementos,
  getBeneficiosWithDetailsByProgramaId,
} from "@/services/fichas";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Benefit } from "@/data/benefit";
interface Goal {
  id: string;
  departamento: string;
  municipio: string;
  lugar_poblado: string;
  intervencion: string;
  meta: number;
  ejecutado: number;
}

const GoalsSection = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState<Omit<Goal, "id">>({
    departamento: "",
    municipio: "",
    lugar_poblado: "",
    intervencion: "",
    meta: 0,
    ejecutado: 0,
  });

  const [selectedDepartment, _setSelectedDepartment] = useState<string>("");
  const [availableMunicipalities, setAvailableMunicipalities] = useState<
    string[]
  >([]);

  // Update available municipalities when the department changes
  useEffect(() => {
    const department = guatemalaJSON.find(
      (dep) => dep.title === selectedDepartment
    );
    setAvailableMunicipalities(department ? department.mun : []);
  }, [selectedDepartment]);

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const goalData: Goal = {
      id: crypto.randomUUID(),
      ...newGoal,
    };
    setGoals([...goals, goalData]);
    setNewGoal({
      departamento: "",
      municipio: "",
      lugar_poblado: "",
      intervencion: "",
      meta: 0,
      ejecutado: 0,
    });
  };

  const handleEditGoal = (updatedGoal: Goal) => {
    setGoals(
      goals.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal))
    );
    setEditingGoal(null);
  };

  const handleDeleteGoal = (goal: Goal) => {
    setGoals(goals.filter((g) => g.id !== goal.id));
    setGoalToDelete(null);
  };

  return (
    <>
      <form onSubmit={handleCreateGoal} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Department Select */}
          <div className="flex flex-col gap-2">
            <label htmlFor="departamento" className="text-sm font-medium">
              Departamento
            </label>
            <select
              id="departamento"
              value={newGoal.departamento}
              onChange={(e) =>
                setNewGoal({ ...newGoal, departamento: e.target.value })
              }
              className="rounded-md border p-2"
              required
            >
              <option value="">Seleccione un departamento</option>
              {guatemalaJSON.map((dep) => (
                <option key={dep.title} value={dep.title}>
                  {dep.title}
                </option>
              ))}
            </select>
          </div>

          {/* Municipality Select */}
          <div className="flex flex-col gap-2">
            <label htmlFor="municipio" className="text-sm font-medium">
              Municipio
            </label>
            <select
              id="municipio"
              value={newGoal.municipio}
              onChange={(e) =>
                setNewGoal({ ...newGoal, municipio: e.target.value })
              }
              className="rounded-md border p-2"
              disabled={!newGoal.departamento}
              required
            >
              <option value="">Seleccione un municipio</option>
              {availableMunicipalities.map((mun) => (
                <option key={mun} value={mun}>
                  {mun}
                </option>
              ))}
            </select>
          </div>

          {/* Other fields */}
          <div className="flex flex-col gap-2">
            <label htmlFor="lugar_poblado" className="text-sm font-medium">
              Lugar Poblado
            </label>
            <input
              type="text"
              id="lugar_poblado"
              value={newGoal.lugar_poblado}
              onChange={(e) =>
                setNewGoal({ ...newGoal, lugar_poblado: e.target.value })
              }
              className="rounded-md border p-2"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="intervencion" className="text-sm font-medium">
              Intervención
            </label>
            <input
              type="text"
              id="intervencion"
              value={newGoal.intervencion}
              onChange={(e) =>
                setNewGoal({ ...newGoal, intervencion: e.target.value })
              }
              className="rounded-md border p-2"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="meta" className="text-sm font-medium">
              Meta
            </label>
            <input
              type="number"
              id="meta"
              value={newGoal.meta}
              onChange={(e) =>
                setNewGoal({ ...newGoal, meta: Number(e.target.value) })
              }
              className="rounded-md border p-2"
              required
              min="0"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="ejecutado" className="text-sm font-medium">
              Ejecutado
            </label>
            <input
              type="number"
              id="ejecutado"
              value={newGoal.ejecutado}
              onChange={(e) =>
                setNewGoal({ ...newGoal, ejecutado: Number(e.target.value) })
              }
              className="rounded-md border p-2"
              required
              min="0"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Crear Meta
        </button>
      </form>

      <div className="w-full overflow-x-auto mt-4">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              {Object.keys(newGoal).map((key) => (
                <th
                  key={key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {key.replace("_", " ")}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {goals.map((goal) => (
              <tr key={goal.id}>
                {Object.entries(newGoal).map(([key]) => (
                  <td
                    key={key}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {goal[key as keyof Omit<Goal, "id">]}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setEditingGoal(goal)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => setGoalToDelete(goal)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editingGoal} onOpenChange={() => setEditingGoal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Meta</DialogTitle>
            <DialogDescription>
              Modifique los campos necesarios. Los campos de departamento y
              municipio están vinculados.
            </DialogDescription>
          </DialogHeader>
          {editingGoal && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditGoal(editingGoal);
              }}
              className="space-y-4"
            >
              {/* Department Select */}
              <div className="flex flex-col gap-2">
                <label htmlFor="edit-departamento">Departamento</label>
                <select
                  id="edit-departamento"
                  value={editingGoal.departamento}
                  onChange={(e) =>
                    setEditingGoal({
                      ...editingGoal,
                      departamento: e.target.value,
                      municipio: "", // Reset municipality when department changes
                    })
                  }
                  className="rounded-md border p-2"
                >
                  <option value="">Seleccione un departamento</option>
                  {guatemalaJSON.map((dep) => (
                    <option key={dep.title} value={dep.title}>
                      {dep.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Municipality Select */}
              <div className="flex flex-col gap-2">
                <label htmlFor="edit-municipio">Municipio</label>
                <select
                  id="edit-municipio"
                  value={editingGoal.municipio}
                  onChange={(e) =>
                    setEditingGoal({
                      ...editingGoal,
                      municipio: e.target.value,
                    })
                  }
                  className="rounded-md border p-2"
                  disabled={!editingGoal.departamento}
                >
                  <option value="">Seleccione un municipio</option>
                  {guatemalaJSON
                    .find((dep) => dep.title === editingGoal.departamento)
                    ?.mun.map((mun) => (
                      <option key={mun} value={mun}>
                        {mun}
                      </option>
                    ))}
                </select>
              </div>

              {/* Other edit fields */}
              <div className="flex flex-col gap-2">
                <label htmlFor="edit-lugar_poblado">Lugar Poblado</label>
                <input
                  id="edit-lugar_poblado"
                  value={editingGoal.lugar_poblado}
                  onChange={(e) =>
                    setEditingGoal({
                      ...editingGoal,
                      lugar_poblado: e.target.value,
                    })
                  }
                  className="rounded-md border p-2"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="edit-intervencion">Intervención</label>
                <input
                  id="edit-intervencion"
                  value={editingGoal.intervencion}
                  onChange={(e) =>
                    setEditingGoal({
                      ...editingGoal,
                      intervencion: e.target.value,
                    })
                  }
                  className="rounded-md border p-2"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="edit-meta">Meta</label>
                <input
                  type="number"
                  id="edit-meta"
                  value={editingGoal.meta}
                  onChange={(e) =>
                    setEditingGoal({
                      ...editingGoal,
                      meta: Number(e.target.value),
                    })
                  }
                  className="rounded-md border p-2"
                  min="0"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="edit-ejecutado">Ejecutado</label>
                <input
                  type="number"
                  id="edit-ejecutado"
                  value={editingGoal.ejecutado}
                  onChange={(e) =>
                    setEditingGoal({
                      ...editingGoal,
                      ejecutado: Number(e.target.value),
                    })
                  }
                  className="rounded-md border p-2"
                  min="0"
                />
              </div>

              <DialogFooter>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Guardar Cambios
                </button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!goalToDelete} onOpenChange={() => setGoalToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmación de Eliminación</DialogTitle>
            <DialogDescription>
              Esta acción eliminará permanentemente la meta para{" "}
              {goalToDelete?.lugar_poblado} en {goalToDelete?.municipio},{" "}
              {goalToDelete?.departamento}. Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setGoalToDelete(null)}
              className="px-4 py-2 rounded-md mr-2 border"
            >
              Cancelar
            </button>
            <button
              onClick={() => goalToDelete && handleDeleteGoal(goalToDelete)}
              className="bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Eliminar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface Ficha {
  id: number;
  nombre: string;
  ano: string;
  estado: string;
  cabecera: FichaCabecera;
  programas?: Programa[];
}
interface FichaCabecera {
  id: number;
  institucion: string;
  siglas: string;
  nombreCorto: string;
  delegados: Delegado[];
  autoridad: {
    nombre: string;
    cargo: string;
  };
}
interface Programa {
  id: number;
  codigo: string;
  codigoSicoin: string;
  tipo: "programa" | "intervencion";
  nombreSicoin: string;
  nombreComun: string;
  descripcion: string;
  objetivo: string;
  marcoLegal: string;
  autoridad: {
    nombre: string;
    cargo: string;
  };
  funcionario: {
    nombre: string;
    cargo: string;
  };
  beneficios: Beneficio[];
}
interface Beneficio {
  // Add an id for easier state management and keying
  id: string; // Unique identifier for the benefit within the program/ficha
  codigoPrograma: string;
  nombrePrograma: string;
  codigo: string;
  codigoSicoin: string;
  nombreSubproducto: string;
  nombreCorto: string;
  nombre: string;
  descripcion: string;
  objetivo: string;
  tipo: "individual" | "familiar" | "comunitario" | "actores sociales";
  criteriosInclusion: string;
  atencionSocial: "protección" | "asistencia" | "promoción";
  rangoEdad:
    | "Primera infancia"
    | "Infancia"
    | "Adolescencia"
    | "Juventud"
    | "Adultos"
    | "Adultos mayores";
  poblacionObjetivo: {
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
  };
  finalidad: {
    reduccionPobreza: boolean;
    mejoraAccesoEducacion: boolean;
    fortalecimientoSeguridadAlimentaria: boolean;
    promocionSaludBienestar: boolean;
    prevencionAtencionViolencia: boolean;
  };
  clasificadorTematico: {
    ninez: boolean;
    adolescentesYJovenes: boolean;
    mujeres: boolean;
    adultos: boolean;
    adultosMayores: boolean;
    poblacionIndigena: boolean;
    personasConDiscapacidad: boolean;
    poblacionMigrante: boolean;
    areasPrecarizadas: boolean;
  };
  objeto: {
    ingresosFamiliares: boolean;
    condicionesDeVivienda: boolean;
    accesoAServiciosBasicos: boolean;
    nutricionYSalud: boolean;
    educacionYHabilidadesLaborales: boolean;
  };
  forma: {
    censoORegistrosOficiales: boolean;
    autoseleccion: boolean;
    seleccionPorIntermediacion: boolean;
    identificacionPorDemandaEspontanea: boolean;
  };
  focalizacion: {
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
  };
  funcionarioFocal: {
    nombre: string;
    cargo: string;
  };
}

const FichasSection = () => {
  const queryClient = useQueryClient();
  const { data: fichas, isLoading: isLoadingFichas } = useQuery({
    queryKey: ["fichas"],
    queryFn: getFichasWithDetails,
  });

  const {
    data: poblacionObjetivoElementos,
    isLoading: isLoadingPoblacionObjetivoElementos,
  } = useQuery({
    queryKey: ["poblacionObjetivoElementos"],
    queryFn: getPoblacionObjetivoElementos,
  });

  const { data: finalidadElementos, isLoading: isLoadingFinalidadElementos } =
    useQuery({
      queryKey: ["finalidadElementos"],
      queryFn: getFinalidadElementos,
    });

  const {
    data: clasificadorTematicoElementos,
    isLoading: isLoadingClasificadorTematicoElementos,
  } = useQuery({
    queryKey: ["clasificadorTematicoElementos"],
    queryFn: getClasificadorTematicoElementos,
  });

  const { data: objetoElementos, isLoading: isLoadingObjetoElementos } =
    useQuery({
      queryKey: ["objetoElementos"],
      queryFn: getObjetoElementos,
    });

  const { data: formaElementos, isLoading: isLoadingFormaElementos } = useQuery(
    {
      queryKey: ["formaElementos"],
      queryFn: getFormaElementos,
    }
  );

  const {
    data: focalizacionElementos,
    isLoading: isLoadingFocalizacionElementos,
  } = useQuery({
    queryKey: ["focalizacionElementos"],
    queryFn: getFocalizacionElementos,
  });

  // State to control the visibility of the creation form
  const [isCreatingFicha, setIsCreatingFicha] = useState(false);

  // Define initial empty state for Ficha Cabecera
  const initialFichaCabecera: FichaCabecera = {
    id: 0,
    institucion: "",
    siglas: "",
    nombreCorto: "",
    delegados: [
      { id: 0, nombre: "", telefono: "", rol: "", correo: "" },
      { id: 0, nombre: "", telefono: "", rol: "", correo: "" },
      { id: 0, nombre: "", telefono: "", rol: "", correo: "" },
    ],
    autoridad: { nombre: "", cargo: "" },
  };

  // State to hold the data for the new/editing ficha being created
  const [newFichaCabecera, setNewFichaCabecera] =
    useState<FichaCabecera>(initialFichaCabecera);
  const [editingFicha, setEditingFicha] = useState<Ficha | null>(null); // State to track the ficha being edited
  const [fichaToDelete, setFichaToDelete] = useState<Ficha | null>(null); // State for delete confirmation

  // --- New State Variables ---
  // State to track the ficha whose programs are being viewed/edited
  const [viewingFicha, setViewingFicha] = useState<Ficha | null>(null);
  // State to control visibility of the program creation form for the selected ficha
  const [isCreatingPrograma, setIsCreatingPrograma] = useState(false);
  // State to hold data for the new program being created
  const [newProgramaData, setNewProgramaData] = useState<
    Omit<Programa, "beneficios">
  >({
    id: 0,
    codigo: "",
    codigoSicoin: "",
    tipo: "programa",
    nombreSicoin: "",
    nombreComun: "",
    descripcion: "",
    objetivo: "",
    marcoLegal: "",
    autoridad: { nombre: "", cargo: "" },
    funcionario: { nombre: "", cargo: "" },
  });
  // State to track the program being edited (includes fichaId for context)
  const [editingPrograma, setEditingPrograma] = useState<{
    id: number;
    fichaId: number;
    // Store the *original* program being edited, mainly its code/id
    // The form fields will bind to newProgramaData
    programaCodigo: string;
  } | null>(null);
  // State to track the program being deleted (includes fichaId for context)
  const [programaToDelete, setProgramaToDelete] = useState<{
    id: number;
    fichaId: number;
    programaCodigo: string;
    programaNombre: string; // For the confirmation message
  } | null>(null);
  // --- End New State Variables ---

  // --- Beneficio State Variables ---
  const [viewingPrograma, setViewingPrograma] = useState<Programa | null>(null); // Track selected program
  const [isCreatingBeneficio, setIsCreatingBeneficio] = useState(false); // Control create modal
  const [isEditingBeneficio, setIsEditingBeneficio] = useState(false); // Control edit modal
  const [editingBeneficio, setEditingBeneficio] = useState<Beneficio | null>(
    null
  ); // Control edit modal
  const [beneficioToDelete, setBeneficioToDelete] = useState<Beneficio | null>(
    null
  ); // Control delete dialog

  // Initial empty state for a new benefit - Now fully defined
  const initialNewBeneficioData: Omit<
    Beneficio,
    "id" | "codigoPrograma" | "nombrePrograma"
  > = {
    codigo: "",
    codigoSicoin: "",
    nombreSubproducto: "",
    nombreCorto: "",
    nombre: "",
    descripcion: "",
    objetivo: "",
    tipo: "individual",
    criteriosInclusion: "",
    atencionSocial: "protección",
    rangoEdad: "Adultos",
    poblacionObjetivo: {
      porCondicionSocioeconomica: {
        personasEnPobrezaExtrema: false,
        hogaresConIngresos: false,
        nivelDeSalarioMinimo: false,
      },
      porCondicionDeVulnerabilidad: {
        personasConDiscapacidad: false,
        mujeresEnViolenciaDeGenero: false,
        poblacionGuatemalteca: false,
        personasIndocumentadas: false,
        migrantes: false,
      },
      porPertenenciaEtnicaOCultural: {
        comunidadesIndigenas: false,
        pueblosAfrodescendientes: false,
        gruposEtnicos: false,
        idiomas: false,
        sentidos: false,
      },
      porSituacionLaboral: {
        desempleados: false,
        personasEnSubempleo: false,
        jovenesEnExperienciaLaboral: false,
      },
      porGeneroYDomicilio: {
        personasJefasDeHogar: false,
        personasLGBTIQEnSituacionDeRiesgo: false,
      },
      porCondicionDeSalud: {
        personasConEnfermedadesCronicas: false,
        mujeresEmbarazadasEnRiesgo: false,
        ninosConDesnutricion: false,
      },
    },
    finalidad: {
      reduccionPobreza: false,
      mejoraAccesoEducacion: false,
      fortalecimientoSeguridadAlimentaria: false,
      promocionSaludBienestar: false,
      prevencionAtencionViolencia: false,
    },
    clasificadorTematico: {
      ninez: false,
      adolescentesYJovenes: false,
      mujeres: false,
      adultos: false,
      adultosMayores: false,
      poblacionIndigena: false,
      personasConDiscapacidad: false,
      poblacionMigrante: false,
      areasPrecarizadas: false,
    },
    objeto: {
      ingresosFamiliares: false,
      condicionesDeVivienda: false,
      accesoAServiciosBasicos: false,
      nutricionYSalud: false,
      educacionYHabilidadesLaborales: false,
    },
    forma: {
      censoORegistrosOficiales: false,
      autoseleccion: false,
      seleccionPorIntermediacion: false,
      identificacionPorDemandaEspontanea: false,
    },
    focalizacion: {
      geografica: {
        municipiosConMayoresNivelesDePobreza: false,
        comunidadesRuralesDeOfidicilAcceso: false,
        zonasUrbanoMarginales: false,
      },
      demografica: {
        segunGrupoEtarioGeneroYEtnia: false,
      },
      socioeconomica: {
        basadoEnIngresosPerCapita: false,
        basadoEnAccesoAServiciosBasicos: false,
      },
      porVulnerabilidad: {
        personasConNecesidadesUrgentes: false,
        desplazadosVictimasDeViolencia: false,
      },
      multidimensional: {
        combinacionDeCriterios: false,
      },
    },
    funcionarioFocal: { nombre: "", cargo: "" },
  };

  const [newBeneficioData, setNewBeneficioData] = useState<
    Omit<Beneficio, "id" | "codigoPrograma" | "nombrePrograma">
  >(initialNewBeneficioData);
  // --- End Beneficio State Variables ---

  // Handler for input changes in the form
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: keyof FichaCabecera | "delegado" | "autoridad",
    index?: number,
    field?: string
  ) => {
    const { value } = e.target;

    if (section === "delegado" && index !== undefined && field) {
      const updatedDelegados = [...newFichaCabecera.delegados];
      updatedDelegados[index] = {
        ...updatedDelegados[index],
        [field]: value,
      };
      setNewFichaCabecera({
        ...newFichaCabecera,
        delegados: updatedDelegados,
      });
    } else if (section === "autoridad" && field) {
      setNewFichaCabecera({
        ...newFichaCabecera,
        autoridad: { ...newFichaCabecera.autoridad, [field]: value },
      });
    } else if (
      section !== "delegado" &&
      section !== "autoridad" &&
      section !== "delegados" // Ensure 'delegados' itself is not treated as a direct field
    ) {
      setNewFichaCabecera({
        ...newFichaCabecera,
        [section]: value, // Use 'section' which corresponds to institucion, siglas, nombreCorto
      });
    }
  };

  // Handler to add a new empty delegado if less than 3 exist
  const handleAddDelegado = () => {
    setNewFichaCabecera((prev) => {
      if (prev.delegados.length < 3) {
        return {
          ...prev,
          delegados: [
            ...prev.delegados,
            { id: 0, nombre: "", telefono: "", rol: "", correo: "" }, // Add empty delegado
          ],
        };
      }
      return prev; // Return previous state if already 3 or more
    });
  };

  // Handler to create or update the ficha
  const handleSubmitFicha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFicha) {
      // --- Update Logic ---
      const updatedFicha: Ficha = {
        ...editingFicha, // Keep id, ano, estado, programas etc. from the original
        cabecera: newFichaCabecera,
        // Optionally update the name based on the new cabecera data
        nombre:
          newFichaCabecera.siglas ||
          newFichaCabecera.nombreCorto ||
          newFichaCabecera.institucion,
      };

      // Convert the component Ficha to the API's Ficha format
      const apiFormatFicha = {
        ...updatedFicha,
        cabecera: {
          ...updatedFicha.cabecera,
          delegados: updatedFicha.cabecera.delegados.map((d) => ({
            ...d,
            id: d.id,
          })),
        },
        // Convert programas to match API format
        programas: updatedFicha.programas?.map((prog) => ({
          ...prog,
          id: prog.id,
          beneficios: prog.beneficios || [], // Ensure beneficios is not undefined
        })),
      };

      // Now pass it to the API function
      updateFicha(editingFicha.id, apiFormatFicha);

      // Invalidate and refetch fichas after update
      queryClient.invalidateQueries({ queryKey: ["fichas"] });

      setEditingFicha(null); // Clear editing state
    } else {
      // --- Create Logic ---
      if (!fichas || (typeof fichas === "object" && "error" in fichas)) {
        return;
      }
      const newFicha: Ficha = {
        // Generate a more robust unique ID
        id: fichas.length > 0 ? Math.max(...fichas.map((f) => f.id)) + 1 : 1,
        nombre:
          newFichaCabecera.siglas ||
          newFichaCabecera.nombreCorto ||
          newFichaCabecera.institucion, // Example name derivation
        ano: new Date().getFullYear().toString(), // Default to current year
        estado: "Pendiente", // Default status
        cabecera: newFichaCabecera,
        programas: [],
      };
      const fichaResponse = await createFicha({
        id: newFicha.id,
        nombre: newFicha.nombre,
        ano: newFicha.ano,
        estado: newFicha.estado,
      });
      if ("error" in fichaResponse) {
        console.error("Error creating ficha:", fichaResponse.error);
        return;
      }
      const fichaId = fichaResponse.fichaId;
      // Now create the cabecera
      const cabeceraResponse = await createFichaCabecera(fichaId, {
        institucion: newFichaCabecera.institucion,
        siglas: newFichaCabecera.siglas,
        nombreCorto: newFichaCabecera.nombreCorto,
        id: 0,
      });

      // Check for error (if it's an object with 'error' property)
      if (typeof cabeceraResponse === "object" && "error" in cabeceraResponse) {
        console.error("Error creating cabecera:", cabeceraResponse.error);
        return;
      }
      // Success case (when response is a boolean)
      const delegado1Promise = createDelegado(fichaId, {
        id: 0,
        nombre: newFichaCabecera.delegados[0].nombre,
        telefono: newFichaCabecera.delegados[0].telefono,
        rol: newFichaCabecera.delegados[0].rol,
        correo: newFichaCabecera.delegados[0].correo,
      });
      const delegado2Promise = createDelegado(fichaId, {
        id: 0,
        nombre: newFichaCabecera.delegados[1].nombre,
        telefono: newFichaCabecera.delegados[1].telefono,
        rol: newFichaCabecera.delegados[1].rol,
        correo: newFichaCabecera.delegados[1].correo,
      });
      const delegado3Promise = createDelegado(fichaId, {
        id: 0,
        nombre: newFichaCabecera.delegados[2].nombre,
        telefono: newFichaCabecera.delegados[2].telefono,
        rol: newFichaCabecera.delegados[2].rol,
        correo: newFichaCabecera.delegados[2].correo,
      });
      const [delegado1, delegado2, delegado3] = await Promise.all([
        delegado1Promise,
        delegado2Promise,
        delegado3Promise,
      ]);
      if (
        "error" in delegado1 ||
        "error" in delegado2 ||
        "error" in delegado3
      ) {
        console.error("Error creating delegados:", {
          delegado1: "error" in delegado1 ? delegado1.error : null,
          delegado2: "error" in delegado2 ? delegado2.error : null,
          delegado3: "error" in delegado3 ? delegado3.error : null,
        });
        return;
      }
      const autoridadResponse = await createFichaAutoridad(fichaId, {
        nombre: newFichaCabecera.autoridad.nombre,
        cargo: newFichaCabecera.autoridad.cargo,
      });
      if ("error" in autoridadResponse) {
        console.error("Error creating autoridad:", autoridadResponse.error);
        return;
      }
      // Success, show success message
      toast.success("Ficha creada exitosamente");
      // Invalidate and refetch fichas after create
      queryClient.invalidateQueries({ queryKey: ["fichas"] });
    }
    // Reset form and hide it
    setNewFichaCabecera(initialFichaCabecera); // Reset to initial empty state
    setIsCreatingFicha(false);
  };

  // Handler to initiate editing a ficha
  const handleEditFicha = (fichaId: number) => {
    if (!fichas || (typeof fichas === "object" && "error" in fichas)) {
      return;
    }
    const fichaToEdit = fichas.find((f) => f.id === fichaId);
    if (fichaToEdit) {
      // Cast to component Ficha type with guaranteed non-undefined properties
      const normalizedFicha = {
        ...fichaToEdit,
        cabecera: fichaToEdit.cabecera || initialFichaCabecera,
        programas: (fichaToEdit.programas || []).map((prog) => ({
          ...prog,
          beneficios: prog.beneficios || [],
        })),
      } as Ficha;
      console.log("normalizedFicha", normalizedFicha);
      setEditingFicha(normalizedFicha);
      setNewFichaCabecera({
        ...(fichaToEdit.cabecera || initialFichaCabecera),
      });
      setIsCreatingFicha(true);
      setViewingFicha(null);
    }
  };

  // --- New Handlers ---
  // Handler for input changes in the program creation form
  const handleProgramaInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    section?: "autoridad" | "funcionario",
    field?: string
  ) => {
    const { name, value } = e.target;

    if (section === "autoridad" && field) {
      setNewProgramaData((prev) => ({
        ...prev,
        autoridad: { ...prev.autoridad, [field]: value },
      }));
    } else if (section === "funcionario" && field) {
      setNewProgramaData((prev) => ({
        ...prev,
        funcionario: { ...prev.funcionario, [field]: value },
      }));
    } else {
      // Handle top-level fields including 'tipo' select
      setNewProgramaData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handler to add the new program to the currently viewed ficha
  const handleSubmitPrograma = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingFicha) return;

    // --- Edit Logic ---
    if (editingPrograma) {
      const updatedProgramData: Omit<Programa, "beneficios"> = {
        ...newProgramaData, // Data from the form
        codigo: editingPrograma.programaCodigo, // Ensure original code is kept if needed, or use newProgramaData.codigo if editable
      };

      const updatedProgramResponse = await updatePrograma(
        editingPrograma.id,
        updatedProgramData
      );
      if ("error" in updatedProgramResponse) {
        console.error("Error updating programa:", updatedProgramResponse.error);
        toast.error("Error al actualizar el programa");
        return;
      }
      // Invalidate and refetch fichas after update
      queryClient.invalidateQueries({ queryKey: ["fichas"] });

      // Update the viewingFicha state as well to reflect the change immediately in the UI
      setViewingFicha((prev) =>
        prev && prev.id === editingPrograma.fichaId
          ? {
              ...prev,
              programas: prev.programas?.map((prog) =>
                prog.codigo === editingPrograma.programaCodigo
                  ? { ...prog, ...updatedProgramData } // Update existing program, keep benefits
                  : prog
              ),
            }
          : prev
      );

      setEditingPrograma(null); // Clear editing state
    }
    // --- Create Logic ---
    else {
      const newProgramaWithIdAndBenefits: Programa = {
        ...newProgramaData,
        codigo:
          newProgramaData.codigo ||
          `PROG-${viewingFicha.id}-${
            (viewingFicha.programas?.length || 0) + 1
          }`,
        beneficios: [], // Initialize with empty benefits array
      };
      const programaResponse = await createPrograma(viewingFicha.id, {
        ...newProgramaWithIdAndBenefits,
        id: 0,
      });
      if ("error" in programaResponse) {
        console.error("Error creating programa:", programaResponse.error);
        return;
      }
      // Success, show success message
      toast.success("Programa creado exitosamente");
      // Invalidate and refetch fichas after create
      queryClient.invalidateQueries({ queryKey: ["fichas"] });

      setViewingFicha((prev) =>
        prev
          ? {
              ...prev,
              programas: [
                ...(prev.programas || []),
                newProgramaWithIdAndBenefits,
              ],
            }
          : null
      );
    }

    // Reset form and state for both create and edit
    setIsCreatingPrograma(false);
    setNewProgramaData({
      // Reset to initial empty state
      id: 0,
      codigo: "",
      codigoSicoin: "",
      tipo: "programa",
      nombreSicoin: "",
      nombreComun: "",
      descripcion: "",
      objetivo: "",
      marcoLegal: "",
      autoridad: { nombre: "", cargo: "" },
      funcionario: { nombre: "", cargo: "" },
    });
  };

  const handleEditPrograma = (programaCodigo: string) => {
    if (!viewingFicha) return;
    const programaToEdit = viewingFicha.programas?.find(
      (p) => p.codigo === programaCodigo
    );
    if (programaToEdit) {
      // 1. Populate the form state (newProgramaData) with the program's current data
      setNewProgramaData({
        id: programaToEdit.id,
        codigo: programaToEdit.codigo,
        codigoSicoin: programaToEdit.codigoSicoin,
        tipo: programaToEdit.tipo,
        nombreSicoin: programaToEdit.nombreSicoin,
        nombreComun: programaToEdit.nombreComun,
        descripcion: programaToEdit.descripcion,
        objetivo: programaToEdit.objetivo,
        marcoLegal: programaToEdit.marcoLegal,
        autoridad: { ...programaToEdit.autoridad }, // Ensure deep copy for objects
        funcionario: { ...programaToEdit.funcionario }, // Ensure deep copy for objects
      });
      // 2. Set the editingPrograma state to indicate we are editing
      setEditingPrograma({
        id: programaToEdit.id,
        fichaId: viewingFicha.id,
        programaCodigo: programaToEdit.codigo, // Store the code/id of the program being edited
      });
      // 3. Show the form
      setIsCreatingPrograma(true);
      setViewingPrograma(null); // Ensure we are not in benefit view
    }
  };
  // Handler to set the ficha to view programs for
  const handleViewPrograms = (fichaId: number) => {
    if (!fichas || (typeof fichas === "object" && "error" in fichas)) {
      return;
    }
    const fichaToView = fichas.find((f) => f.id === fichaId);
    if (fichaToView) {
      // Cast to component Ficha type with guaranteed non-undefined properties
      const normalizedFicha = {
        ...fichaToView,
        cabecera: fichaToView.cabecera || initialFichaCabecera,
        programas: (fichaToView.programas || []).map((prog) => ({
          ...prog,
          beneficios: prog.beneficios || [],
        })),
      } as Ficha;

      setViewingFicha(normalizedFicha);
      setIsCreatingFicha(false);
      setIsCreatingPrograma(false);
      setViewingPrograma(null);
      setEditingPrograma(null);
    }
  };

  // Handler to go back to the main fichas list
  const handleBackToFichas = () => {
    setViewingFicha(null);
    setIsCreatingPrograma(false);
    setViewingPrograma(null); // Also clear viewing programa
    setEditingPrograma(null); // Reset program editing state
  };
  // --- End New Handlers ---

  // --- Beneficio Handlers ---

  // Navigate to the benefits view for a specific program
  const handleViewBeneficios = async (programaCodigo: string) => {
    if (!viewingFicha) return;
    console.log("viewingFicha", viewingFicha);
    const programa = viewingFicha.programas?.find(
      (p) => p.codigo === programaCodigo
    );
    console.log("programa", programa);
    if (programa) {
      setViewingPrograma(programa);
      await handleViewBeneficiosDetails(programa.id);
      // Reset other states if necessary
      setIsCreatingPrograma(false);
      setIsCreatingBeneficio(false);
      setEditingBeneficio(null);
      setBeneficioToDelete(null);
    }
  };
  const handleViewBeneficiosDetails = async (programaId: number) => {
    if (!programaId) return;
    try {
      const beneficios = await getBeneficiosWithDetailsByProgramaId(programaId);
      if ("error" in beneficios) {
        console.error("Error fetching beneficios:", beneficios.error);
        return;
      }
      // Convert API response to Beneficio format with proper mapping
      const beneficiosConverted: Beneficio[] = beneficios.map((beneficio) => ({
        id: String(beneficio.id),
        codigoPrograma: beneficio.codigoPrograma || "",
        nombrePrograma: beneficio.nombrePrograma || "",
        codigo: beneficio.codigo || "",
        codigoSicoin: beneficio.codigoSicoin || "",
        nombreSubproducto: beneficio.nombreSubproducto || "",
        nombreCorto: beneficio.nombreCorto || "",
        nombre: beneficio.nombre || "",
        descripcion: beneficio.descripcion || "",
        objetivo: beneficio.objetivo || "",
        tipo: beneficio.tipo as
          | "individual"
          | "familiar"
          | "comunitario"
          | "actores sociales",
        criteriosInclusion: beneficio.criteriosInclusion || "",
        atencionSocial: beneficio.atencionSocial as
          | "protección"
          | "asistencia"
          | "promoción",
        rangoEdad: beneficio.rangoEdad as
          | "Primera infancia"
          | "Infancia"
          | "Adolescencia"
          | "Juventud"
          | "Adultos"
          | "Adultos mayores",
        poblacionObjetivo: mapApiPoblacionObjetivo(beneficio.poblacionObjetivo),
        finalidad: mapApiFinalidad(beneficio.finalidad),
        clasificadorTematico: mapApiClasificadorTematico(
          beneficio.clasificadorTematico
        ),
        objeto: mapApiObjeto(beneficio.objeto),
        forma: mapApiForma(beneficio.forma),
        focalizacion: mapApiFocalizacion(beneficio.focalizacion),
        funcionarioFocal: {
          nombre: beneficio.funcionarioFocal?.nombre || "",
          cargo: beneficio.funcionarioFocal?.cargo || "",
        },
      }));
      console.log(
        "beneficiosConverted",
        beneficiosConverted[0].poblacionObjetivo
      );
      setViewingPrograma((prev) =>
        prev ? { ...prev, beneficios: beneficiosConverted } : null
      );
    } catch (error) {
      console.error("Error fetching beneficios:", error);
    }
  };

  // Helper functions to map API response fields to expected structure
  const mapApiPoblacionObjetivo = (poblacionObj: New_RelacionConElemento[]) => {
    // Grab the elements from the poblacionObjetivo array dinamically, with their category and criterio
    const poblacionObjetivo = poblacionObj.map((poblacion) => ({
      category: poblacion.elemento.categoria,
      criterio: poblacion.elemento.criterio,
    }));
    console.log("poblacionObjetivo", poblacionObjetivo);
    const porCondicionSocioeconomica = poblacionObjetivo.filter(
      (poblacion) => poblacion.category === "Por condición socioeconómica"
    );
    const porCondicionDeVulnerabilidad = poblacionObjetivo.filter(
      (poblacion) => poblacion.category === "Por condición de vulnerabilidad"
    );
    const porPertenenciaEtnicaOCultural = poblacionObjetivo.filter(
      (poblacion) => poblacion.category === "Por pertenencia etnica o cultural"
    );
    const porSituacionLaboral = poblacionObjetivo.filter(
      (poblacion) => poblacion.category === "Por situación laboral"
    );
    const porGeneroYDomicilio = poblacionObjetivo.filter(
      (poblacion) => poblacion.category === "Por género y domicilio"
    );
    const porCondicionDeSalud = poblacionObjetivo.filter(
      (poblacion) => poblacion.category === "Por condición de salud"
    );
    // Now lets create the poblacionObjetivoMapped object, with boolean values
    const poblacionObjetivoMapped: Beneficio["poblacionObjetivo"] = {
      porCondicionSocioeconomica: {
        personasEnPobrezaExtrema: porCondicionSocioeconomica.some(
          (poblacion) => poblacion.criterio === "Personas en pobreza extrema"
        ),
        hogaresConIngresos: porCondicionSocioeconomica.some(
          (poblacion) => poblacion.criterio === "Hogares con ingresos"
        ),
        nivelDeSalarioMinimo: porCondicionSocioeconomica.some(
          (poblacion) => poblacion.criterio === "Nivel de salario mínimo"
        ),
      },
      porCondicionDeVulnerabilidad: {
        personasConDiscapacidad: porCondicionDeVulnerabilidad.some(
          (poblacion) => poblacion.criterio === "Personas con discapacidad"
        ),
        mujeresEnViolenciaDeGenero: porCondicionDeVulnerabilidad.some(
          (poblacion) => poblacion.criterio === "Mujeres en violencia de género"
        ),
        poblacionGuatemalteca: porCondicionDeVulnerabilidad.some(
          (poblacion) => poblacion.criterio === "Población guatemalteca"
        ),
        personasIndocumentadas: porCondicionDeVulnerabilidad.some(
          (poblacion) => poblacion.criterio === "Personas indocumentadas"
        ),
        migrantes: porCondicionDeVulnerabilidad.some(
          (poblacion) => poblacion.criterio === "Migrantes"
        ),
      },
      porPertenenciaEtnicaOCultural: {
        comunidadesIndigenas: porPertenenciaEtnicaOCultural.some(
          (poblacion) => poblacion.criterio === "Comunidades indígenas"
        ),
        pueblosAfrodescendientes: porPertenenciaEtnicaOCultural.some(
          (poblacion) => poblacion.criterio === "Pueblos afrodescendientes"
        ),
        gruposEtnicos: porPertenenciaEtnicaOCultural.some(
          (poblacion) => poblacion.criterio === "Grupos étnicos"
        ),
        idiomas: porPertenenciaEtnicaOCultural.some(
          (poblacion) => poblacion.criterio === "Idiomas"
        ),
        sentidos: porPertenenciaEtnicaOCultural.some(
          (poblacion) => poblacion.criterio === "Sentidos"
        ),
      },
      porSituacionLaboral: {
        desempleados: porSituacionLaboral.some(
          (poblacion) => poblacion.criterio === "Desempleados"
        ),
        personasEnSubempleo: porSituacionLaboral.some(
          (poblacion) => poblacion.criterio === "Personas en subempleo"
        ),
        jovenesEnExperienciaLaboral: porSituacionLaboral.some(
          (poblacion) => poblacion.criterio === "Jóvenes en experiencia laboral"
        ),
      },
      porGeneroYDomicilio: {
        personasJefasDeHogar: porGeneroYDomicilio.some(
          (poblacion) => poblacion.criterio === "Personas jefas de hogar"
        ),
        personasLGBTIQEnSituacionDeRiesgo: porGeneroYDomicilio.some(
          (poblacion) =>
            poblacion.criterio === "Personas LGBTIQ en situación de riesgo"
        ),
      },
      porCondicionDeSalud: {
        personasConEnfermedadesCronicas: porCondicionDeSalud.some(
          (poblacion) =>
            poblacion.criterio === "Personas con enfermedades crónicas"
        ),
        mujeresEmbarazadasEnRiesgo: porCondicionDeSalud.some(
          (poblacion) => poblacion.criterio === "Mujeres embarazadas en riesgo"
        ),
        ninosConDesnutricion: porCondicionDeSalud.some(
          (poblacion) => poblacion.criterio === "Niños con desnutrición"
        ),
      },
    };
    return poblacionObjetivoMapped;
  };

  const mapApiFinalidad = (finalidadObj: any) => {
    return {
      reduccionPobreza: finalidadObj?.reduccion_pobreza || false,
      mejoraAccesoEducacion: finalidadObj?.mejora_acceso_educacion || false,
      fortalecimientoSeguridadAlimentaria:
        finalidadObj?.fortalecimiento_seguridad_alimentaria || false,
      promocionSaludBienestar: finalidadObj?.promocion_salud_bienestar || false,
      prevencionAtencionViolencia:
        finalidadObj?.prevencion_atencion_violencia || false,
    };
  };

  const mapApiClasificadorTematico = (clasificadorObj: any) => {
    return {
      ninez: clasificadorObj?.ninez || false,
      adolescentesYJovenes: clasificadorObj?.adolescentes_y_jovenes || false,
      mujeres: clasificadorObj?.mujeres || false,
      adultos: clasificadorObj?.adultos || false,
      adultosMayores: clasificadorObj?.adultos_mayores || false,
      poblacionIndigena: clasificadorObj?.poblacion_indigena || false,
      personasConDiscapacidad:
        clasificadorObj?.personas_con_discapacidad || false,
      poblacionMigrante: clasificadorObj?.poblacion_migrante || false,
      areasPrecarizadas: clasificadorObj?.areas_precarizadas || false,
    };
  };

  const mapApiObjeto = (objetoObj: any) => {
    return {
      ingresosFamiliares: objetoObj?.ingresos_familiares || false,
      condicionesDeVivienda: objetoObj?.condiciones_de_vivienda || false,
      accesoAServiciosBasicos: objetoObj?.acceso_a_servicios_basicos || false,
      nutricionYSalud: objetoObj?.nutricion_y_salud || false,
      educacionYHabilidadesLaborales:
        objetoObj?.educacion_y_habilidades_laborales || false,
    };
  };

  const mapApiForma = (formaObj: any) => {
    return {
      censoORegistrosOficiales: formaObj?.censo_o_registros_oficiales || false,
      autoseleccion: formaObj?.autoseleccion || false,
      seleccionPorIntermediacion:
        formaObj?.seleccion_por_intermediacion || false,
      identificacionPorDemandaEspontanea:
        formaObj?.identificacion_por_demanda_espontanea || false,
    };
  };

  const mapApiFocalizacion = (focalizacionObj: any) => {
    return {
      geografica: {
        municipiosConMayoresNivelesDePobreza:
          focalizacionObj?.geografica
            ?.municipios_con_mayores_niveles_de_pobreza || false,
        comunidadesRuralesDeOfidicilAcceso:
          focalizacionObj?.geografica?.comunidades_rurales_de_ofidicil_acceso ||
          false,
        zonasUrbanoMarginales:
          focalizacionObj?.geografica?.zonas_urbano_marginales || false,
      },
      demografica: {
        segunGrupoEtarioGeneroYEtnia:
          focalizacionObj?.demografica?.segun_grupo_etario_genero_y_etnia ||
          false,
      },
      socioeconomica: {
        basadoEnIngresosPerCapita:
          focalizacionObj?.socioeconomica?.basado_en_ingresos_per_capita ||
          false,
        basadoEnAccesoAServiciosBasicos:
          focalizacionObj?.socioeconomica
            ?.basado_en_acceso_a_servicios_basicos || false,
      },
      porVulnerabilidad: {
        personasConNecesidadesUrgentes:
          focalizacionObj?.por_vulnerabilidad
            ?.personas_con_necesidades_urgentes || false,
        desplazadosVictimasDeViolencia:
          focalizacionObj?.por_vulnerabilidad
            ?.desplazados_victimas_de_violencia || false,
      },
      multidimensional: {
        combinacionDeCriterios:
          focalizacionObj?.multidimensional?.combinacion_de_criterios || false,
      },
    };
  };

  // Navigate back from benefits view to programs view
  const handleBackToProgramas = () => {
    setViewingPrograma(null);
    // Reset benefit-specific states
    setIsCreatingBeneficio(false);
    setEditingBeneficio(null);
    setBeneficioToDelete(null);
  };

  // Handle input changes for the new/editing beneficio form (Updated for nesting)
  const handleBeneficioInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const inputElement = e.target as HTMLInputElement; // Cast for checkbox properties
    console.log("Name", name);
    console.log("Value", value);
    console.log("Type", type);

    // --- Update Logic for Nested State ---
    if (name.includes(".")) {
      const targetValue = type === "checkbox" ? inputElement.checked : value; // Use boolean for nested checkboxes

      // Split by dots but preserve the original key names
      const keys = name.split(".");
      console.log("Keys", keys);

      setNewBeneficioData((prev) => {
        // Create deep copies to ensure immutability
        const newState = JSON.parse(JSON.stringify(prev));
        let currentLevel = newState;

        // Navigate to the parent object of the target key
        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i].trim(); // Trim any whitespace
          if (!currentLevel[key]) {
            currentLevel[key] = {}; // Initialize if path doesn't exist
          }
          currentLevel = currentLevel[key];
        }

        // Set the value at the final key
        const finalKey = keys[keys.length - 1].trim();
        currentLevel[finalKey] = targetValue;
        return newState;
      });
    } else if (name === "rangoEdad" && type === "checkbox") {
      // Special handling for rangoEdad "radio button like" checkboxes
      // Only update if the checkbox is being checked to set the string value
      if (inputElement.checked) {
        setNewBeneficioData((prev) => ({
          ...prev,
          [name]: value as Beneficio["rangoEdad"],
        })); // Set the string value
      }
      // No need for an 'else' case, as clicking another checkbox in the group
      // will trigger this handler again and set the new value, implicitly unchecking
      // the previously selected one via the 'checked' prop logic.
    } else if (name in newBeneficioData) {
      // Handle other top-level fields (inputs, textareas, selects)
      // Checkboxes handled here should store boolean values
      const targetValue = type === "checkbox" ? inputElement.checked : value;
      setNewBeneficioData((prev) => ({ ...prev, [name]: targetValue }));
    } else {
      console.warn(
        `Unhandled input name in handleBeneficioInputChange: ${name}`
      );
    }
    // Note: A similar handler/logic would be needed for the editingBeneficio state when implemented
  };

  // Add a new benefit to the current program
  const handleAddBeneficio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingFicha || !viewingPrograma) return;

    const newBenefit: Beneficio = {
      ...newBeneficioData,
      id: "0", // Generate a unique ID for the benefit
      codigoPrograma: viewingPrograma.codigo,
      nombrePrograma: viewingPrograma.nombreComun,
    };

    // Transform the component's Beneficio to the API's Benefit format
    const apiBenefit: ApiBenefit = {
      id: newBenefit.id,
      codigo: newBenefit.codigo,
      codigoSicoin: newBenefit.codigoSicoin,
      nombreSubproducto: newBenefit.nombreSubproducto,
      nombreCorto: newBenefit.nombreCorto,
      nombre: newBenefit.nombre,
      descripcion: newBenefit.descripcion,
      objetivo: newBenefit.objetivo,
      tipo: newBenefit.tipo,
      criteriosInclusion: newBenefit.criteriosInclusion,
      atencionSocial: newBenefit.atencionSocial,
      rangoEdad: newBenefit.rangoEdad,
      poblacionObjetivo: newBenefit.poblacionObjetivo,
      finalidad: newBenefit.finalidad,
      clasificadorTematico: newBenefit.clasificadorTematico,
      objeto: newBenefit.objeto,
      forma: newBenefit.forma,
      funcionarioFocal: newBenefit.funcionarioFocal,
      codigoPrograma: newBenefit.codigoPrograma,
      nombrePrograma: newBenefit.nombrePrograma,
      focalizacion: newBenefit.focalizacion,
    };
    // Create related entities for the beneficio
    const createBeneficioResponse = await createBeneficio(
      viewingPrograma.id,
      apiBenefit
    );
    if ("error" in createBeneficioResponse) {
      console.error("Error creating benefit:", createBeneficioResponse.error);
      toast.error("Error al crear el beneficio");
      return;
    }

    // Create associated entities
    try {
      // Create funcionario focal
      const funcionarioResponse = await createBeneficioFuncionarioFocal(
        createBeneficioResponse.beneficioId,
        apiBenefit.funcionarioFocal
      );
      if (
        typeof funcionarioResponse === "object" &&
        "error" in funcionarioResponse
      ) {
        console.error(
          "Error creating funcionario focal:",
          funcionarioResponse.error
        );
        toast.error("Error al crear relaciones del beneficio");
        return;
      }

      // Create población objetivo
      if (!poblacionObjetivoElementos || "error" in poblacionObjetivoElementos)
        return;
      const poblacionResponse = await addBeneficioPoblacionObjetivoAssociation(
        createBeneficioResponse.beneficioId,
        apiBenefit.poblacionObjetivo,
        poblacionObjetivoElementos
      );
      if (
        typeof poblacionResponse === "object" &&
        "error" in poblacionResponse
      ) {
        console.error(
          "Error creating población objetivo:",
          poblacionResponse.error
        );
        toast.error("Error al crear relaciones del beneficio");
        return;
      }

      // Create finalidad
      if (!finalidadElementos || "error" in finalidadElementos) return;
      const finalidadResponse = await addBeneficioFinalidadAssociation(
        createBeneficioResponse.beneficioId,
        apiBenefit.finalidad,
        finalidadElementos
      );
      if (
        typeof finalidadResponse === "object" &&
        "error" in finalidadResponse
      ) {
        console.error("Error creating finalidad:", finalidadResponse.error);
        toast.error("Error al crear relaciones del beneficio");
        return;
      }

      // Create clasificador temático
      if (
        !clasificadorTematicoElementos ||
        "error" in clasificadorTematicoElementos
      )
        return;
      const clasificadorResponse =
        await addBeneficioClasificadorTematicoAssociation(
          createBeneficioResponse.beneficioId,
          apiBenefit.clasificadorTematico,
          clasificadorTematicoElementos
        );
      if (
        typeof clasificadorResponse === "object" &&
        "error" in clasificadorResponse
      ) {
        console.error(
          "Error creating clasificador temático:",
          clasificadorResponse.error
        );
        toast.error("Error al crear relaciones del beneficio");
        return;
      }

      // Create objeto
      if (!objetoElementos || "error" in objetoElementos) return;
      const objetoResponse = await addBeneficioObjetoAssociation(
        createBeneficioResponse.beneficioId,
        apiBenefit.objeto,
        objetoElementos
      );
      if (typeof objetoResponse === "object" && "error" in objetoResponse) {
        console.error("Error creating objeto:", objetoResponse.error);
        toast.error("Error al crear relaciones del beneficio");
        return;
      }

      // Create forma
      if (!formaElementos || "error" in formaElementos) return;
      const formaResponse = await addBeneficioFormaAssociation(
        createBeneficioResponse.beneficioId,
        apiBenefit.forma,
        formaElementos
      );
      if (typeof formaResponse === "object" && "error" in formaResponse) {
        console.error("Error creating forma:", formaResponse.error);
        toast.error("Error al crear relaciones del beneficio");
        return;
      }

      // Create focalización
      if (!focalizacionElementos || "error" in focalizacionElementos) return;
      const focalizacionResponse = await addBeneficioFocalizacionAssociation(
        createBeneficioResponse.beneficioId,
        apiBenefit.focalizacion,
        focalizacionElementos
      );
      if (
        typeof focalizacionResponse === "object" &&
        "error" in focalizacionResponse
      ) {
        console.error(
          "Error creating focalización:",
          focalizacionResponse.error
        );
        toast.error("Error al crear relaciones del beneficio");
        return;
      }
    } catch (error) {
      console.error("Error creating benefit associations:", error);
      toast.error("Error al crear relaciones del beneficio");
      return;
    }

    toast.success("Beneficio creado exitosamente");
    queryClient.invalidateQueries({ queryKey: ["fichas"] });

    // Close modal and reset form
    setIsCreatingBeneficio(false);
    setNewBeneficioData(initialNewBeneficioData); // Reset to the fully defined initial state
  };

  // Open the delete confirmation
  const handleOpenDeleteBeneficioModal = (beneficio: Beneficio) => {
    setBeneficioToDelete(beneficio);
  };

  // Handle the actual deletion
  const handleDeleteBeneficio = () => {
    if (!viewingFicha || !viewingPrograma || !beneficioToDelete) return;

    const updatedBeneficios = viewingPrograma.beneficios.filter(
      (b) => b.id !== beneficioToDelete.id
    );

    const updatedViewingPrograma = {
      ...viewingPrograma,
      beneficios: updatedBeneficios,
    };
    setViewingPrograma(updatedViewingPrograma);

    // Update the fichas in queryClient cache instead of using setFichas
    queryClient.setQueryData(
      ["fichas"],
      (currentFichas: Ficha[] | undefined) => {
        if (!currentFichas) return currentFichas;

        return currentFichas.map((ficha: Ficha) =>
          ficha.id === viewingFicha.id
            ? {
                ...ficha,
                programas: ficha.programas?.map((prog: Programa) =>
                  prog.codigo === viewingPrograma.codigo
                    ? updatedViewingPrograma
                    : prog
                ),
              }
            : ficha
        );
      }
    );

    setBeneficioToDelete(null); // Close the dialog
  };

  // Open edit modal for a beneficio
  const handleOpenEditBeneficioModal = (beneficio: Beneficio) => {
    setEditingBeneficio(beneficio);
    setIsEditingBeneficio(true);
    // Pre-populate the form with the beneficio data, omitting properties not in the form state
    const { id, codigoPrograma, nombrePrograma, ...formData } = beneficio;
    setNewBeneficioData(formData);
  };

  // Handle editing a beneficio
  const handleEditBeneficio = (updatedBeneficio: Beneficio) => {
    if (!viewingFicha || !viewingPrograma) return;

    const updatedBeneficios = viewingPrograma.beneficios.map((b) =>
      b.id === updatedBeneficio.id ? updatedBeneficio : b
    );

    const updatedViewingPrograma = {
      ...viewingPrograma,
      beneficios: updatedBeneficios,
    };
    setViewingPrograma(updatedViewingPrograma);
    setIsEditingBeneficio(false);
    toast.success("Beneficio actualizado con éxito");
  };

  // --- New Handler: Confirm and Delete Programa ---
  const handleConfirmDeletePrograma = async () => {
    if (!programaToDelete) return;

    // Update the main fichas state
    const deletedPrograma = await deletePrograma(programaToDelete.id);
    if (deletedPrograma === true) {
      setProgramaToDelete(null); // Close the dialog
      toast.success("Programa eliminado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["fichas"] });
    } else if (
      typeof deletedPrograma === "object" &&
      "error" in deletedPrograma
    ) {
      toast.error("Error al eliminar el programa: " + deletedPrograma.error);
    } else {
      toast.error("Error desconocido al eliminar el programa");
    }
    // Invalidate and refetch the fichas query to get updated data
    queryClient.invalidateQueries({ queryKey: ["fichas"] });

    // Update the viewingFicha state if it's the one being modified
    setViewingFicha((prev) => {
      if (prev && prev.id === programaToDelete.fichaId) {
        return {
          ...prev,
          programas: prev.programas?.filter(
            (prog) => prog.codigo !== programaToDelete.programaCodigo
          ),
        };
      }
      return prev;
    });

    setProgramaToDelete(null); // Close the dialog
  };
  // --- End New Handler ---

  // --- End Beneficio Handlers ---

  // Handler to confirm and execute ficha deletion
  const handleConfirmDeleteFicha = async () => {
    if (!fichaToDelete) return;
    // Update the fichas data in the query cache
    const deletedFicha = await deleteFicha(fichaToDelete.id);
    if (deletedFicha === true) {
      setFichaToDelete(null); // Close the dialog
      toast.success("Ficha eliminada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["fichas"] });
    } else if (typeof deletedFicha === "object" && "error" in deletedFicha) {
      toast.error("Error al eliminar la ficha: " + deletedFicha.error);
    } else {
      toast.error("Error desconocido al eliminar la ficha");
    }
  };

  // --- Determine Current View ---
  let currentView;
  if (viewingFicha) {
    if (viewingPrograma) {
      currentView = (
        <div className="w-full space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-[#505050]">
              Beneficios del Programa: {viewingPrograma.nombreComun} (
              {viewingPrograma.codigo})
              <br />
              <span className="text-lg">
                {" "}
                Ficha: {viewingFicha.nombre} ({viewingFicha.ano}){" "}
              </span>
            </h3>
            <button
              onClick={handleBackToProgramas}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Volver a Programas
            </button>
          </div>
          <button
            onClick={() => setIsCreatingBeneficio(true)} // Open create modal
            className="bg-[#1c2851] hover:bg-[#1c2851]/80 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <span>Crear Beneficio</span>
          </button>
          <div className="overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg">
              <thead className="bg-gray-300">
                <tr>
                  {/* Simplified Columns - Add more as needed */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre Corto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cod. Sicoin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {viewingPrograma.beneficios.length > 0 ? (
                  viewingPrograma.beneficios.map((beneficio) => (
                    <tr key={beneficio.id}>
                      {" "}
                      {/* Use the new unique id */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {beneficio.codigo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {beneficio.nombreCorto}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {beneficio.tipo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {beneficio.codigoSicoin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() =>
                            handleOpenEditBeneficioModal(beneficio)
                          }
                          className="text-[#1c2851] hover:text-[#1c2851]/80 mr-4"
                        >
                          Ver/Editar
                        </button>
                        <button
                          onClick={() =>
                            handleOpenDeleteBeneficioModal(beneficio)
                          }
                          className="text-red-600 hover:text-red-800 mr-4"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No hay beneficios registrados para este programa.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else if (isCreatingPrograma) {
      // Changed condition: Show form if creating OR editing
      // --- View: Create/Edit Programa Form ---
      currentView = (
        <form
          onSubmit={handleSubmitPrograma} // Use the combined handler
          className="w-full space-y-6 p-4 border rounded-lg bg-white shadow"
        >
          <h3 className="text-xl font-semibold text-[#505050]">
            {/* Conditional Title checks editingPrograma state */}
            {editingPrograma
              ? `Editando Programa: ${editingPrograma.programaCodigo}` // Use code from editing state
              : `Agregar Programa/Intervención a Ficha: ${viewingFicha.nombre} (${viewingFicha.ano})`}
          </h3>

          {/* Programa Fields (bound to newProgramaData) */}
          {/* ... existing program form fields ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded">
            {/* ... Codigo, CodigoSicoin, Tipo, etc. ... */}
            <div className="flex flex-col gap-1">
              <label htmlFor="codigo" className="text-sm font-medium">
                Código Programa/Intervención
              </label>
              <input
                type="text"
                id="codigo"
                name="codigo"
                value={newProgramaData.codigo}
                onChange={handleProgramaInputChange}
                className="rounded-md border p-2"
                // Make codigo read-only when editing if it shouldn't change
                readOnly={!!editingPrograma}
                disabled={!!editingPrograma}
              />
            </div>
            {/* ... rest of the fields ... */}
            <div className="flex flex-col gap-1">
              <label htmlFor="codigoSicoin" className="text-sm font-medium">
                Código Sicoin
              </label>
              <input
                type="text"
                id="codigoSicoin"
                name="codigoSicoin"
                value={newProgramaData.codigoSicoin}
                onChange={handleProgramaInputChange}
                className="rounded-md border p-2"
                required
              />
            </div>
            {/* ... Tipo ... */}
            <div className="flex flex-col gap-1">
              <label htmlFor="tipo" className="text-sm font-medium">
                Tipo
              </label>
              <select
                id="tipo"
                name="tipo"
                value={newProgramaData.tipo}
                onChange={handleProgramaInputChange}
                className="rounded-md border p-2"
                required
              >
                <option value="programa">Programa</option>
                <option value="intervencion">Intervención</option>
              </select>
            </div>
            {/* ... Nombre Sicoin ... */}
            <div className="flex flex-col gap-1">
              <label htmlFor="nombreSicoin" className="text-sm font-medium">
                Nombre Sicoin
              </label>
              <input
                type="text"
                id="nombreSicoin"
                name="nombreSicoin"
                value={newProgramaData.nombreSicoin}
                onChange={handleProgramaInputChange}
                className="rounded-md border p-2"
                required
              />
            </div>
            {/* ... Nombre Comun ... */}
            <div className="flex flex-col gap-1 col-span-2">
              <label htmlFor="nombreComun" className="text-sm font-medium">
                Nombre Común
              </label>
              <input
                type="text"
                id="nombreComun"
                name="nombreComun"
                value={newProgramaData.nombreComun}
                onChange={handleProgramaInputChange}
                className="rounded-md border p-2"
                required
              />
            </div>
            {/* ... Descripcion ... */}
            <div className="flex flex-col gap-1 col-span-2">
              <label htmlFor="descripcion" className="text-sm font-medium">
                Descripción
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={newProgramaData.descripcion}
                onChange={handleProgramaInputChange}
                className="rounded-md border p-2"
                required
              />
            </div>
            {/* ... Objetivo ... */}
            <div className="flex flex-col gap-1 col-span-2">
              <label htmlFor="objetivo" className="text-sm font-medium">
                Objetivo
              </label>
              <textarea
                id="objetivo"
                name="objetivo"
                value={newProgramaData.objetivo}
                onChange={handleProgramaInputChange}
                className="rounded-md border p-2"
                required
              />
            </div>
            {/* ... Marco Legal ... */}
            <div className="flex flex-col col-span-2 gap-2">
              <label htmlFor="marcoLegal" className="text-sm font-medium">
                Marco Legal
              </label>
              <textarea
                id="marcoLegal"
                name="marcoLegal"
                value={newProgramaData.marcoLegal}
                onChange={handleProgramaInputChange}
                className="rounded-md border p-2"
              />
            </div>
          </div>

          {/* Autoridad Programa Fields */}
          {/* ... existing autoridad fields ... */}
          <div className="space-y-3 border p-4 rounded">
            <h4 className="text-lg font-medium text-gray-700">
              Autoridad del Programa
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="prog-autoridad-nombre"
                  className="text-sm font-medium"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  id="prog-autoridad-nombre"
                  value={newProgramaData.autoridad.nombre}
                  onChange={(e) =>
                    handleProgramaInputChange(e, "autoridad", "nombre")
                  }
                  className="rounded-md border p-2"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="prog-autoridad-cargo"
                  className="text-sm font-medium"
                >
                  Cargo
                </label>
                <input
                  type="text"
                  id="prog-autoridad-cargo"
                  value={newProgramaData.autoridad.cargo}
                  onChange={(e) =>
                    handleProgramaInputChange(e, "autoridad", "cargo")
                  }
                  className="rounded-md border p-2"
                  required
                />
              </div>
            </div>
          </div>

          {/* Funcionario Programa Fields */}
          {/* ... existing funcionario fields ... */}
          <div className="space-y-3 border p-4 rounded">
            <h4 className="text-lg font-medium text-gray-700">
              Funcionario Responsable
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="prog-funcionario-nombre"
                  className="text-sm font-medium"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  id="prog-funcionario-nombre"
                  value={newProgramaData.funcionario.nombre}
                  onChange={(e) =>
                    handleProgramaInputChange(e, "funcionario", "nombre")
                  }
                  className="rounded-md border p-2"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="prog-funcionario-cargo"
                  className="text-sm font-medium"
                >
                  Cargo
                </label>
                <input
                  type="text"
                  id="prog-funcionario-cargo"
                  value={newProgramaData.funcionario.cargo}
                  onChange={(e) =>
                    handleProgramaInputChange(e, "funcionario", "cargo")
                  }
                  className="rounded-md border p-2"
                  required
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsCreatingPrograma(false); // Hide form
                setEditingPrograma(null); // Clear editing state
                // Reset form data
                setNewProgramaData({
                  id: 0,
                  codigo: "",
                  codigoSicoin: "",
                  tipo: "programa",
                  nombreSicoin: "",
                  nombreComun: "",
                  descripcion: "",
                  objetivo: "",
                  marcoLegal: "",
                  autoridad: { nombre: "", cargo: "" },
                  funcionario: { nombre: "", cargo: "" },
                });
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#1c2851] hover:bg-[#1c2851]/80 text-white px-4 py-2 rounded-md"
            >
              {/* Conditional Button Text */}
              {editingPrograma ? "Guardar Cambios" : "Guardar Programa"}
            </button>
          </div>
        </form>
      );
    } else {
      // --- View: Programs Table for selected Ficha ---
      currentView = (
        <div className="w-full space-y-4">
          {/* ... existing code: title, back button, create button ... */}
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-[#505050]">
              Programas/Intervenciones de Ficha: {viewingFicha.nombre} (
              {viewingFicha.ano})
            </h3>
            <button
              onClick={handleBackToFichas} // Go back to Fichas list
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Volver a Fichas
            </button>
          </div>
          <button
            onClick={() => {
              setIsCreatingPrograma(true);
              setEditingPrograma(null); // Ensure not in edit mode when creating new
            }}
            className="bg-[#1c2851] hover:bg-[#1c2851]/80 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <span>Crear Programa/Intervención</span>
          </button>
          <div className="overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg">
              {/* ... table head ... */}
              <thead className="bg-gray-300">
                {/* ... existing th ... */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre Común
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cod. Sicoin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {viewingFicha.programas && viewingFicha.programas.length > 0 ? (
                  viewingFicha.programas.map((programa) => (
                    <tr key={programa.codigo}>
                      {/* ... table cells ... */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {programa.codigo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {programa.nombreComun}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {programa.tipo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {programa.codigoSicoin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {/* Edit Programa button - Updated */}
                        <button
                          onClick={() => handleEditPrograma(programa.codigo)}
                          className="text-blue-600 hover:text-blue-800 mr-4"
                        >
                          Editar Programa
                        </button>
                        {/* View Benefits Button */}
                        <button
                          onClick={() => handleViewBeneficios(programa.codigo)}
                          className="text-[#1c2851] hover:text-[#1c2851]/80 mr-4"
                        >
                          Ver Beneficios ({programa.beneficios.length})
                        </button>
                        {/* Delete Programa button - Opens confirmation */}
                        <button
                          onClick={() =>
                            setProgramaToDelete({
                              id: programa.id,
                              fichaId: viewingFicha.id,
                              programaCodigo: programa.codigo,
                              programaNombre: programa.nombreComun,
                            })
                          }
                          className="text-red-600 hover:text-red-800 mr-4"
                        >
                          Eliminar Programa
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  // ... existing "no programs" row ...
                  <tr>
                    <td
                      colSpan={5} // Adjusted colspan
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No hay programas registrados para esta ficha.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  } else if (isCreatingFicha) {
    // --- View: Create/Edit Ficha Form ---
    currentView = (
      <form
        onSubmit={handleSubmitFicha} // Use the combined handler
        className="w-full space-y-6 p-4 border rounded-lg bg-white shadow"
      >
        {/* Section 1: Datos de la Institución */}
        <div className="space-y-4 p-4 rounded">
          <h3 className="text-lg font-semibold text-[#505050]">
            {/* Change title based on mode */}
            {editingFicha
              ? `Editando Ficha: ${editingFicha.nombre}`
              : "1. Datos de la Institución"}
          </h3>
          {/* ... rest of the institucion fields bound to newFichaCabecera ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 col-span-2">
              <label htmlFor="institucion" className="text-sm font-medium">
                Institución
              </label>
              <input
                type="text"
                id="institucion"
                name="institucion"
                value={newFichaCabecera.institucion}
                onChange={(e) => handleInputChange(e, "institucion")}
                className="rounded-md border p-2"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="siglas" className="text-sm font-medium">
                Siglas
              </label>
              <input
                type="text"
                id="siglas"
                name="siglas"
                value={newFichaCabecera.siglas}
                onChange={(e) => handleInputChange(e, "siglas")}
                className="rounded-md border p-2"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="nombreCorto" className="text-sm font-medium">
                Nombre Corto
              </label>
              <input
                type="text"
                id="nombreCorto"
                name="nombreCorto"
                value={newFichaCabecera.nombreCorto}
                onChange={(e) => handleInputChange(e, "nombreCorto")}
                className="rounded-md border p-2"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Delegados */}
        <div className="space-y-4 p-4 rounded">
          <h3 className="text-lg font-semibold text-[#505050]">
            2. Delegados Institucionales
          </h3>
          {newFichaCabecera.delegados.map((delegado, index) => (
            <div key={index} className="space-y-3 p-3 border rounded mt-2">
              <h4 className="text-md font-medium text-gray-700">
                Delegado {index + 1}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ... Name ... */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={`delegado-nombre-${index}`}
                    className="text-sm font-medium"
                  >
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    id={`delegado-nombre-${index}`}
                    value={delegado.nombre}
                    onChange={(e) =>
                      handleInputChange(e, "delegado", index, "nombre")
                    }
                    className="rounded-md border p-2"
                    required
                  />
                </div>
                {/* ... Telefono ... */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={`delegado-telefono-${index}`}
                    className="text-sm font-medium"
                  >
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id={`delegado-telefono-${index}`}
                    value={delegado.telefono}
                    onChange={(e) =>
                      handleInputChange(e, "delegado", index, "telefono")
                    }
                    className="rounded-md border p-2"
                    required
                  />
                </div>
                {/* ... Rol ... */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={`delegado-rol-${index}`}
                    className="text-sm font-medium"
                  >
                    Rol
                  </label>
                  <input
                    type="text"
                    id={`delegado-rol-${index}`}
                    value={delegado.rol}
                    onChange={(e) =>
                      handleInputChange(e, "delegado", index, "rol")
                    }
                    className="rounded-md border p-2"
                    required
                  />
                </div>
                {/* ... Correo ... */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={`delegado-correo-${index}`}
                    className="text-sm font-medium"
                  >
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id={`delegado-correo-${index}`}
                    value={delegado.correo}
                    onChange={(e) =>
                      handleInputChange(e, "delegado", index, "correo")
                    }
                    className="rounded-md border p-2"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
          {/* Add Delegado Button */}
          {newFichaCabecera.delegados.length < 3 && (
            <button
              type="button"
              onClick={handleAddDelegado}
              className="mt-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
            >
              Agregar Delegado ({newFichaCabecera.delegados.length}/3)
            </button>
          )}
        </div>

        {/* Section 3: Autoridad Responsable */}
        <div className="space-y-4 p-4 rounded">
          <h3 className="text-lg font-semibold text-[#505050]">
            3. Autoridad Responsable
          </h3>
          {/* ... rest of the autoridad fields bound to newFichaCabecera ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="autoridad-nombre" className="text-sm font-medium">
                Nombre Completo
              </label>
              <input
                type="text"
                id="autoridad-nombre"
                value={newFichaCabecera.autoridad.nombre}
                onChange={(e) =>
                  handleInputChange(e, "autoridad", undefined, "nombre")
                }
                className="rounded-md border p-2"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="autoridad-cargo" className="text-sm font-medium">
                Cargo
              </label>
              <input
                type="text"
                id="autoridad-cargo"
                value={newFichaCabecera.autoridad.cargo}
                onChange={(e) =>
                  handleInputChange(e, "autoridad", undefined, "cargo")
                }
                className="rounded-md border p-2"
                required
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => {
              setIsCreatingFicha(false); // Go back to Fichas list
              setEditingFicha(null); // Clear editing state
              setNewFichaCabecera(initialFichaCabecera); // Reset form fields
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-[#1c2851] hover:bg-[#1c2851]/80 text-white px-4 py-2 rounded-md"
          >
            {/* Change button text based on mode */}
            {editingFicha ? "Guardar Cambios" : "Confirmar y Guardar Ficha"}
          </button>
        </div>
      </form>
    );
  } else {
    // --- View: Main Fichas Table ---
    currentView = (
      <>
        <div className="flex justify-between items-center w-full">
          <h2 className="text-2xl font-bold text-[#505050]">
            Registro de Fichas de Intervención
          </h2>
          <button
            className="bg-[#1c2851] hover:bg-[#1c2851]/80 text-white px-4 py-2 rounded-md flex items-center gap-2"
            onClick={() => setIsCreatingFicha(true)} // Set state to true to show ficha form
          >
            <span>Generar nueva ficha</span>
          </button>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-gray-200">
            {/* ... table head ... */}
            <thead className="bg-gray-300">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ficha (Nombre/Siglas)
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Año
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Estado
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fichas &&
                !("error" in fichas) &&
                fichas.map((ficha) => (
                  <tr key={ficha.id}>
                    {/* ... table cells ... */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ficha.nombre}{" "}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ficha.ano}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ficha.estado}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {/* Edit Ficha Button */}
                      <button
                        onClick={() => handleEditFicha(ficha.id)} // Call edit handler
                        className="text-blue-600 hover:text-blue-800 mr-4"
                      >
                        Editar Ficha
                      </button>
                      {/* View Programs Button */}
                      <button
                        onClick={() => handleViewPrograms(ficha.id)} // Call new handler
                        className="text-[#1c2851] hover:text-[#1c2851]/80 mr-4"
                      >
                        Ver Programas ({ficha.programas?.length || 0})
                      </button>
                      {/* Delete Ficha Button */}
                      <button
                        onClick={() => {
                          // Cast to component Ficha type with guaranteed non-undefined properties
                          const normalizedFicha = {
                            ...ficha,
                            cabecera: ficha.cabecera || initialFichaCabecera,
                            programas: (ficha.programas || []).map((prog) => ({
                              ...prog,
                              beneficios: prog.beneficios || [],
                            })),
                          } as Ficha;

                          setFichaToDelete(normalizedFicha);
                        }}
                        className="text-red-600 hover:text-red-800 mr-4"
                      >
                        Eliminar Ficha
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }
  // --- End Determine Current View ---

  return (
    <div className="w-full h-full flex flex-col justify-start items-center gap-4">
      {/* Render the determined view */}
      {currentView}

      {/* --- Modals/Dialogs --- */}

      {/* Create Beneficio Modal */}
      <Dialog
        open={isCreatingBeneficio || isEditingBeneficio}
        onOpenChange={setIsCreatingBeneficio}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Crear Nuevo Beneficio para {viewingPrograma?.nombreComun}
            </DialogTitle>
            <DialogDescription>
              Complete los campos para registrar un nuevo beneficio o
              subproducto.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isCreatingBeneficio) {
                handleAddBeneficio(e);
              } else if (isEditingBeneficio) {
                const updatedBeneficio = {
                  ...newBeneficioData,
                  id: editingBeneficio?.id || "",
                  codigoPrograma: editingBeneficio?.codigoPrograma || "",
                  nombrePrograma: editingBeneficio?.nombrePrograma || "",
                };
                handleEditBeneficio(updatedBeneficio);
              }
            }}
            className="space-y-4"
          >
            {/* Simplified Form Fields - Add more based on Beneficio interface */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Codigo */}
              <div className="flex flex-col gap-1">
                <label htmlFor="benef-codigo" className="text-sm font-medium">
                  Código Beneficio
                </label>
                <input
                  type="text"
                  id="benef-codigo"
                  name="codigo"
                  value={newBeneficioData.codigo}
                  onChange={handleBeneficioInputChange}
                  className="rounded-md border p-2"
                  required
                />
              </div>
              {/* Codigo Sicoin */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="benef-codigoSicoin"
                  className="text-sm font-medium"
                >
                  Código Sicoin
                </label>
                <input
                  type="text"
                  id="benef-codigoSicoin"
                  name="codigoSicoin"
                  value={newBeneficioData.codigoSicoin}
                  onChange={handleBeneficioInputChange}
                  className="rounded-md border p-2"
                />
              </div>
              {/* Nombre Subproducto */}
              <div className="flex flex-col gap-1 col-span-2">
                <label
                  htmlFor="benef-nombreSubproducto"
                  className="text-sm font-medium"
                >
                  Nombre Subproducto
                </label>
                <input
                  type="text"
                  id="benef-nombreSubproducto"
                  name="nombreSubproducto"
                  value={newBeneficioData.nombreSubproducto}
                  onChange={handleBeneficioInputChange}
                  className="rounded-md border p-2"
                  required
                />
              </div>
              {/* Nombre Corto */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="benef-nombreCorto"
                  className="text-sm font-medium"
                >
                  Nombre Corto
                </label>
                <input
                  type="text"
                  id="benef-nombreCorto"
                  name="nombreCorto"
                  value={newBeneficioData.nombreCorto}
                  onChange={handleBeneficioInputChange}
                  className="rounded-md border p-2"
                  required
                />
              </div>
              {/* Nombre (Beneficio) */}
              <div className="flex flex-col gap-1">
                <label htmlFor="benef-nombre" className="text-sm font-medium">
                  Nombre Beneficio
                </label>
                <input
                  type="text"
                  id="benef-nombre"
                  name="nombre"
                  value={newBeneficioData.nombre}
                  onChange={handleBeneficioInputChange}
                  className="rounded-md border p-2"
                  required
                />
              </div>
              {/* Descripcion */}
              <div className="flex flex-col gap-1 col-span-2">
                <label
                  htmlFor="benef-descripcion"
                  className="text-sm font-medium"
                >
                  Descripción
                </label>
                <textarea
                  id="benef-descripcion"
                  name="descripcion"
                  value={newBeneficioData.descripcion}
                  onChange={handleBeneficioInputChange}
                  className="rounded-md border p-2"
                  required
                />
              </div>
              {/* Objetivo */}
              <div className="flex flex-col gap-1 col-span-2">
                <label htmlFor="benef-objetivo" className="text-sm font-medium">
                  Objetivo
                </label>
                <textarea
                  id="benef-objetivo"
                  name="objetivo"
                  value={newBeneficioData.objetivo}
                  onChange={handleBeneficioInputChange}
                  className="rounded-md border p-2"
                  required
                />
              </div>
              {/* Tipo */}
              <div className="flex flex-col gap-1">
                <label htmlFor="benef-tipo" className="text-sm font-medium">
                  Tipo
                </label>
                <select
                  id="benef-tipo"
                  name="tipo"
                  value={newBeneficioData.tipo}
                  onChange={handleBeneficioInputChange}
                  className="rounded-md border p-2"
                  required
                >
                  <option value="individual">Individual</option>
                  <option value="familiar">Familiar</option>
                  <option value="comunitario">Comunitario</option>
                  <option value="actores sociales">Actores Sociales</option>
                </select>
              </div>
              {/* Criterios Inclusion */}
              <div className="flex flex-col gap-1 col-span-2">
                <label
                  htmlFor="benef-criteriosInclusion"
                  className="text-sm font-medium"
                >
                  Criterios de Inclusión
                </label>
                <textarea
                  id="benef-criteriosInclusion"
                  name="criteriosInclusion"
                  value={newBeneficioData.criteriosInclusion}
                  onChange={handleBeneficioInputChange}
                  className="rounded-md border p-2"
                />
              </div>
              {/* Atencion Social */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="benef-atencionSocial"
                  className="text-sm font-medium"
                >
                  Atención Social
                </label>
                <select
                  id="benef-atencionSocial"
                  name="atencionSocial"
                  value={newBeneficioData.atencionSocial}
                  onChange={handleBeneficioInputChange}
                  className="rounded-md border p-2"
                >
                  <option value="protección">Protección</option>
                  <option value="asistencia">Asistencia</option>
                  <option value="promoción">Promoción</option>
                </select>
              </div>
              {/* Rango Edad */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="benef-rangoEdad"
                  className="text-sm font-medium"
                >
                  Rango Edad
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="benef-rangoEdad-primeraInfancia"
                      name="rangoEdad"
                      value="Primera infancia"
                      checked={
                        newBeneficioData.rangoEdad === "Primera infancia"
                      }
                      onChange={handleBeneficioInputChange}
                      className="rounded border"
                    />
                    <label
                      htmlFor="benef-rangoEdad-primeraInfancia"
                      className="text-sm"
                    >
                      Primera infancia
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="benef-rangoEdad-infancia"
                      name="rangoEdad"
                      value="Infancia"
                      checked={newBeneficioData.rangoEdad === "Infancia"}
                      onChange={handleBeneficioInputChange}
                      className="rounded border"
                    />
                    <label
                      htmlFor="benef-rangoEdad-infancia"
                      className="text-sm"
                    >
                      Infancia
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="benef-rangoEdad-adolescencia"
                      name="rangoEdad"
                      value="Adolescencia"
                      checked={newBeneficioData.rangoEdad === "Adolescencia"}
                      onChange={handleBeneficioInputChange}
                      className="rounded border"
                    />
                    <label
                      htmlFor="benef-rangoEdad-adolescencia"
                      className="text-sm"
                    >
                      Adolescencia
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="benef-rangoEdad-juventud"
                      name="rangoEdad"
                      value="Juventud"
                      checked={newBeneficioData.rangoEdad === "Juventud"}
                      onChange={handleBeneficioInputChange}
                      className="rounded border"
                    />
                    <label
                      htmlFor="benef-rangoEdad-juventud"
                      className="text-sm"
                    >
                      Juventud
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="benef-rangoEdad-adultos"
                      name="rangoEdad"
                      value="Adultos"
                      checked={newBeneficioData.rangoEdad === "Adultos"}
                      onChange={handleBeneficioInputChange}
                      className="rounded border"
                    />
                    <label
                      htmlFor="benef-rangoEdad-adultos"
                      className="text-sm"
                    >
                      Adultos
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="benef-rangoEdad-adultosMayores"
                      name="rangoEdad"
                      value="Adultos mayores"
                      checked={newBeneficioData.rangoEdad === "Adultos mayores"}
                      onChange={handleBeneficioInputChange}
                      className="rounded border"
                    />
                    <label
                      htmlFor="benef-rangoEdad-adultosMayores"
                      className="text-sm"
                    >
                      Adultos mayores
                    </label>
                  </div>
                </div>
              </div>
              {/* Poblacion Objetivo */}
              <div className="flex flex-col gap-1 col-span-2">
                <label
                  htmlFor="benef-poblacionObjetivo"
                  className="text-sm font-medium"
                >
                  Población Objetivo
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-md">
                  {isLoadingPoblacionObjetivoElementos ? (
                    <div className="col-span-2 p-3 text-center">
                      Cargando opciones...
                    </div>
                  ) : typeof poblacionObjetivoElementos === "object" &&
                    "error" in poblacionObjetivoElementos ? (
                    <div className="col-span-2 p-3 text-center text-red-500">
                      Error al cargar opciones
                    </div>
                  ) : (
                    // Group elements by category and render them
                    (() => {
                      // Group elements by category
                      const groupedElements = (
                        poblacionObjetivoElementos || []
                      ).reduce((acc, elem) => {
                        if (!acc[elem.categoria]) {
                          acc[elem.categoria] = [];
                        }
                        acc[elem.categoria]!.push(elem); // Add non-null assertion operator
                        return acc;
                      }, {} as Record<string, typeof poblacionObjetivoElementos>);

                      // Convert object keys to array for mapping
                      return Object.entries(groupedElements).map(
                        ([categoria, elementos]) => (
                          <div key={categoria} className="p-3">
                            <h5 className="font-medium text-sm mb-2">
                              {categoria}
                            </h5>
                            <div className="space-y-2">
                              {elementos &&
                                elementos.map((elemento) => {
                                  // Generate field name based on categoria and criterio
                                  // Convert to camelCase for the field name
                                  const fieldName = `poblacionObjetivo.${categoria}.${elemento.criterio.replace(
                                    /\s+/g,
                                    ""
                                  )}`;
                                  console.log(
                                    "newBeneficioData.poblacionObjetivo",
                                    newBeneficioData.poblacionObjetivo
                                  );
                                  return (
                                    <div
                                      key={elemento.id}
                                      className="flex items-center gap-2"
                                    >
                                      <input
                                        type="checkbox"
                                        id={`benef-pobObj-${elemento.id}`}
                                        name={fieldName}
                                        checked={
                                          // Tipo safe access with proper casting
                                          (
                                            newBeneficioData
                                              .poblacionObjetivo?.[
                                              categoria as keyof typeof newBeneficioData.poblacionObjetivo
                                            ] as Record<string, boolean>
                                          )?.[
                                            elemento.criterio.replace(
                                              /\s+/g,
                                              ""
                                            )
                                          ] || false
                                        }
                                        onChange={handleBeneficioInputChange}
                                        className="rounded border"
                                      />
                                      <label
                                        htmlFor={`benef-pobObj-${elemento.id}`}
                                        className="text-sm"
                                      >
                                        {elemento.criterio}
                                      </label>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        )
                      );
                    })()
                  )}
                </div>
              </div>

              {/* Finalidad */}
              <div className="flex flex-col gap-1 col-span-2">
                <label
                  htmlFor="benef-finalidad"
                  className="text-sm font-medium"
                >
                  Finalidad
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-md p-3">
                  {isLoadingFinalidadElementos ? (
                    <div className="col-span-2 text-center">
                      Cargando opciones...
                    </div>
                  ) : typeof finalidadElementos === "object" &&
                    "error" in finalidadElementos ? (
                    <div className="col-span-2 text-center text-red-500">
                      Error al cargar opciones
                    </div>
                  ) : (
                    (finalidadElementos || []).map((elemento) => {
                      const fieldName = `finalidad.${elemento.criterio.replace(
                        /\s+/g,
                        ""
                      )}`;
                      return (
                        <div
                          key={elemento.id}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            id={`benef-finalidad-${elemento.id}`}
                            name={fieldName}
                            checked={
                              // Type-safe access using a more general approach
                              (newBeneficioData.finalidad &&
                                (
                                  newBeneficioData.finalidad as Record<
                                    string,
                                    boolean
                                  >
                                )[elemento.criterio.replace(/\s+/g, "")]) ||
                              false
                            }
                            onChange={handleBeneficioInputChange}
                            className="rounded border"
                          />
                          <label
                            htmlFor={`benef-finalidad-${elemento.id}`}
                            className="text-sm"
                          >
                            {elemento.criterio}
                          </label>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Clasificador Temático */}
              <div className="flex flex-col gap-1 col-span-2">
                <label
                  htmlFor="benef-clasificadorTematico"
                  className="text-sm font-medium"
                >
                  Clasificador Temático
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-md p-3">
                  {isLoadingClasificadorTematicoElementos ? (
                    <div className="col-span-2 text-center">
                      Cargando opciones...
                    </div>
                  ) : typeof clasificadorTematicoElementos === "object" &&
                    "error" in clasificadorTematicoElementos ? (
                    <div className="col-span-2 text-center text-red-500">
                      Error al cargar opciones
                    </div>
                  ) : (
                    (clasificadorTematicoElementos || []).map((elemento) => {
                      const fieldName = `clasificadorTematico.${elemento.criterio.replace(
                        /\s+/g,
                        ""
                      )}`;
                      return (
                        <div
                          key={elemento.id}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            id={`benef-clasificadorTematico-${elemento.id}`}
                            name={fieldName}
                            checked={
                              (newBeneficioData.clasificadorTematico &&
                                (
                                  newBeneficioData.clasificadorTematico as Record<
                                    string,
                                    boolean
                                  >
                                )[elemento.criterio.replace(/\s+/g, "")]) ||
                              false
                            }
                            onChange={handleBeneficioInputChange}
                            className="rounded border"
                          />
                          <label
                            htmlFor={`benef-clasificadorTematico-${elemento.id}`}
                            className="text-sm"
                          >
                            {elemento.criterio}
                          </label>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Objeto */}
              <div className="flex flex-col gap-1 col-span-2">
                <label htmlFor="benef-objeto" className="text-sm font-medium">
                  Objeto
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-md p-3">
                  {isLoadingObjetoElementos ? (
                    <div className="col-span-2 text-center">
                      Cargando opciones...
                    </div>
                  ) : typeof objetoElementos === "object" &&
                    "error" in objetoElementos ? (
                    <div className="col-span-2 text-center text-red-500">
                      Error al cargar opciones
                    </div>
                  ) : (
                    (objetoElementos || []).map((elemento) => {
                      const fieldName = `objeto.${elemento.criterio.replace(
                        /\s+/g,
                        ""
                      )}`;
                      return (
                        <div
                          key={elemento.id}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            id={`benef-objeto-${elemento.id}`}
                            name={fieldName}
                            checked={
                              (newBeneficioData.objeto &&
                                (
                                  newBeneficioData.objeto as Record<
                                    string,
                                    boolean
                                  >
                                )[elemento.criterio.replace(/\s+/g, "")]) ||
                              false
                            }
                            onChange={handleBeneficioInputChange}
                            className="rounded border"
                          />
                          <label
                            htmlFor={`benef-objeto-${elemento.id}`}
                            className="text-sm"
                          >
                            {elemento.criterio}
                          </label>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Forma */}
              <div className="flex flex-col gap-1 col-span-2">
                <label htmlFor="benef-forma" className="text-sm font-medium">
                  Forma
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-md p-3">
                  {isLoadingFormaElementos ? (
                    <div className="col-span-2 text-center">
                      Cargando opciones...
                    </div>
                  ) : typeof formaElementos === "object" &&
                    "error" in formaElementos ? (
                    <div className="col-span-2 text-center text-red-500">
                      Error al cargar opciones
                    </div>
                  ) : (
                    (formaElementos || []).map((elemento) => {
                      const fieldName = `forma.${elemento.criterio.replace(
                        /\s+/g,
                        ""
                      )}`;
                      return (
                        <div
                          key={elemento.id}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            id={`benef-forma-${elemento.id}`}
                            name={fieldName}
                            checked={
                              (newBeneficioData.forma &&
                                (
                                  newBeneficioData.forma as Record<
                                    string,
                                    boolean
                                  >
                                )[elemento.criterio.replace(/\s+/g, "")]) ||
                              false
                            }
                            onChange={handleBeneficioInputChange}
                            className="rounded border"
                          />
                          <label
                            htmlFor={`benef-forma-${elemento.id}`}
                            className="text-sm"
                          >
                            {elemento.criterio}
                          </label>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Focalización */}
              <div className="flex flex-col gap-1 col-span-2">
                <label
                  htmlFor="benef-focalizacion"
                  className="text-sm font-medium"
                >
                  Focalización
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-md">
                  {isLoadingFocalizacionElementos ? (
                    <div className="col-span-2 p-3 text-center">
                      Cargando opciones...
                    </div>
                  ) : typeof focalizacionElementos === "object" &&
                    "error" in focalizacionElementos ? (
                    <div className="col-span-2 p-3 text-center text-red-500">
                      Error al cargar opciones
                    </div>
                  ) : (
                    (() => {
                      // Group elements by subcategory (like we did for PoblacionObjetivo)
                      const groupedElements = (
                        focalizacionElementos || []
                      ).reduce((acc, elem) => {
                        if (!acc[elem.subcategoria]) {
                          acc[elem.subcategoria] = [];
                        }
                        acc[elem.subcategoria]!.push(elem); // Add non-null assertion operator
                        return acc;
                      }, {} as Record<string, typeof focalizacionElementos>);
                      // Convert object keys to array for mapping
                      return Object.entries(groupedElements).map(
                        ([subcategoria, elementos]) => {
                          if (!elementos) return null; // Satisfy TypeScript
                          return (
                            <div key={subcategoria} className="p-3">
                              <h5 className="font-medium text-sm mb-2">
                                {subcategoria}
                              </h5>
                              <div className="space-y-2">
                                {elementos.map((elemento) => {
                                  const fieldName = `focalizacion.${subcategoria}.${elemento.criterio.replace(
                                    /\s+/g,
                                    ""
                                  )}`;
                                  return (
                                    <div
                                      key={elemento.id}
                                      className="flex items-center gap-2"
                                    >
                                      <input
                                        type="checkbox"
                                        id={`benef-focalizacion-${elemento.id}`}
                                        name={fieldName}
                                        checked={
                                          // Tipo safe access (might require casting)
                                          (
                                            newBeneficioData.focalizacion?.[
                                              subcategoria as keyof typeof newBeneficioData.focalizacion
                                            ] as Record<string, boolean>
                                          )?.[
                                            elemento.criterio.replace(
                                              /\s+/g,
                                              ""
                                            )
                                          ] || false
                                        }
                                        onChange={handleBeneficioInputChange}
                                        className="rounded border"
                                      />
                                      <label
                                        htmlFor={`benef-focalizacion-${elemento.id}`}
                                        className="text-sm"
                                      >
                                        {elemento.criterio}
                                      </label>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        }
                      );
                    })()
                  )}
                </div>
              </div>
              {/* Funcionario Focal */}
              <div className="col-span-2 border-t pt-4 mt-4">
                <h4 className="text-md font-medium text-gray-700 mb-2">
                  Funcionario Focal del Beneficio
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="benef-focal-nombre"
                      className="text-sm font-medium"
                    >
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="benef-focal-nombre"
                      name="funcionarioFocal.nombre"
                      value={newBeneficioData.funcionarioFocal.nombre}
                      onChange={handleBeneficioInputChange}
                      className="rounded-md border p-2"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="benef-focal-cargo"
                      className="text-sm font-medium"
                    >
                      Cargo
                    </label>
                    <input
                      type="text"
                      id="benef-focal-cargo"
                      name="funcionarioFocal.cargo"
                      value={newBeneficioData.funcionarioFocal.cargo}
                      onChange={handleBeneficioInputChange}
                      className="rounded-md border p-2"
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => {
                  setIsCreatingBeneficio(false);
                  setIsEditingBeneficio(false);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-[#1c2851] text-white px-4 py-2 rounded-md"
              >
                {isEditingBeneficio
                  ? "Actualizar Beneficio"
                  : "Guardar Beneficio"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Beneficio Confirmation Dialog */}
      <Dialog
        open={!!beneficioToDelete}
        onOpenChange={() => setBeneficioToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar el beneficio "
              {beneficioToDelete?.nombreCorto}" ({beneficioToDelete?.codigo})?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setBeneficioToDelete(null)}
              className="px-4 py-2 rounded-md mr-2 border"
            >
              Cancelar
            </button>
            <button
              onClick={handleDeleteBeneficio}
              className="bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Eliminar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Programa Confirmation Dialog */}
      <Dialog
        open={!!programaToDelete}
        onOpenChange={() => setProgramaToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación de Programa</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar el programa "
              {programaToDelete?.programaNombre}" (
              {programaToDelete?.programaCodigo}) de la ficha{" "}
              {viewingFicha?.nombre}? <br />
              Esta acción eliminará también todos sus beneficios asociados y no
              se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setProgramaToDelete(null)}
              className="px-4 py-2 rounded-md mr-2 border"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmDeletePrograma} // Call the new delete handler
              className="bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Eliminar Programa
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Ficha Confirmation Dialog */}
      <Dialog
        open={!!fichaToDelete}
        onOpenChange={() => setFichaToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación de Ficha</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar la ficha "{fichaToDelete?.nombre}"
              ? Esta acción eliminará también todos sus programas y beneficios
              asociados. Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setFichaToDelete(null)}
              className="px-4 py-2 rounded-md mr-2 border"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmDeleteFicha}
              className="bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Eliminar Ficha Permanentemente
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const EntregasSection = () => {
  // Mock user data (would come from auth context in a real app)
  const mockUserData = {
    institution: "Ministerio de Desarrollo Social",
    acronym: "MIDES",
  };

  // Form state
  const [institution, setInstitution] = useState(mockUserData.institution);
  const [acronym, setAcronym] = useState(mockUserData.acronym);
  const [searchCui, setSearchCui] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchGender, setSearchGender] = useState("");

  // Beneficiary data state
  const [cui, setCui] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [thirdName, setThirdName] = useState("");
  const [firstLastName, setFirstLastName] = useState("");
  const [secondLastName, setSecondLastName] = useState("");
  const [thirdLastName, setThirdLastName] = useState("");
  const [birthDepartment, setBirthDepartment] = useState("");
  const [birthMunicipality, setBirthMunicipality] = useState("");
  const [puebloOrigin, setPuebloOrigin] = useState("");
  const [linguisticCommunity, setLinguisticCommunity] = useState("");
  const [language, setLanguage] = useState("");
  const [rshHomeId, setRshHomeId] = useState("");
  const [residenceDepartment, setResidenceDepartment] = useState("");
  const [residenceMunicipality, setResidenceMunicipality] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [residencePopulatedPlace, setResidencePopulatedPlace] = useState("");
  const [residenceAddress, setResidenceAddress] = useState("");
  const [schoolLevel, setSchoolLevel] = useState("");
  const [disability, setDisability] = useState("");
  const [works, setWorks] = useState("");

  // Benefit data state
  const [program, setProgram] = useState("");
  const [benefit, setBenefit] = useState("");
  const [deliveryDepartment, setDeliveryDepartment] = useState("");
  const [deliveryMunicipality, setDeliveryMunicipality] = useState("");
  const [deliveryPopulatedPlace, setDeliveryPopulatedPlace] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryQuantity, setDeliveryQuantity] = useState("");
  const [deliveryValue, setDeliveryValue] = useState("");

  // Confirmation data (auto-filled from beneficiary data)
  const [confirmationCui, setConfirmationCui] = useState("");
  const [confirmationName, setConfirmationName] = useState("");
  const [confirmationGender, setConfirmationGender] = useState("");

  // Mock beneficiary database
  const mockBeneficiaries = [
    {
      cui: "1234567890123",
      gender: "Masculino",
      birthDate: "1990-05-15",
      firstName: "Juan",
      secondName: "Carlos",
      thirdName: "",
      firstLastName: "Hernández",
      secondLastName: "López",
      thirdLastName: "",
      birthDepartment: "Guatemala",
      birthMunicipality: "Guatemala City",
      puebloOrigin: "Pueblo Maya",
      linguisticCommunity: "Pueblo Maya",
      language: "Español",
      rshHomeId: ["1", "2"],
      residenceDepartment: "Guatemala",
      residenceMunicipality: "Guatemala City",
      cellphone: "55123456",
      residencePopulatedPlace: "Zona 1",
      residenceAddress: "Calle 5, Avenida 6-23",
      schoolLevel: "Secundaria",
      disability: "No",
      works: "Sí",
    },
    {
      cui: "9876543210123",
      gender: "Femenino",
      birthDate: "1985-08-22",
      firstName: "María",
      secondName: "Elena",
      thirdName: "",
      firstLastName: "García",
      secondLastName: "Ramírez",
      thirdLastName: "",
      birthDepartment: "Quetzaltenango",
      birthMunicipality: "Quetzaltenango",
      puebloOrigin: "Pueblo Q'eqchi",
      linguisticCommunity: "Pueblo KekChi",
      language: "Español",
      rshHomeId: ["2"],
      residenceDepartment: "Quetzaltenango",
      residenceMunicipality: "Quetzaltenango",
      cellphone: "42789123",
      residencePopulatedPlace: "Zona 3",
      residenceAddress: "4ta Calle, 2-45",
      schoolLevel: "Primaria",
      disability: "No",
      works: "No",
    },
  ];

  // Function to look up beneficiary by CUI
  const lookupBeneficiary = () => {
    const beneficiary = mockBeneficiaries.find((b) => b.cui === searchCui);

    if (beneficiary) {
      // Fill beneficiary data
      setCui(beneficiary.cui);
      setGender(beneficiary.gender);
      setBirthDate(beneficiary.birthDate);
      setFirstName(beneficiary.firstName);
      setSecondName(beneficiary.secondName);
      setThirdName(beneficiary.thirdName);
      setFirstLastName(beneficiary.firstLastName);
      setSecondLastName(beneficiary.secondLastName);
      setThirdLastName(beneficiary.thirdLastName);
      setBirthDepartment(beneficiary.birthDepartment);
      setBirthMunicipality(beneficiary.birthMunicipality);
      setPuebloOrigin(beneficiary.puebloOrigin);
      setLinguisticCommunity(beneficiary.linguisticCommunity);
      setLanguage(beneficiary.language);
      setRshHomeId(beneficiary.rshHomeId[0]);
      setResidenceDepartment(beneficiary.residenceDepartment);
      setResidenceMunicipality(beneficiary.residenceMunicipality);
      setCellphone(beneficiary.cellphone);
      setResidencePopulatedPlace(beneficiary.residencePopulatedPlace);
      setResidenceAddress(beneficiary.residenceAddress);
      setSchoolLevel(beneficiary.schoolLevel);
      setDisability(beneficiary.disability);
      setWorks(beneficiary.works);

      // Update search fields
      setSearchName(`${beneficiary.firstName} ${beneficiary.firstLastName}`);
      setSearchGender(beneficiary.gender);

      // Update confirmation section
      updateConfirmationData(
        beneficiary.cui,
        beneficiary.firstName,
        beneficiary.secondName,
        beneficiary.thirdName,
        beneficiary.firstLastName,
        beneficiary.secondLastName,
        beneficiary.gender
      );
    } else {
      // Show error notification or message
      alert("Beneficiario no encontrado. Por favor verifique el CUI.");
    }
  };

  // Function to update confirmation data
  const updateConfirmationData = (
    cuiValue: string,
    firstNameValue: string,
    secondNameValue: string,
    thirdNameValue: string,
    firstLastNameValue: string,
    secondLastNameValue: string,
    genderValue: string
  ) => {
    setConfirmationCui(cuiValue);
    setConfirmationName(
      `${firstNameValue} ${secondNameValue ? secondNameValue + " " : ""}${
        thirdNameValue ? thirdNameValue + " " : ""
      }${firstLastNameValue} ${secondLastNameValue ? secondLastNameValue : ""}`
    );
    setConfirmationGender(genderValue);
  };

  // Reset all form data
  const resetForm = () => {
    // Keep institution data
    setSearchCui("");
    setSearchName("");
    setSearchGender("");
    setCui("");
    setGender("");
    setBirthDate("");
    setFirstName("");
    setSecondName("");
    setThirdName("");
    setFirstLastName("");
    setSecondLastName("");
    setThirdLastName("");
    setBirthDepartment("");
    setBirthMunicipality("");
    setPuebloOrigin("");
    setLinguisticCommunity("");
    setLanguage("");
    setRshHomeId("");
    setResidenceDepartment("");
    setResidenceMunicipality("");
    setCellphone("");
    setResidencePopulatedPlace("");
    setResidenceAddress("");
    setSchoolLevel("");
    setDisability("");
    setWorks("");
    setProgram("");
    setBenefit("");
    setDeliveryDepartment("");
    setDeliveryMunicipality("");
    setDeliveryPopulatedPlace("");
    setDeliveryDate("");
    setDeliveryQuantity("");
    setDeliveryValue("");
    setConfirmationCui("");
    setConfirmationName("");
    setConfirmationGender("");
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form
    if (!cui || !program || !benefit || !deliveryDate) {
      alert("Por favor complete todos los campos requeridos.");
      return;
    }

    // Submit data (in a real app, this would be an API call)
    alert("Entrega registrada con éxito");
    resetForm();
  };

  return (
    <div className="w-full px-16 h-full flex flex-col justify-center items-center gap-4">
      <h2 className="text-lg text-[#505050] font-bold">
        Digitación de Entregas
      </h2>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2 flex flex-col gap-2">
            <label htmlFor="institution" className="text-sm font-medium">
              Institución
            </label>
            <input
              type="text"
              id="institution"
              className="rounded-md border p-2 bg-gray-100"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              readOnly
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="acronym" className="text-sm font-medium">
              Siglas
            </label>
            <input
              type="text"
              id="acronym"
              className="rounded-md border p-2 bg-gray-100"
              value={acronym}
              onChange={(e) => setAcronym(e.target.value)}
              readOnly
            />
          </div>
        </div>
        <h3 className="text-lg text-[#505050] font-bold self-start mt-6">
          Beneficiario
        </h3>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="cui" className="text-sm font-medium">
              CUI
            </label>
            <input
              type="text"
              id="cui"
              className="rounded-md border p-2"
              value={searchCui}
              onChange={(e) => setSearchCui(e.target.value)}
              placeholder="Ingrese el CUI para buscar"
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nombres y Apellidos
            </label>
            <input
              type="text"
              id="name"
              className="rounded-md border p-2 bg-gray-100"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              readOnly
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="gender" className="text-sm font-medium">
              Sexo *
            </label>
            <div className="flex items-center gap-2">
              <div className="w-3/4">
                <Combobox
                  options={[
                    { label: "Masculino", value: "Masculino" },
                    { label: "Femenino", value: "Femenino" },
                  ]}
                  onChange={(value) => setSearchGender(value)}
                  value={searchGender}
                  width="full"
                />
              </div>
              <div className="w-1/4">
                <Button
                  variant="outline"
                  className="rounded-md border w-full"
                  onClick={(e) => {
                    e.preventDefault();
                    lookupBeneficiary();
                  }}
                >
                  Confirmar
                </Button>
              </div>
            </div>
          </div>
        </div>
        <h3 className="text-lg text-[#505050] font-bold self-start mt-6">
          Identificación del beneficiario
        </h3>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="identification" className="text-sm font-medium">
              CUI *
            </label>
            <input
              type="text"
              id="identification"
              className="rounded-md border p-2 bg-gray-100"
              value={cui}
              onChange={(e) => setCui(e.target.value)}
              readOnly
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="gender" className="text-sm font-medium">
              Sexo *
            </label>
            <div className="flex items-center gap-2">
              <Combobox
                options={[
                  { label: "Masculino", value: "Masculino" },
                  { label: "Femenino", value: "Femenino" },
                ]}
                onChange={(value) => setGender(value)}
                value={gender}
                width="full"
              />
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="birthDate" className="text-sm font-medium">
              Fecha de Nacimiento *
            </label>
            <input
              type="date"
              id="birthDate"
              className="rounded-md border p-2 bg-gray-100"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              readOnly
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="firstName" className="text-sm font-medium">
              Primer Nombre *
            </label>
            <input
              type="text"
              id="firstName"
              className="rounded-md border p-2 bg-gray-100"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              readOnly
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="secondName" className="text-sm font-medium">
              Segundo Nombre
            </label>
            <input
              type="text"
              id="secondName"
              className="rounded-md border p-2 bg-gray-100"
              value={secondName}
              onChange={(e) => setSecondName(e.target.value)}
              readOnly
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="thirdName" className="text-sm font-medium">
              Tercer Nombre
            </label>
            <input
              type="text"
              id="thirdName"
              className="rounded-md border p-2 bg-gray-100"
              value={thirdName}
              onChange={(e) => setThirdName(e.target.value)}
              readOnly
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="firstLastName" className="text-sm font-medium">
              Primer Apellido
            </label>
            <input
              type="text"
              id="firstLastName"
              className="rounded-md border p-2 bg-gray-100"
              value={firstLastName}
              onChange={(e) => setFirstLastName(e.target.value)}
              readOnly
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="secondLastName" className="text-sm font-medium">
              Segundo Apellido
            </label>
            <input
              type="text"
              id="secondLastName"
              className="rounded-md border p-2 bg-gray-100"
              value={secondLastName}
              onChange={(e) => setSecondLastName(e.target.value)}
              readOnly
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="thirdLastName" className="text-sm font-medium">
              Tercer Apellido
            </label>
            <input
              type="text"
              id="thirdLastName"
              className="rounded-md border p-2 bg-gray-100"
              value={thirdLastName}
              onChange={(e) => setThirdLastName(e.target.value)}
              readOnly
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="birthDepartment" className="text-sm font-medium">
              Departamento de Nacimiento
            </label>
            <div className="pointer-events-none opacity-75">
              <Combobox
                options={guatemalaGeography.map((department) => ({
                  label: department.title,
                  value: department.title,
                }))}
                value={birthDepartment}
                onChange={(value) => setBirthDepartment(value)}
                width="full"
                popOverWidth="full"
              />
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="birthMunicipality" className="text-sm font-medium">
              Municipio de Nacimiento
            </label>
            <div className="pointer-events-none opacity-75">
              <Combobox
                options={
                  guatemalaGeography
                    .find((department) => department.title === birthDepartment)
                    ?.municipalities.map((municipality) => ({
                      label: municipality,
                      value: municipality,
                    })) || [] // Provide a default empty array
                }
                value={birthMunicipality}
                onChange={(value) => setBirthMunicipality(value)}
                width="full"
                popOverWidth="full"
              />
            </div>
          </div>
        </div>
        <h3 className="text-lg text-[#505050] font-bold self-start mt-6">
          Datos de pertenencia cultural
        </h3>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="puebloOrigin" className="text-sm font-medium">
              Pueblo de Origen
            </label>
            <div className="pointer-events-none opacity-75">
              <Combobox
                options={[
                  { label: "Pueblo Maya", value: "Pueblo Maya" },
                  { label: "Pueblo KekChi", value: "Pueblo KekChi" },
                  { label: "Pueblo Mopan", value: "Pueblo Mopan" },
                  { label: "Pueblo Q'eqchi", value: "Pueblo Q'eqchi" },
                  { label: "Pueblo Mam", value: "Pueblo Mam" },
                  { label: "Pueblo Garifuna", value: "Pueblo Garifuna" },
                ]}
                value={puebloOrigin}
                onChange={(value) => setPuebloOrigin(value)}
                width="full"
                popOverWidth="full"
              />
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label
              htmlFor="linguisticCommunity"
              className="text-sm font-medium"
            >
              Comunidad Lingüística
            </label>
            <div className="pointer-events-none opacity-75">
              <Combobox
                options={[
                  { label: "Pueblo Maya", value: "Pueblo Maya" },
                  { label: "Pueblo KekChi", value: "Pueblo KekChi" },
                ]}
                value={linguisticCommunity}
                onChange={(value) => setLinguisticCommunity(value)}
                width="full"
                popOverWidth="full"
              />
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="language" className="text-sm font-medium">
              Idioma
            </label>
            <div className="pointer-events-none opacity-75">
              <Combobox
                options={[
                  { label: "Español", value: "Español" },
                  { label: "Quiché", value: "Quiché" },
                ]}
                value={language}
                onChange={(value) => setLanguage(value)}
                width="full"
                popOverWidth="full"
              />
            </div>
          </div>
        </div>
        <h3 className="text-lg text-[#505050] font-bold self-start mt-6">
          Residencia Actual
        </h3>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="rshHomeId" className="text-sm font-medium">
              ID Hogar RSH
            </label>
            <input
              type="text"
              id="rshHomeId"
              className="rounded-md border p-2 bg-gray-100"
              value={rshHomeId}
              readOnly
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label
              htmlFor="residenceDepartment"
              className="text-sm font-medium"
            >
              Departamento de Residencia
            </label>
            <div className="pointer-events-none opacity-75">
              <Combobox
                options={guatemalaGeography.map((department) => ({
                  label: department.title,
                  value: department.title,
                }))}
                value={residenceDepartment}
                onChange={(value) => setResidenceDepartment(value)}
                width="full"
                popOverWidth="full"
              />
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label
              htmlFor="residenceMunicipality"
              className="text-sm font-medium"
            >
              Municipio de Residencia
            </label>
            <div className="pointer-events-none opacity-75">
              <Combobox
                options={
                  guatemalaGeography
                    .find(
                      (department) => department.title === residenceDepartment
                    )
                    ?.municipalities.map((municipality) => ({
                      label: municipality,
                      value: municipality,
                    })) || []
                }
                value={residenceMunicipality}
                onChange={(value) => setResidenceMunicipality(value)}
                width="full"
                popOverWidth="full"
              />
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="cellphone" className="text-sm font-medium">
              Teléfono Celular
            </label>
            <input
              type="text"
              id="cellphone"
              className="rounded-md border p-2 bg-gray-100"
              value={cellphone}
              onChange={(e) => setCellphone(e.target.value)}
              readOnly
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label
              htmlFor="residencePopulatedPlace"
              className="text-sm font-medium"
            >
              Lugar poblado
            </label>
            <input
              type="text"
              id="residencePopulatedPlace"
              className="rounded-md border p-2 bg-gray-100"
              value={residencePopulatedPlace}
              readOnly
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="residenceAddress" className="text-sm font-medium">
              Dirección de Residencia
            </label>
            <input
              type="text"
              id="residenceAddress"
              className="rounded-md border p-2 bg-gray-100"
              value={residenceAddress}
              onChange={(e) => setResidenceAddress(e.target.value)}
              readOnly
            />
          </div>
        </div>
        <h3 className="text-lg text-[#505050] font-bold self-start mt-6">
          Situación Social y Laboral
        </h3>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="schoolLevel" className="text-sm font-medium">
              Nivel de Estudios
            </label>
            <div className="pointer-events-none opacity-75">
              <Combobox
                options={[
                  { label: "Primaria", value: "Primaria" },
                  { label: "Secundaria", value: "Secundaria" },
                  { label: "Bachillerato", value: "Bachillerato" },
                  { label: "Universidad", value: "Universidad" },
                ]}
                value={schoolLevel}
                onChange={(value) => setSchoolLevel(value)}
                width="full"
                popOverWidth="full"
              />
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="disability" className="text-sm font-medium">
              Discapacidad
            </label>
            <div className="pointer-events-none opacity-75">
              <Combobox
                options={[
                  { label: "Sí", value: "Sí" },
                  { label: "No", value: "No" },
                ]}
                value={disability}
                onChange={(value) => setDisability(value)}
                width="full"
                popOverWidth="full"
              />
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="works" className="text-sm font-medium">
              Trabaja
            </label>
            <div className="pointer-events-none opacity-75">
              <Combobox
                options={[
                  { label: "Sí", value: "Sí" },
                  { label: "No", value: "No" },
                ]}
                value={works}
                onChange={(value) => setWorks(value)}
                width="full"
                popOverWidth="full"
              />
            </div>
          </div>
        </div>
        <h3 className="text-lg text-[#505050] font-bold self-start mt-6">
          Información del Beneficio Social
        </h3>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="program" className="text-sm font-medium">
              Programa <span className="text-red-500">*</span>
            </label>
            <Combobox
              options={[
                {
                  label: "Transferencias Monetarias",
                  value: "Transferencias Monetarias",
                },
                { label: "Bolsa de Alimentos", value: "Bolsa de Alimentos" },
                { label: "Apoyo Escolar", value: "Apoyo Escolar" },
                {
                  label: "Subsidio de Vivienda",
                  value: "Subsidio de Vivienda",
                },
              ]}
              value={program}
              onChange={(value) => setProgram(value)}
              width="full"
              popOverWidth="full"
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="benefit" className="text-sm font-medium">
              Beneficio Social <span className="text-red-500">*</span>
            </label>
            <Combobox
              options={
                program === "Transferencias Monetarias"
                  ? [
                      { label: "Bono Familiar", value: "Bono Familiar" },
                      { label: "Bono Escolar", value: "Bono Escolar" },
                      { label: "Bono Salud", value: "Bono Salud" },
                    ]
                  : program === "Bolsa de Alimentos"
                  ? [
                      { label: "Bolsa Regular", value: "Bolsa Regular" },
                      { label: "Bolsa Ampliada", value: "Bolsa Ampliada" },
                    ]
                  : program === "Apoyo Escolar"
                  ? [
                      { label: "Útiles Escolares", value: "Útiles Escolares" },
                      { label: "Uniformes", value: "Uniformes" },
                      { label: "Mochila", value: "Mochila" },
                    ]
                  : program === "Subsidio de Vivienda"
                  ? [
                      { label: "Mejoramiento", value: "Mejoramiento" },
                      { label: "Construcción", value: "Construcción" },
                    ]
                  : []
              }
              value={benefit}
              onChange={(value) => setBenefit(value)}
              width="full"
              popOverWidth="full"
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="deliveryDepartment" className="text-sm font-medium">
              Departamento de Entrega <span className="text-red-500">*</span>
            </label>
            <div className="opacity-75">
              <Combobox
                options={guatemalaGeography.map((department) => ({
                  label: department.title,
                  value: department.title,
                }))}
                value={deliveryDepartment}
                onChange={(value) => setDeliveryDepartment(value)}
                width="full"
                popOverWidth="full"
              />
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label
              htmlFor="deliveryMunicipality"
              className="text-sm font-medium"
            >
              Municipio de Entrega <span className="text-red-500">*</span>
            </label>
            <div className="opacity-75">
              <Combobox
                options={
                  guatemalaGeography
                    .find(
                      (department) => department.title === deliveryDepartment
                    )
                    ?.municipalities.map((municipality) => ({
                      label: municipality,
                      value: municipality,
                    })) || []
                }
                value={deliveryMunicipality}
                onChange={(value) => setDeliveryMunicipality(value)}
                width="full"
                popOverWidth="full"
              />
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label
              htmlFor="deliveryPopulatedPlace"
              className="text-sm font-medium"
            >
              Lugar poblado <span className="text-red-500">*</span>
            </label>
            <Combobox
              options={[
                { label: "Chacpantzé", value: "Chacpantzé" },
                { label: "Chajul", value: "Chajul" },
              ]}
              value={deliveryPopulatedPlace}
              onChange={(value) => setDeliveryPopulatedPlace(value)}
              width="full"
              popOverWidth="full"
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="deliveryDate" className="text-sm font-medium">
              Fecha de Entrega <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="deliveryDate"
              className="rounded-md border p-2"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="deliveryQuantity" className="text-sm font-medium">
              Cantidad <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="deliveryQuantity"
              className="rounded-md border p-2"
              value={deliveryQuantity}
              onChange={(e) => setDeliveryQuantity(e.target.value)}
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="deliveryValue" className="text-sm font-medium">
              Valor del beneficio <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="deliveryValue"
              className="rounded-md border p-2"
              value={deliveryValue}
              onChange={(e) => setDeliveryValue(e.target.value)}
            />
          </div>
        </div>
        <h3 className="text-lg text-[#505050] font-bold self-start mt-6">
          Confirmación
        </h3>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 border-2 border-blue-200 p-4 rounded-md bg-blue-50">
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="confirmationCui" className="text-sm font-medium">
              CUI
            </label>
            <input
              type="text"
              id="confirmationCui"
              className="rounded-md border p-2 bg-white"
              value={confirmationCui}
              readOnly
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="confirmationName" className="text-sm font-medium">
              Nombre
            </label>
            <input
              type="text"
              id="confirmationName"
              className="rounded-md border p-2 bg-white"
              value={confirmationName}
              readOnly
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="confirmationGender" className="text-sm font-medium">
              Género
            </label>
            <input
              type="text"
              id="confirmationGender"
              className="rounded-md border p-2 bg-white"
              value={confirmationGender}
              readOnly
            />
          </div>
        </div>
        <div className="w-full flex justify-end mt-8">
          <Button
            type="submit"
            className="bg-[#1c2851] text-white hover:bg-[#1c2851]/80"
          >
            Registrar Entrega
          </Button>
        </div>
      </form>
    </div>
  );
};

// Update InterventionsManagementSection to accept activeSubViewId prop
interface InterventionsManagementSectionProps {
  activeSubViewId: string | null;
}

export const InterventionsManagementSection = ({
  activeSubViewId,
}: InterventionsManagementSectionProps) => {
  // Programs management state
  const [newProgram, setNewProgram] = useState<Partial<Programme>>({
    program_manager: "",
    admin_direction: "",
    email: "",
    phone: "",
    institution: "",
    name: "",
    type: "individual",
  });
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Programme | null>(null);

  // Benefits management state
  const [newBenefit, setNewBenefit] = useState<Partial<Benefit>>({
    budget: "",
    subproduct_name: "",
    short_name: "",
    type: "",
    description: "",
    objective: "",
    criteria: "",
    intervention_finality: "",
    social_atention: "",
    selection_and_focalization_form: "",
    temporality: "",
    target_population: "",
    intervention_objective: "",
  });
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [isLoadingBenefits, setIsLoadingBenefits] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<Benefit | null>(null);
  const [benefitToDelete, setBenefitToDelete] = useState<Benefit | null>(null);

  // Load data on component mount
  useEffect(() => {
    fetchPrograms();
    fetchBenefits();
  }, []);

  const fetchPrograms = async () => {
    setIsLoadingPrograms(true);
    try {
      const data = await getPrograms();
      setProgrammes(data);
    } catch (error) {
      console.error("Error fetching programs:", error);
    } finally {
      setIsLoadingPrograms(false);
    }
  };

  const fetchBenefits = async () => {
    setIsLoadingBenefits(true);
    try {
      const data = await getBenefits();
      setBenefits(data);
    } catch (error) {
      console.error("Error fetching benefits:", error);
    } finally {
      setIsLoadingBenefits(false);
    }
  };

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addProgram(newProgram as Programme);
      setNewProgram({
        program_manager: "",
        admin_direction: "",
        email: "",
        phone: "",
        institution: "",
        name: "",
        type: "individual",
      });
      fetchPrograms();
      toast.success("Programa creado con éxito");
    } catch (error) {
      console.error("Error creating program:", error);
      toast.error("Error al crear el programa");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProgram = async (program: Programme) => {
    setIsLoading(true);
    try {
      await updateProgram(program);
      fetchPrograms();
      setEditingProgram(null);
      toast.success("Programa actualizado con éxito");
    } catch (error) {
      console.error("Error updating program:", error);
      toast.error("Error al actualizar el programa");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProgram = async (programId: number) => {
    setIsLoading(true);
    try {
      await deleteProgram(programId);
      fetchPrograms();
      toast.success("Programa eliminado con éxito");
    } catch (error) {
      console.error("Error deleting program:", error);
      toast.error("Error al eliminar el programa");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBenefit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addBenefit(newBenefit as Benefit);
      setNewBenefit({
        budget: "",
        subproduct_name: "",
        short_name: "",
        type: "",
        description: "",
        objective: "",
        criteria: "",
        intervention_finality: "",
        social_atention: "",
        selection_and_focalization_form: "",
        temporality: "",
        target_population: "",
        intervention_objective: "",
      });
      fetchBenefits();
      toast.success("Beneficio creado con éxito");
    } catch (error) {
      console.error("Error creating benefit:", error);
      toast.error("Error al crear el beneficio");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBenefit = async (benefit: Benefit) => {
    setIsLoading(true);
    try {
      await updateBenefit(benefit);
      fetchBenefits();
      setEditingBenefit(null);
      toast.success("Beneficio actualizado con éxito");
    } catch (error) {
      console.error("Error updating benefit:", error);
      toast.error("Error al actualizar el beneficio");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBenefit = async (benefitId: number) => {
    setIsLoading(true);
    try {
      await deleteBenefit(benefitId);
      fetchBenefits();
      toast.success("Beneficio eliminado con éxito");
    } catch (error) {
      console.error("Error deleting benefit:", error);
      toast.error("Error al eliminar el beneficio");
    } finally {
      setIsLoading(false);
    }
  };

  const getSectionTitle = () => {
    switch (activeSubViewId) {
      case "interventions-programs":
        return "Gestión de Programas";
      case "interventions-benefits":
        return "Gestión de Beneficios";
      case "interventions-fichas":
        return "Registro de Fichas";
      case "interventions-entregas":
        return "Digitación de Entregas";
      case "interventions-goals":
        return "Metas por Intervención";
      default:
        return "Intervenciones / Mano a Mano";
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-start items-start gap-4">
      <h2 className="text-2xl font-bold text-[#505050]">{getSectionTitle()}</h2>
      <div className="w-full h-full flex flex-col justify-start items-start gap-4 bg-white p-4 rounded-lg">
        {/* Programs Management Section */}
        {activeSubViewId === "interventions-programs" && (
          <div className="w-full">
            <form onSubmit={handleCreateProgram} className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2 flex justify-center items-center w-1/4 text-lg font-medium text-[#505050] border border-[#505050] bg-[#505050]/10">
                  Datos del personal a cargo
                </div>
                <div className="flex flex-col col-span-2 gap-2">
                  <label
                    htmlFor="programManager"
                    className="text-sm font-medium"
                  >
                    Nombre del encargado del programa
                  </label>
                  <input
                    type="text"
                    id="programManager"
                    value={newProgram.program_manager}
                    onChange={(e) =>
                      setNewProgram({
                        ...newProgram,
                        program_manager: e.target.value,
                      })
                    }
                    className="rounded-md border p-2"
                    required
                  />
                </div>
                {/* ... Keep the rest of the form fields ... */}
                <div className="flex flex-col col-span-2 gap-2">
                  <label
                    htmlFor="adminDirection"
                    className="text-sm font-medium"
                  >
                    Dirección Administrativa
                  </label>
                  <input
                    type="text"
                    id="adminDirection"
                    value={newProgram.admin_direction}
                    onChange={(e) =>
                      setNewProgram({
                        ...newProgram,
                        admin_direction: e.target.value,
                      })
                    }
                    className="rounded-md border p-2"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={newProgram.email}
                    onChange={(e) =>
                      setNewProgram({
                        ...newProgram,
                        email: e.target.value,
                      })
                    }
                    className="rounded-md border p-2"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    id="phone"
                    value={newProgram.phone}
                    onChange={(e) =>
                      setNewProgram({
                        ...newProgram,
                        phone: e.target.value,
                      })
                    }
                    className="rounded-md border p-2"
                    required
                  />
                </div>
                <div className="col-span-2 flex justify-center items-center w-1/4 text-lg font-medium text-[#505050] border border-[#505050] bg-[#505050]/10">
                  Datos del programa
                </div>
                {/* ... keep rest of the form ... */}
              </div>
              <button
                type="submit"
                className="bg-[#1c2851] text-white px-4 py-2 rounded-md hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Creando..." : "Crear Programa"}
              </button>
            </form>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Institución
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoadingPrograms ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                      >
                        Cargando...
                      </td>
                    </tr>
                  ) : programmes.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                      >
                        No hay programas registrados.
                      </td>
                    </tr>
                  ) : (
                    programmes.map((program: Programme) => (
                      <tr key={program.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {program.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {program.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {program.institution}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {program.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setEditingProgram(program)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteProgram(program.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Benefits Management Section */}
        {activeSubViewId === "interventions-benefits" && (
          <div className="w-full">
            <form onSubmit={handleCreateBenefit} className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="budget" className="text-sm font-medium">
                    Partida Presupuestaria
                  </label>
                  <input
                    type="text"
                    id="budget"
                    value={newBenefit.budget}
                    onChange={(e) =>
                      setNewBenefit({
                        ...newBenefit,
                        budget: e.target.value,
                      })
                    }
                    className="rounded-md border p-2"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="subproduct_name"
                    className="text-sm font-medium"
                  >
                    Nombre del Subproducto
                  </label>
                  <input
                    type="text"
                    id="subproduct_name"
                    value={newBenefit.subproduct_name}
                    onChange={(e) =>
                      setNewBenefit({
                        ...newBenefit,
                        subproduct_name: e.target.value,
                      })
                    }
                    className="rounded-md border p-2"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="short_name" className="text-sm font-medium">
                    Nombre Corto
                  </label>
                  <input
                    type="text"
                    id="short_name"
                    value={newBenefit.short_name}
                    onChange={(e) =>
                      setNewBenefit({
                        ...newBenefit,
                        short_name: e.target.value,
                      })
                    }
                    className="rounded-md border p-2"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="type" className="text-sm font-medium">
                    Tipo
                  </label>
                  <select
                    id="type"
                    value={newBenefit.type}
                    onChange={(e) =>
                      setNewBenefit({
                        ...newBenefit,
                        type: e.target.value,
                      })
                    }
                    className="rounded-md border p-2"
                    required
                  >
                    <option value="">Seleccione un tipo</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Especie">Especie</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                {/* ... keep rest of the form ... */}
              </div>
              <button
                type="submit"
                className="bg-[#1c2851] text-white px-4 py-2 rounded-md hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Creando..." : "Crear Beneficio"}
              </button>
            </form>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Partida
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre Corto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoadingBenefits ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                      >
                        Cargando...
                      </td>
                    </tr>
                  ) : benefits.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                      >
                        No hay beneficios registrados.
                      </td>
                    </tr>
                  ) : (
                    benefits.map((benefit: Benefit) => (
                      <tr key={benefit.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {benefit.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {benefit.budget}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {benefit.short_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {benefit.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setEditingBenefit(benefit)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => setBenefitToDelete(benefit)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Ficha Registration Section */}
        {activeSubViewId === "interventions-fichas" && (
          <div className="w-full">
            <FichasSection />
          </div>
        )}

        {/* Entregas Section */}
        {activeSubViewId === "interventions-entregas" && (
          <div className="w-full">
            <EntregasSection />
          </div>
        )}

        {/* Goals Section */}
        {activeSubViewId === "interventions-goals" && (
          <div className="w-full">
            <GoalsSection />
          </div>
        )}

        {/* Show a default message if no valid subViewId is provided */}
        {!activeSubViewId && (
          <div className="w-full text-center p-4">
            <p className="text-gray-500">
              Seleccione una opción del menú lateral
            </p>
          </div>
        )}

        {/* Keep the dialogs and toasts at the bottom level */}
        {/* ... dialogs ... */}

        {/* Dialog for editing program */}
        <Dialog
          open={!!editingProgram}
          onOpenChange={() => setEditingProgram(null)}
        >
          <DialogContent className="max-w-[80vw]">
            <DialogHeader>
              <DialogTitle>Editar Programa</DialogTitle>
              <DialogDescription>
                Modifique los campos necesarios para actualizar el programa.
              </DialogDescription>
            </DialogHeader>
            {editingProgram && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEditProgram(editingProgram);
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="edit-name">Nombre</label>
                    <input
                      id="edit-name"
                      value={editingProgram.name}
                      onChange={(e) =>
                        setEditingProgram({
                          ...editingProgram,
                          name: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="edit-institution">Institución</label>
                    <input
                      id="edit-institution"
                      value={editingProgram.institution}
                      onChange={(e) =>
                        setEditingProgram({
                          ...editingProgram,
                          institution: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md"
                  >
                    Guardar Cambios
                  </button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog for editing benefit */}
        <Dialog
          open={!!editingBenefit}
          onOpenChange={() => setEditingBenefit(null)}
        >
          <DialogContent className="max-w-[80vw]">
            <DialogHeader>
              <DialogTitle>Editar Beneficio</DialogTitle>
              <DialogDescription>
                Modifique los campos necesarios para actualizar el beneficio.
              </DialogDescription>
            </DialogHeader>
            {editingBenefit && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEditBenefit(editingBenefit);
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="edit-budget">Partida Presupuestaria</label>
                    <input
                      id="edit-budget"
                      value={editingBenefit.budget}
                      onChange={(e) =>
                        setEditingBenefit({
                          ...editingBenefit,
                          budget: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="edit-short_name">Nombre Corto</label>
                    <input
                      id="edit-short_name"
                      value={editingBenefit.short_name}
                      onChange={(e) =>
                        setEditingBenefit({
                          ...editingBenefit,
                          short_name: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md"
                  >
                    Guardar Cambios
                  </button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog for confirming benefit deletion */}
        <Dialog
          open={!!benefitToDelete}
          onOpenChange={() => setBenefitToDelete(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Eliminación</DialogTitle>
              <DialogDescription>
                ¿Está seguro que desea eliminar este beneficio? Esta acción no
                se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <button
                onClick={() => setBenefitToDelete(null)}
                className="px-4 py-2 rounded-md mr-2 border"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (benefitToDelete) {
                    handleDeleteBenefit(benefitToDelete.id);
                    setBenefitToDelete(null);
                  }
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Eliminar
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Toaster />
      </div>
    </div>
  );
};

export default InterventionsManagementSection;
