import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import guatemalaJSON from "@/data/guatemala.json";
import { Programme } from "@/data/programme";
import { Benefit } from "@/data/benefit";
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
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
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
  programas: Programa[];
}
interface FichaCabecera {
  institucion: string;
  siglas: string;
  nombreCorto: string;
  delegados: {
    nombre: string;
    telefono: string;
    rol: string;
    correo: string;
  }[];
  autoridad: {
    nombre: string;
    cargo: string;
  };
}
interface Programa {
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
  const [fichas, setFichas] = useState<Ficha[]>([
    {
      id: 1,
      nombre: "MIDES",
      ano: "2025",
      estado: "Activo",
      cabecera: {
        institucion: "MIDES",
        siglas: "MIDES",
        nombreCorto: "MIDES",
        delegados: [
          {
            nombre: "Juan Perez",
            telefono: "1234567890",
            rol: "Delegado",
            correo: "juan.perez@example.com",
          },
        ],
        autoridad: {
          nombre: "Juan Perez",
          cargo: "Director",
        },
      },
      programas: [
        {
          // Example Programa
          codigo: "PROG-1-1",
          codigoSicoin: "SICOIN001",
          tipo: "programa",
          nombreSicoin: "Prog Mides Sicoin",
          nombreComun: "Programa Mides 1",
          descripcion: "Desc Prog Mides 1",
          objetivo: "Obj Prog Mides 1",
          marcoLegal: "Legal",
          autoridad: { nombre: "Aut Nombre", cargo: "Aut Cargo" },
          funcionario: { nombre: "Func Nombre", cargo: "Func Cargo" },
          beneficios: [
            {
              id: "BEN-1-1",
              codigo: "BEN-1-1",
              codigoPrograma: "PROG-1-1",
              nombrePrograma: "Programa Mides 1",
              codigoSicoin: "SICOIN001",
              nombreSubproducto: "Subprod Mides 1",
              nombreCorto: "Subprod Mides 1",
              nombre: "Beneficio Mides 1",
              descripcion: "Desc Ben Mides 1",
              objetivo: "Obj Ben Mides 1",
              tipo: "individual",
              criteriosInclusion: "Criterios Inclusion Mides 1",
              atencionSocial: "protección",
              rangoEdad: "Adultos",
              poblacionObjetivo: {
                porCondicionSocioeconomica: {
                  personasEnPobrezaExtrema: true,
                  hogaresConIngresos: true,
                  nivelDeSalarioMinimo: true,
                },
                porCondicionDeVulnerabilidad: {
                  personasConDiscapacidad: true,
                  mujeresEnViolenciaDeGenero: true,
                  poblacionGuatemalteca: true,
                  personasIndocumentadas: true,
                  migrantes: true,
                },
                porPertenenciaEtnicaOCultural: {
                  comunidadesIndigenas: true,
                  pueblosAfrodescendientes: true,
                  gruposEtnicos: true,
                  idiomas: true,
                  sentidos: true,
                },
                porSituacionLaboral: {
                  desempleados: true,
                  personasEnSubempleo: true,
                  jovenesEnExperienciaLaboral: true,
                },
                porGeneroYDomicilio: {
                  personasJefasDeHogar: true,
                  personasLGBTIQEnSituacionDeRiesgo: true,
                },
                porCondicionDeSalud: {
                  personasConEnfermedadesCronicas: true,
                  mujeresEmbarazadasEnRiesgo: true,
                  ninosConDesnutricion: true,
                },
              },
              clasificadorTematico: {
                ninez: true,
                adolescentesYJovenes: true,
                mujeres: true,
                adultos: true,
                adultosMayores: true,
                poblacionIndigena: true,
                personasConDiscapacidad: true,
                poblacionMigrante: true,
                areasPrecarizadas: true,
              },
              objeto: {
                ingresosFamiliares: true,
                condicionesDeVivienda: true,
                accesoAServiciosBasicos: true,
                nutricionYSalud: true,
                educacionYHabilidadesLaborales: true,
              },
              forma: {
                censoORegistrosOficiales: true,
                autoseleccion: true,
                seleccionPorIntermediacion: true,
                identificacionPorDemandaEspontanea: true,
              },
              focalizacion: {
                geografica: {
                  municipiosConMayoresNivelesDePobreza: true,
                  comunidadesRuralesDeOfidicilAcceso: true,
                  zonasUrbanoMarginales: true,
                },
                demografica: {
                  segunGrupoEtarioGeneroYEtnia: true,
                },
                socioeconomica: {
                  basadoEnIngresosPerCapita: true,
                  basadoEnAccesoAServiciosBasicos: true,
                },
                porVulnerabilidad: {
                  personasConNecesidadesUrgentes: true,
                  desplazadosVictimasDeViolencia: true,
                },
                multidimensional: {
                  combinacionDeCriterios: true,
                },
              },
              finalidad: {
                reduccionPobreza: true,
                mejoraAccesoEducacion: true,
                fortalecimientoSeguridadAlimentaria: true,
                promocionSaludBienestar: true,
                prevencionAtencionViolencia: true,
              },
              funcionarioFocal: {
                nombre: "Juan Perez",
                cargo: "Director",
              },
            },
          ], // Start with empty benefits
        },
      ],
    },
    {
      id: 2,
      nombre: "MINDEF",
      ano: "2025",
      estado: "En revisión",
      cabecera: {
        institucion: "MINDEF",
        siglas: "MINDEF",
        nombreCorto: "MINDEF",
        delegados: [],
        autoridad: {
          nombre: "Juan Perez",
          cargo: "Director",
        },
      },
      programas: [],
    },
    {
      id: 3,
      nombre: "FODES",
      ano: "2025",
      estado: "Completado",
      cabecera: {
        institucion: "FODES",
        siglas: "FODES",
        nombreCorto: "FODES",
        delegados: [],
        autoridad: {
          nombre: "Juan Perez",
          cargo: "Director",
        },
      },
      programas: [],
    },
    {
      id: 4,
      nombre: "MINTRAB",
      ano: "2025",
      estado: "Activo",
      cabecera: {
        institucion: "MINTRAB",
        siglas: "MINTRAB",
        nombreCorto: "MINTRAB",
        delegados: [],
        autoridad: {
          nombre: "Juan Perez",
          cargo: "Director",
        },
      },
      programas: [],
    },
    {
      id: 5,
      nombre: "MAGA",
      ano: "2024",
      estado: "Completado",
      cabecera: {
        institucion: "MAGA",
        siglas: "MAGA",
        nombreCorto: "MAGA",
        delegados: [],
        autoridad: {
          nombre: "Juan Perez",
          cargo: "Director",
        },
      },
      programas: [],
    },
  ]);
  // State to control the visibility of the creation form
  const [isCreatingFicha, setIsCreatingFicha] = useState(false);

  // Define initial empty state for Ficha Cabecera
  const initialFichaCabecera: FichaCabecera = {
    institucion: "",
    siglas: "",
    nombreCorto: "",
    delegados: [
      { nombre: "", telefono: "", rol: "", correo: "" },
      { nombre: "", telefono: "", rol: "", correo: "" },
      { nombre: "", telefono: "", rol: "", correo: "" },
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
    fichaId: number;
    // Store the *original* program being edited, mainly its code/id
    // The form fields will bind to newProgramaData
    programaCodigo: string;
  } | null>(null);
  // State to track the program being deleted (includes fichaId for context)
  const [programaToDelete, setProgramaToDelete] = useState<{
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
            { nombre: "", telefono: "", rol: "", correo: "" }, // Add empty delegado
          ],
        };
      }
      return prev; // Return previous state if already 3 or more
    });
  };

  // Handler to create or update the ficha
  const handleSubmitFicha = (e: React.FormEvent) => {
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
      setFichas((currentFichas) =>
        currentFichas.map((f) => (f.id === editingFicha.id ? updatedFicha : f))
      );
      setEditingFicha(null); // Clear editing state
    } else {
      // --- Create Logic ---
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
      setFichas((currentFichas) => [...currentFichas, newFicha]);
    }
    // Reset form and hide it
    setNewFichaCabecera(initialFichaCabecera); // Reset to initial empty state
    setIsCreatingFicha(false);
  };

  // Handler to initiate editing a ficha
  const handleEditFicha = (fichaId: number) => {
    const fichaToEdit = fichas.find((f) => f.id === fichaId);
    if (fichaToEdit) {
      setEditingFicha(fichaToEdit);
      // Pre-populate the form state with the existing data
      // Ensure deep copy if necessary, though simple spread might suffice for Cabecera
      setNewFichaCabecera({ ...fichaToEdit.cabecera });
      setIsCreatingFicha(true); // Show the form
      setViewingFicha(null); // Ensure not in program view mode
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
  const handleSubmitPrograma = (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingFicha) return;

    // --- Edit Logic ---
    if (editingPrograma) {
      const updatedProgramData: Omit<Programa, "beneficios"> = {
        ...newProgramaData, // Data from the form
        codigo: editingPrograma.programaCodigo, // Ensure original code is kept if needed, or use newProgramaData.codigo if editable
      };

      setFichas((currentFichas) =>
        currentFichas.map((ficha) => {
          if (ficha.id === editingPrograma.fichaId) {
            // Find the program and update it
            return {
              ...ficha,
              programas: ficha.programas.map((prog) =>
                prog.codigo === editingPrograma.programaCodigo
                  ? { ...prog, ...updatedProgramData } // Update existing program, keep benefits
                  : prog
              ),
            };
          }
          return ficha;
        })
      );

      // Update the viewingFicha state as well to reflect the change immediately in the UI
      setViewingFicha((prev) =>
        prev && prev.id === editingPrograma.fichaId
          ? {
              ...prev,
              programas: prev.programas.map((prog) =>
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
          `PROG-${viewingFicha.id}-${viewingFicha.programas.length + 1}`,
        beneficios: [], // Initialize with empty benefits array
      };

      setFichas((currentFichas) =>
        currentFichas.map((ficha) => {
          if (ficha.id === viewingFicha.id) {
            return {
              ...ficha,
              programas: [...ficha.programas, newProgramaWithIdAndBenefits],
            };
          }
          return ficha;
        })
      );

      setViewingFicha((prev) =>
        prev
          ? {
              ...prev,
              programas: [...prev.programas, newProgramaWithIdAndBenefits],
            }
          : null
      );
    }

    // Reset form and state for both create and edit
    setIsCreatingPrograma(false);
    setNewProgramaData({
      // Reset to initial empty state
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
    const programaToEdit = viewingFicha.programas.find(
      (p) => p.codigo === programaCodigo
    );
    if (programaToEdit) {
      // 1. Populate the form state (newProgramaData) with the program's current data
      setNewProgramaData({
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
    const fichaToView = fichas.find((f) => f.id === fichaId);
    if (fichaToView) {
      setViewingFicha(fichaToView);
      setIsCreatingFicha(false); // Ensure not in ficha creation mode
      setIsCreatingPrograma(false); // Start by viewing the list, not creating
      setViewingPrograma(null); // Ensure we are not viewing benefits when switching fichas
      setEditingPrograma(null); // Reset program editing state
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
  const handleViewBeneficios = (programaCodigo: string) => {
    if (!viewingFicha) return;
    const programa = viewingFicha.programas.find(
      (p) => p.codigo === programaCodigo
    );
    if (programa) {
      setViewingPrograma(programa);
      // Reset other states if necessary
      setIsCreatingPrograma(false);
      setIsCreatingBeneficio(false);
      setEditingBeneficio(null);
      setBeneficioToDelete(null);
    }
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

    // --- Update Logic for Nested State ---
    if (name.includes(".")) {
      const targetValue = type === "checkbox" ? inputElement.checked : value; // Use boolean for nested checkboxes
      const keys = name.split("."); // e.g., ['poblacionObjetivo', 'porCondicionSocioeconomica', 'personasEnPobrezaExtrema']
      setNewBeneficioData((prev) => {
        // Create deep copies to ensure immutability
        const newState = JSON.parse(JSON.stringify(prev));
        let currentLevel = newState;
        // Navigate to the parent object of the target key
        for (let i = 0; i < keys.length - 1; i++) {
          if (!currentLevel[keys[i]]) {
            currentLevel[keys[i]] = {}; // Initialize if path doesn't exist (shouldn't happen with proper init)
          }
          currentLevel = currentLevel[keys[i]];
        }
        // Set the value at the final key
        currentLevel[keys[keys.length - 1]] = targetValue; // Assign boolean checked state
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
  const handleAddBeneficio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingFicha || !viewingPrograma) return;

    const newBenefit: Beneficio = {
      ...newBeneficioData, // Use the state which now has the full structure
      id: crypto.randomUUID(), // Generate a unique ID for the benefit
      codigoPrograma: viewingPrograma.codigo,
      nombrePrograma: viewingPrograma.nombreComun,
      // No need for || {} anymore as initial state is fully defined
    };

    // Update the viewingPrograma state
    const updatedViewingPrograma = {
      ...viewingPrograma,
      beneficios: [...viewingPrograma.beneficios, newBenefit],
    };
    setViewingPrograma(updatedViewingPrograma);

    // Update the main fichas state
    setFichas((currentFichas) =>
      currentFichas.map((ficha) =>
        ficha.id === viewingFicha.id
          ? {
              ...ficha,
              programas: ficha.programas.map((prog) =>
                prog.codigo === viewingPrograma.codigo
                  ? updatedViewingPrograma // Replace with updated program
                  : prog
              ),
            }
          : ficha
      )
    );

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

    setFichas((currentFichas) =>
      currentFichas.map((ficha) =>
        ficha.id === viewingFicha.id
          ? {
              ...ficha,
              programas: ficha.programas.map((prog) =>
                prog.codigo === viewingPrograma.codigo
                  ? updatedViewingPrograma
                  : prog
              ),
            }
          : ficha
      )
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
  const handleConfirmDeletePrograma = () => {
    if (!programaToDelete) return;

    // Update the main fichas state
    setFichas((currentFichas) =>
      currentFichas.map((ficha) => {
        if (ficha.id === programaToDelete.fichaId) {
          // Filter out the program to be deleted
          return {
            ...ficha,
            programas: ficha.programas.filter(
              (prog) => prog.codigo !== programaToDelete.programaCodigo
            ),
          };
        }
        return ficha;
      })
    );

    // Update the viewingFicha state if it's the one being modified
    setViewingFicha((prev) => {
      if (prev && prev.id === programaToDelete.fichaId) {
        return {
          ...prev,
          programas: prev.programas.filter(
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
  const handleConfirmDeleteFicha = () => {
    if (!fichaToDelete) return;
    setFichas((currentFichas) =>
      currentFichas.filter((f) => f.id !== fichaToDelete.id)
    );
    setFichaToDelete(null); // Close the dialog
  };

  // --- Determine Current View ---
  let currentView;
  if (viewingFicha) {
    if (viewingPrograma) {
      // --- View: Benefits Table for selected Programa ---
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
                {viewingFicha.programas.length > 0 ? (
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
              {fichas.map((ficha) => (
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
                      Ver Programas ({ficha.programas.length})
                    </button>
                    {/* Delete Ficha Button */}
                    <button
                      onClick={() => setFichaToDelete(ficha)} // Set state to open dialog
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
                  {/* Por Condición Socioeconómica */}
                  <div className=" p-3">
                    <h5 className="font-medium text-sm mb-2">
                      Por Condición Socioeconómica
                    </h5>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="benef-pobObj-personasEnPobrezaExtrema"
                          name="poblacionObjetivo.porCondicionSocioeconomica.personasEnPobrezaExtrema"
                          checked={
                            newBeneficioData.poblacionObjetivo
                              .porCondicionSocioeconomica
                              .personasEnPobrezaExtrema
                          }
                          onChange={handleBeneficioInputChange}
                          className="rounded border"
                        />
                        <label
                          htmlFor="benef-pobObj-personasEnPobrezaExtrema"
                          className="text-sm"
                        >
                          Personas en pobreza extrema
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="benef-pobObj-hogaresConIngresos"
                          name="poblacionObjetivo.porCondicionSocioeconomica.hogaresConIngresos"
                          checked={
                            newBeneficioData.poblacionObjetivo
                              .porCondicionSocioeconomica.hogaresConIngresos
                          }
                          onChange={handleBeneficioInputChange}
                          className="rounded border"
                        />
                        <label
                          htmlFor="benef-pobObj-hogaresConIngresos"
                          className="text-sm"
                        >
                          Hogares con ingresos
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="benef-pobObj-nivelDeSalarioMinimo"
                          name="poblacionObjetivo.porCondicionSocioeconomica.nivelDeSalarioMinimo"
                          checked={
                            newBeneficioData.poblacionObjetivo
                              .porCondicionSocioeconomica.nivelDeSalarioMinimo
                          }
                          onChange={handleBeneficioInputChange}
                          className="rounded border"
                        />
                        <label
                          htmlFor="benef-pobObj-nivelDeSalarioMinimo"
                          className="text-sm"
                        >
                          Nivel de salario mínimo
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Por Condición De Vulnerabilidad */}
                  <div className=" p-3">
                    <h5 className="font-medium text-sm mb-2">
                      Por Condición De Vulnerabilidad
                    </h5>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="benef-pobObj-personasConDiscapacidad"
                          name="poblacionObjetivo.porCondicionDeVulnerabilidad.personasConDiscapacidad"
                          checked={
                            newBeneficioData.poblacionObjetivo
                              .porCondicionDeVulnerabilidad
                              .personasConDiscapacidad
                          }
                          onChange={handleBeneficioInputChange}
                          className="rounded border"
                        />
                        <label
                          htmlFor="benef-pobObj-personasConDiscapacidad"
                          className="text-sm"
                        >
                          Personas con discapacidad
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="benef-pobObj-mujeresEnViolenciaDeGenero"
                          name="poblacionObjetivo.porCondicionDeVulnerabilidad.mujeresEnViolenciaDeGenero"
                          checked={
                            newBeneficioData.poblacionObjetivo
                              .porCondicionDeVulnerabilidad
                              .mujeresEnViolenciaDeGenero
                          }
                          onChange={handleBeneficioInputChange}
                          className="rounded border"
                        />
                        <label
                          htmlFor="benef-pobObj-mujeresEnViolenciaDeGenero"
                          className="text-sm"
                        >
                          Mujeres en violencia de género
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="benef-pobObj-poblacionGuatemalteca"
                          name="poblacionObjetivo.porCondicionDeVulnerabilidad.poblacionGuatemalteca"
                          checked={
                            newBeneficioData.poblacionObjetivo
                              .porCondicionDeVulnerabilidad
                              .poblacionGuatemalteca
                          }
                          onChange={handleBeneficioInputChange}
                          className="rounded border"
                        />
                        <label
                          htmlFor="benef-pobObj-poblacionGuatemalteca"
                          className="text-sm"
                        >
                          Población guatemalteca
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="benef-pobObj-personasIndocumentadas"
                          name="poblacionObjetivo.porCondicionDeVulnerabilidad.personasIndocumentadas"
                          checked={
                            newBeneficioData.poblacionObjetivo
                              .porCondicionDeVulnerabilidad
                              .personasIndocumentadas
                          }
                          onChange={handleBeneficioInputChange}
                          className="rounded border"
                        />
                        <label
                          htmlFor="benef-pobObj-personasIndocumentadas"
                          className="text-sm"
                        >
                          Personas indocumentadas
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="benef-pobObj-migrantes"
                          name="poblacionObjetivo.porCondicionDeVulnerabilidad.migrantes"
                          checked={
                            newBeneficioData.poblacionObjetivo
                              .porCondicionDeVulnerabilidad.migrantes
                          }
                          onChange={handleBeneficioInputChange}
                          className="rounded border"
                        />
                        <label
                          htmlFor="benef-pobObj-migrantes"
                          className="text-sm"
                        >
                          Migrantes
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Por Pertenencia Étnica O Cultural */}
                  <div className="p-3">
                    <h5 className="font-medium text-sm mb-2">
                      Por Pertenencia Étnica O Cultural
                    </h5>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="benef-pobObj-comunidadesIndigenas"
                          name="poblacionObjetivo.porPertenenciaEtnicaOCultural.comunidadesIndigenas"
                          checked={
                            newBeneficioData.poblacionObjetivo
                              .porPertenenciaEtnicaOCultural
                              .comunidadesIndigenas
                          }
                          onChange={handleBeneficioInputChange}
                          className="rounded border"
                        />
                        <label
                          htmlFor="benef-pobObj-comunidadesIndigenas"
                          className="text-sm"
                        >
                          Comunidades indígenas
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="benef-pobObj-pueblosAfrodescendientes"
                          name="poblacionObjetivo.porPertenenciaEtnicaOCultural.pueblosAfrodescendientes"
                          checked={
                            newBeneficioData.poblacionObjetivo
                              .porPertenenciaEtnicaOCultural
                              .pueblosAfrodescendientes
                          }
                          onChange={handleBeneficioInputChange}
                          className="rounded border"
                        />
                        <label
                          htmlFor="benef-pobObj-pueblosAfrodescendientes"
                          className="text-sm"
                        >
                          Pueblos afrodescendientes
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="benef-pobObj-gruposEtnicos"
                          name="poblacionObjetivo.porPertenenciaEtnicaOCultural.gruposEtnicos"
                          checked={
                            newBeneficioData.poblacionObjetivo
                              .porPertenenciaEtnicaOCultural.gruposEtnicos
                          }
                          onChange={handleBeneficioInputChange}
                          className="rounded border"
                        />
                        <label
                          htmlFor="benef-pobObj-gruposEtnicos"
                          className="text-sm"
                        >
                          Grupos étnicos
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="benef-pobObj-idiomas"
                          name="poblacionObjetivo.porPertenenciaEtnicaOCultural.idiomas"
                          checked={
                            newBeneficioData.poblacionObjetivo
                              .porPertenenciaEtnicaOCultural.idiomas
                          }
                          onChange={handleBeneficioInputChange}
                          className="rounded border"
                        />
                        <label
                          htmlFor="benef-pobObj-idiomas"
                          className="text-sm"
                        >
                          Idiomas
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="benef-pobObj-sentidos"
                          name="poblacionObjetivo.porPertenenciaEtnicaOCultural.sentidos"
                          checked={
                            newBeneficioData.poblacionObjetivo
                              .porPertenenciaEtnicaOCultural.sentidos
                          }
                          onChange={handleBeneficioInputChange}
                          className="rounded border"
                        />
                        <label
                          htmlFor="benef-pobObj-sentidos"
                          className="text-sm"
                        >
                          Sentidos
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Por Situación Laboral */}
                  <div className="p-3">
                    <h5 className="font-medium text-sm mb-2">
                      Por Situación Laboral
                    </h5>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="benef-pobObj-desempleados"
                          name="poblacionObjetivo.porSituacionLaboral.desempleados"
                          checked={
                            newBeneficioData.poblacionObjetivo
                              .porSituacionLaboral.desempleados
                          }
                          onChange={handleBeneficioInputChange}
                          className="rounded border"
                        />
                        <label
                          htmlFor="benef-pobObj-desempleados"
                          className="text-sm"
                        >
                          Desempleados
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="benef-pobObj-personasEnSubempleo"
                          name="poblacionObjetivo.porSituacionLaboral.personasEnSubempleo"
                          checked={
                            newBeneficioData.poblacionObjetivo
                              .porSituacionLaboral.personasEnSubempleo
                          }
                          onChange={handleBeneficioInputChange}
                          className="rounded border"
                        />
                        <label
                          htmlFor="benef-pobObj-personasEnSubempleo"
                          className="text-sm"
                        >
                          Personas en subempleo
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="benef-pobObj-jovenesEnExperienciaLaboral"
                          name="poblacionObjetivo.porSituacionLaboral.jovenesEnExperienciaLaboral"
                          checked={
                            newBeneficioData.poblacionObjetivo
                              .porSituacionLaboral.jovenesEnExperienciaLaboral
                          }
                          onChange={handleBeneficioInputChange}
                          className="rounded border"
                        />
                        <label
                          htmlFor="benef-pobObj-jovenesEnExperienciaLaboral"
                          className="text-sm"
                        >
                          Jóvenes en experiencia laboral
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Por Género Y Domicilio */}
                  <div className="p-3">
                    <h5 className="font-medium text-sm mb-2">
                      Por Género Y Domicilio
                    </h5>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="benef-pobObj-personasJefasDeHogar"
                          name="poblacionObjetivo.porGeneroYDomicilio.personasJefasDeHogar"
                          checked={
                            newBeneficioData.poblacionObjetivo
                              .porGeneroYDomicilio.personasJefasDeHogar
                          }
                          onChange={handleBeneficioInputChange}
                          className="rounded border"
                        />
                        <label
                          htmlFor="benef-pobObj-personasJefasDeHogar"
                          className="text-sm"
                        >
                          Personas jefas de hogar
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="benef-pobObj-personasLGBTIQEnSituacionDeRiesgo"
                          name="poblacionObjetivo.porGeneroYDomicilio.personasLGBTIQEnSituacionDeRiesgo"
                          checked={
                            newBeneficioData.poblacionObjetivo
                              .porGeneroYDomicilio
                              .personasLGBTIQEnSituacionDeRiesgo
                          }
                          onChange={handleBeneficioInputChange}
                          className="rounded border"
                        />
                        <label
                          htmlFor="benef-pobObj-personasLGBTIQEnSituacionDeRiesgo"
                          className="text-sm"
                        >
                          Personas LGBTIQ en situación de riesgo
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Por Condición De Salud */}
                  <div className="p-3">
                    <h5 className="font-medium text-sm mb-2">
                      Por Condición De Salud
                    </h5>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="benef-pobObj-personasConEnfermedadesCronicas"
                          name="poblacionObjetivo.porCondicionDeSalud.personasConEnfermedadesCronicas"
                          checked={
                            newBeneficioData.poblacionObjetivo
                              .porCondicionDeSalud
                              .personasConEnfermedadesCronicas
                          }
                          onChange={handleBeneficioInputChange}
                          className="rounded border"
                        />
                        <label
                          htmlFor="benef-pobObj-personasConEnfermedadesCronicas"
                          className="text-sm"
                        >
                          Personas con enfermedades crónicas
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="benef-pobObj-mujeresEmbarazadasEnRiesgo"
                          name="poblacionObjetivo.porCondicionDeSalud.mujeresEmbarazadasEnRiesgo"
                          checked={
                            newBeneficioData.poblacionObjetivo
                              .porCondicionDeSalud.mujeresEmbarazadasEnRiesgo
                          }
                          onChange={handleBeneficioInputChange}
                          className="rounded border"
                        />
                        <label
                          htmlFor="benef-pobObj-mujeresEmbarazadasEnRiesgo"
                          className="text-sm"
                        >
                          Mujeres embarazadas en riesgo
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="benef-pobObj-ninosConDesnutricion"
                          name="poblacionObjetivo.porCondicionDeSalud.ninosConDesnutricion"
                          checked={
                            newBeneficioData.poblacionObjetivo
                              .porCondicionDeSalud.ninosConDesnutricion
                          }
                          onChange={handleBeneficioInputChange}
                          className="rounded border"
                        />
                        <label
                          htmlFor="benef-pobObj-ninosConDesnutricion"
                          className="text-sm"
                        >
                          Niños con desnutrición
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Finalidad */}
              <div className="col-span-2 border-t pt-4 mt-4">
                <h4 className="text-md font-medium text-gray-700 mb-2">
                  Finalidad del Beneficio
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="benef-finalidad-reduccionPobreza"
                      name="finalidad.reduccionPobreza"
                      checked={newBeneficioData.finalidad.reduccionPobreza}
                      onChange={handleBeneficioInputChange}
                    />
                    <label
                      htmlFor="benef-finalidad-reduccionPobreza"
                      className="text-sm"
                    >
                      Reducción de pobreza
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="benef-finalidad-mejoraAccesoEducacion"
                      name="finalidad.mejoraAccesoEducacion"
                      checked={newBeneficioData.finalidad.mejoraAccesoEducacion}
                      onChange={handleBeneficioInputChange}
                    />
                    <label
                      htmlFor="benef-finalidad-mejoraAccesoEducacion"
                      className="text-sm"
                    >
                      Mejora de acceso a educación
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="benef-finalidad-fortalecimientoSeguridadAlimentaria"
                      name="finalidad.fortalecimientoSeguridadAlimentaria"
                    />
                    <label
                      htmlFor="benef-finalidad-fortalecimientoSeguridadAlimentaria"
                      className="text-sm"
                    >
                      Fortalecimiento de seguridad alimentaria
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="benef-finalidad-promocionSaludBienestar"
                      name="finalidad.promocionSaludBienestar"
                    />
                    <label
                      htmlFor="benef-finalidad-promocionSaludBienestar"
                      className="text-sm"
                    >
                      Promoción de salud y bienestar
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="benef-finalidad-prevencionAtencionViolencia"
                      name="finalidad.prevencionAtencionViolencia"
                    />
                    <label
                      htmlFor="benef-finalidad-prevencionAtencionViolencia"
                      className="text-sm"
                    >
                      Prevención y atención a la violencia
                    </label>
                  </div>
                </div>
              </div>
              {/* Clasificador Tematico */}
              <div className="col-span-2 border-t pt-4 mt-4">
                <h4 className="text-md font-medium text-gray-700 mb-2">
                  Clasificador Tematico
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="benef-clasificador-ninez"
                      name="clasificadorTematico.ninez"
                      checked={newBeneficioData.clasificadorTematico.ninez}
                      onChange={handleBeneficioInputChange}
                      className="rounded border"
                    />
                    <label
                      htmlFor="benef-clasificador-ninez"
                      className="text-sm"
                    >
                      Niñez
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="benef-clasificador-adolescentesYJovenes"
                      name="clasificadorTematico.adolescentesYJovenes"
                      checked={
                        newBeneficioData.clasificadorTematico
                          .adolescentesYJovenes
                      }
                      onChange={handleBeneficioInputChange}
                      className="rounded border"
                    />
                    <label
                      htmlFor="benef-clasificador-adolescentesYJovenes"
                      className="text-sm"
                    >
                      Adolescentes y jóvenes
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="benef-clasificador-mujeres"
                      name="clasificadorTematico.mujeres"
                      checked={newBeneficioData.clasificadorTematico.mujeres}
                      onChange={handleBeneficioInputChange}
                      className="rounded border"
                    />
                    <label
                      htmlFor="benef-clasificador-mujeres"
                      className="text-sm"
                    >
                      Mujeres
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="benef-clasificador-adultos"
                      name="clasificadorTematico.adultos"
                      checked={newBeneficioData.clasificadorTematico.adultos}
                      onChange={handleBeneficioInputChange}
                      className="rounded border"
                    />
                    <label
                      htmlFor="benef-clasificador-adultos"
                      className="text-sm"
                    >
                      Adultos
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="benef-clasificador-adultosMayores"
                      name="clasificadorTematico.adultosMayores"
                      checked={
                        newBeneficioData.clasificadorTematico.adultosMayores
                      }
                      onChange={handleBeneficioInputChange}
                      className="rounded border"
                    />
                    <label
                      htmlFor="benef-clasificador-adultosMayores"
                      className="text-sm"
                    >
                      Adultos mayores
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="benef-clasificador-poblacionIndigena"
                      name="clasificadorTematico.poblacionIndigena"
                      checked={
                        newBeneficioData.clasificadorTematico.poblacionIndigena
                      }
                      onChange={handleBeneficioInputChange}
                      className="rounded border"
                    />
                    <label
                      htmlFor="benef-clasificador-poblacionIndigena"
                      className="text-sm"
                    >
                      Población indígena
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="benef-clasificador-personasConDiscapacidad"
                      name="clasificadorTematico.personasConDiscapacidad"
                      checked={
                        newBeneficioData.clasificadorTematico
                          .personasConDiscapacidad
                      }
                      onChange={handleBeneficioInputChange}
                      className="rounded border"
                    />
                    <label
                      htmlFor="benef-clasificador-personasConDiscapacidad"
                      className="text-sm"
                    >
                      Personas con discapacidad
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="benef-clasificador-poblacionMigrante"
                      name="clasificadorTematico.poblacionMigrante"
                      checked={
                        newBeneficioData.clasificadorTematico.poblacionMigrante
                      }
                      onChange={handleBeneficioInputChange}
                      className="rounded border"
                    />
                    <label
                      htmlFor="benef-clasificador-poblacionMigrante"
                      className="text-sm"
                    >
                      Población migrante
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="benef-clasificador-areasPrecarizadas"
                      name="clasificadorTematico.areasPrecarizadas"
                      checked={
                        newBeneficioData.clasificadorTematico.areasPrecarizadas
                      }
                      onChange={handleBeneficioInputChange}
                      className="rounded border"
                    />
                    <label
                      htmlFor="benef-clasificador-areasPrecarizadas"
                      className="text-sm"
                    >
                      Áreas precarizadas
                    </label>
                  </div>
                </div>
              </div>
              {/* Objeto */}
              <div className="col-span-2 border-t pt-4 mt-4">
                <h4 className="text-md font-medium text-gray-700 mb-2">
                  Objeto del Beneficio
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="benef-objeto-ingresosFamiliares"
                      name="objeto.ingresosFamiliares"
                      checked={newBeneficioData.objeto.ingresosFamiliares}
                      onChange={handleBeneficioInputChange}
                      className="rounded border"
                    />
                    <label
                      htmlFor="benef-objeto-ingresosFamiliares"
                      className="text-sm"
                    >
                      Ingresos familiares
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="benef-objeto-condicionesDeVivienda"
                      name="objeto.condicionesDeVivienda"
                      checked={newBeneficioData.objeto.condicionesDeVivienda}
                      onChange={handleBeneficioInputChange}
                      className="rounded border"
                    />
                    <label
                      htmlFor="benef-objeto-condicionesDeVivienda"
                      className="text-sm"
                    >
                      Condiciones de vivienda
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="benef-objeto-accesoAServiciosBasicos"
                      name="objeto.accesoAServiciosBasicos"
                      checked={newBeneficioData.objeto.accesoAServiciosBasicos}
                      onChange={handleBeneficioInputChange}
                      className="rounded border"
                    />
                    <label
                      htmlFor="benef-objeto-accesoAServiciosBasicos"
                      className="text-sm"
                    >
                      Acceso a servicios básicos
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="benef-objeto-nutricionYSalud"
                      name="objeto.nutricionYSalud"
                      checked={newBeneficioData.objeto.nutricionYSalud}
                      onChange={handleBeneficioInputChange}
                      className="rounded border"
                    />
                    <label
                      htmlFor="benef-objeto-nutricionYSalud"
                      className="text-sm"
                    >
                      Nutrición y salud
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="benef-objeto-educacionYHabilidadesLaborales"
                      name="objeto.educacionYHabilidadesLaborales"
                      checked={
                        newBeneficioData.objeto.educacionYHabilidadesLaborales
                      }
                      onChange={handleBeneficioInputChange}
                      className="rounded border"
                    />
                    <label
                      htmlFor="benef-objeto-educacionYHabilidadesLaborales"
                      className="text-sm"
                    >
                      Educación y habilidades laborales
                    </label>
                  </div>
                </div>
              </div>
              {/* Forma de Selección y Focalización */}
              <div className="col-span-2 border-t pt-4 mt-4">
                <h4 className="text-md font-medium text-gray-700 mb-2">
                  Forma de Selección y Focalización
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Forma de Selección */}
                  <div className="p-3">
                    <h5 className="font-medium text-sm mb-2">
                      Forma de Selección
                    </h5>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="benef-forma-censoORegistrosOficiales"
                          name="forma.censoORegistrosOficiales"
                          checked={
                            newBeneficioData.forma.censoORegistrosOficiales
                          }
                          onChange={handleBeneficioInputChange}
                          className="rounded border"
                        />
                        <label
                          htmlFor="benef-forma-censoORegistrosOficiales"
                          className="text-sm"
                        >
                          Censo o registros oficiales
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="benef-forma-autoseleccion"
                          name="forma.autoseleccion"
                          checked={newBeneficioData.forma.autoseleccion}
                          onChange={handleBeneficioInputChange}
                          className="rounded border"
                        />
                        <label
                          htmlFor="benef-forma-autoseleccion"
                          className="text-sm"
                        >
                          Autoselección
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="benef-forma-seleccionPorIntermediacion"
                          name="forma.seleccionPorIntermediacion"
                          checked={
                            newBeneficioData.forma.seleccionPorIntermediacion
                          }
                          onChange={handleBeneficioInputChange}
                          className="rounded border"
                        />
                        <label
                          htmlFor="benef-forma-seleccionPorIntermediacion"
                          className="text-sm"
                        >
                          Selección por intermediación
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="benef-forma-identificacionPorDemandaEspontanea"
                          name="forma.identificacionPorDemandaEspontanea"
                          checked={
                            newBeneficioData.forma
                              .identificacionPorDemandaEspontanea
                          }
                          onChange={handleBeneficioInputChange}
                          className="rounded border"
                        />
                        <label
                          htmlFor="benef-forma-identificacionPorDemandaEspontanea"
                          className="text-sm"
                        >
                          Identificación por demanda espontánea
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Focalización */}
                  <div className="p-3">
                    <h5 className="font-medium text-sm mb-2">Focalización</h5>
                    <div className="space-y-4">
                      {/* Geográfica */}
                      <div>
                        <h6 className="text-xs font-medium mb-1">Geográfica</h6>
                        <div className="space-y-2 ml-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="benef-focalizacion-municipiosConMayoresNivelesDePobreza"
                              name="focalizacion.geografica.municipiosConMayoresNivelesDePobreza"
                              checked={
                                newBeneficioData.focalizacion.geografica
                                  .municipiosConMayoresNivelesDePobreza
                              }
                              onChange={handleBeneficioInputChange}
                              className="rounded border"
                            />
                            <label
                              htmlFor="benef-focalizacion-municipiosConMayoresNivelesDePobreza"
                              className="text-sm"
                            >
                              Municipios con mayores niveles de pobreza
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="benef-focalizacion-comunidadesRuralesDeOfidicilAcceso"
                              name="focalizacion.geografica.comunidadesRuralesDeOfidicilAcceso"
                              checked={
                                newBeneficioData.focalizacion.geografica
                                  .comunidadesRuralesDeOfidicilAcceso
                              }
                              onChange={handleBeneficioInputChange}
                              className="rounded border"
                            />
                            <label
                              htmlFor="benef-focalizacion-comunidadesRuralesDeOfidicilAcceso"
                              className="text-sm"
                            >
                              Comunidades rurales de difícil acceso
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="benef-focalizacion-zonasUrbanoMarginales"
                              name="focalizacion.geografica.zonasUrbanoMarginales"
                              checked={
                                newBeneficioData.focalizacion.geografica
                                  .zonasUrbanoMarginales
                              }
                              onChange={handleBeneficioInputChange}
                              className="rounded border"
                            />
                            <label
                              htmlFor="benef-focalizacion-zonasUrbanoMarginales"
                              className="text-sm"
                            >
                              Zonas urbano marginales
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Demográfica */}
                      <div>
                        <h6 className="text-xs font-medium mb-1">
                          Demográfica
                        </h6>
                        <div className="space-y-2 ml-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="benef-focalizacion-segunGrupoEtarioGeneroYEtnia"
                              name="focalizacion.demografica.segunGrupoEtarioGeneroYEtnia"
                              checked={
                                newBeneficioData.focalizacion.demografica
                                  .segunGrupoEtarioGeneroYEtnia
                              }
                              onChange={handleBeneficioInputChange}
                              className="rounded border"
                            />
                            <label
                              htmlFor="benef-focalizacion-segunGrupoEtarioGeneroYEtnia"
                              className="text-sm"
                            >
                              Según grupo etario, género y etnia
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Socioeconómica */}
                      <div>
                        <h6 className="text-xs font-medium mb-1">
                          Socioeconómica
                        </h6>
                        <div className="space-y-2 ml-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="benef-focalizacion-basadoEnIngresosPerCapita"
                              name="focalizacion.socioeconomica.basadoEnIngresosPerCapita"
                              checked={
                                newBeneficioData.focalizacion.socioeconomica
                                  .basadoEnIngresosPerCapita
                              }
                              onChange={handleBeneficioInputChange}
                              className="rounded border"
                            />
                            <label
                              htmlFor="benef-focalizacion-basadoEnIngresosPerCapita"
                              className="text-sm"
                            >
                              Basado en ingresos per cápita
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="benef-focalizacion-basadoEnAccesoAServiciosBasicos"
                              name="focalizacion.socioeconomica.basadoEnAccesoAServiciosBasicos"
                              checked={
                                newBeneficioData.focalizacion.socioeconomica
                                  .basadoEnAccesoAServiciosBasicos
                              }
                              onChange={handleBeneficioInputChange}
                              className="rounded border"
                            />
                            <label
                              htmlFor="benef-focalizacion-basadoEnAccesoAServiciosBasicos"
                              className="text-sm"
                            >
                              Basado en acceso a servicios básicos
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Por Vulnerabilidad */}
                      <div>
                        <h6 className="text-xs font-medium mb-1">
                          Por Vulnerabilidad
                        </h6>
                        <div className="space-y-2 ml-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="benef-focalizacion-personasConNecesidadesUrgentes"
                              name="focalizacion.porVulnerabilidad.personasConNecesidadesUrgentes"
                              checked={
                                newBeneficioData.focalizacion.porVulnerabilidad
                                  .personasConNecesidadesUrgentes
                              }
                              onChange={handleBeneficioInputChange}
                              className="rounded border"
                            />
                            <label
                              htmlFor="benef-focalizacion-personasConNecesidadesUrgentes"
                              className="text-sm"
                            >
                              Personas con necesidades urgentes
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="benef-focalizacion-desplazadosVictimasDeViolencia"
                              name="focalizacion.porVulnerabilidad.desplazadosVictimasDeViolencia"
                              checked={
                                newBeneficioData.focalizacion.porVulnerabilidad
                                  .desplazadosVictimasDeViolencia
                              }
                              onChange={handleBeneficioInputChange}
                              className="rounded border"
                            />
                            <label
                              htmlFor="benef-focalizacion-desplazadosVictimasDeViolencia"
                              className="text-sm"
                            >
                              Desplazados víctimas de violencia
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Multidimensional */}
                      <div>
                        <h6 className="text-xs font-medium mb-1">
                          Multidimensional
                        </h6>
                        <div className="space-y-2 ml-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="benef-focalizacion-combinacionDeCriterios"
                              name="focalizacion.multidimensional.combinacionDeCriterios"
                              checked={
                                newBeneficioData.focalizacion.multidimensional
                                  .combinacionDeCriterios
                              }
                              onChange={handleBeneficioInputChange}
                              className="rounded border"
                            />
                            <label
                              htmlFor="benef-focalizacion-combinacionDeCriterios"
                              className="text-sm"
                            >
                              Combinación de criterios
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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

export const InterventionsManagementSection = () => {
  // State for form data
  const [newProgram, setNewProgram] = useState<Programme>({
    id: 0,
    institution: "",
    name: "",
    type: "individual",
    program_manager: "",
    admin_direction: "",
    email: "",
    phone: "",
    budget: "",
    product_name: "",
    program_name: "",
    program_description: "",
    program_objective: "",
    legal_framework: "",
    start_date: "",
    end_date: "",
    execution_year: new Date().getFullYear(),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Programme | null>(null);

  // Fetch programs
  const { data: programmes = [], isLoading: isLoadingPrograms } = useQuery({
    queryKey: ["programs"],
    queryFn: getPrograms,
    staleTime: 3 * 60 * 1000, // Data will be considered fresh for 3 minutes
  });

  const { data: benefits = [], isLoading: isLoadingBenefits } = useQuery({
    queryKey: ["benefits"],
    queryFn: getBenefits,
    staleTime: 3 * 60 * 1000, // Data will be considered fresh for 3 minutes
  });

  const [newBenefit, setNewBenefit] = useState<Benefit>({
    id: 0,
    budget: "",
    subproduct_name: "",
    short_name: "",
    description: "",
    objective: "",
    criteria: "",
    intervention_finality: "",
    social_atention: "",
    selection_and_focalization_form: "",
    temporality: "",
    type: "",
    target_population: "",
    intervention_objective: "",
  });
  const [editingBenefit, setEditingBenefit] = useState<Benefit | null>(null);
  const [benefitToDelete, setBenefitToDelete] = useState<Benefit | null>(null);

  // Handlers
  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await addProgram(newProgram);
    setIsLoading(false);
  };

  const handleEditProgram = async (updatedProgram: Programme) => {
    setIsLoading(true);
    await updateProgram(updatedProgram);
    setIsLoading(false);
  };

  const handleDeleteProgram = async (id: number) => {
    setIsLoading(true);
    await deleteProgram(id);
    setIsLoading(false);
  };

  const handleCreateBenefit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const benefitData: Benefit = {
      ...newBenefit,
    };
    await addBenefit(benefitData);
    setNewBenefit({
      id: 0,
      budget: "",
      subproduct_name: "",
      short_name: "",
      description: "",
      objective: "",
      criteria: "",
      intervention_finality: "",
      social_atention: "",
      selection_and_focalization_form: "",
      temporality: "",
      type: "",
      target_population: "",
      intervention_objective: "",
    });
    setIsLoading(false);
  };

  const handleEditBenefit = async (updatedBenefit: Benefit) => {
    setIsLoading(true);
    await updateBenefit(updatedBenefit);
    setIsLoading(false);
  };

  const handleDeleteBenefit = async (id: number) => {
    setIsLoading(true);
    await deleteBenefit(id);
    setIsLoading(false);
  };

  return (
    <div className="w-full h-full flex flex-col justify-start items-start gap-4">
      <h2 className="text-2xl font-bold text-[#505050]">
        Intervenciones / Mano a Mano
      </h2>
      <div className="w-full h-full flex flex-col justify-start items-start gap-4 bg-white p-4 rounded-lg">
        <Accordion type="multiple" className="w-full space-y-4">
          <AccordionItem value="item-1" className="border rounded-lg px-4">
            <AccordionTrigger className="py-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium text-[#505050]">
                  Gestión de Programas
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
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
                  <div className="flex flex-col col-span-2 gap-2">
                    <label htmlFor="budget" className="text-sm font-medium">
                      Partida Presupuestaria
                    </label>
                    <input
                      type="text"
                      id="budget"
                      value={newProgram.budget}
                      onChange={(e) =>
                        setNewProgram({
                          ...newProgram,
                          budget: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                      required
                    />
                  </div>
                  <div className="flex flex-col col-span-2 gap-2">
                    <label
                      htmlFor="product_name"
                      className="text-sm font-medium"
                    >
                      Nombre del Producto
                    </label>
                    <input
                      type="text"
                      id="product_name"
                      value={newProgram.product_name}
                      onChange={(e) =>
                        setNewProgram({
                          ...newProgram,
                          product_name: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                      required
                    />
                  </div>
                  <div className="flex flex-col col-span-2 gap-2">
                    <label
                      htmlFor="program_name"
                      className="text-sm font-medium"
                    >
                      Nombre del Programa
                    </label>
                    <input
                      type="text"
                      id="program_name"
                      value={newProgram.program_name}
                      onChange={(e) =>
                        setNewProgram({
                          ...newProgram,
                          program_name: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                      required
                    />
                  </div>
                  <div className="flex flex-col col-span-2 gap-2">
                    <label
                      htmlFor="program_description"
                      className="text-sm font-medium"
                    >
                      Descripción del Programa
                    </label>
                    <textarea
                      id="program_description"
                      value={newProgram.program_description}
                      onChange={(e) =>
                        setNewProgram({
                          ...newProgram,
                          program_description: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                      required
                    />
                  </div>
                  <div className="flex flex-col col-span-2 gap-2">
                    <label
                      htmlFor="program_objective"
                      className="text-sm font-medium"
                    >
                      Objetivo del Programa
                    </label>
                    <textarea
                      id="program_objective"
                      value={newProgram.program_objective}
                      onChange={(e) =>
                        setNewProgram({
                          ...newProgram,
                          program_objective: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                      required
                    />
                  </div>
                  <div className="flex flex-col col-span-2 gap-2">
                    <label
                      htmlFor="legal_framework"
                      className="text-sm font-medium"
                    >
                      Marco Legal
                    </label>
                    <textarea
                      id="legal_framework"
                      value={newProgram.legal_framework}
                      onChange={(e) =>
                        setNewProgram({
                          ...newProgram,
                          legal_framework: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                      required
                    />
                  </div>
                  <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="startDate"
                        className="text-sm font-medium"
                      >
                        Fecha de Inicio
                      </label>
                      <input
                        type="date"
                        id="start_date"
                        value={newProgram.start_date}
                        onChange={(e) =>
                          setNewProgram({
                            ...newProgram,
                            start_date: e.target.value,
                          })
                        }
                        className="rounded-md border p-2"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="endDate" className="text-sm font-medium">
                        Fecha de Finalización
                      </label>
                      <input
                        type="date"
                        id="end_date"
                        value={newProgram.end_date}
                        onChange={(e) =>
                          setNewProgram({
                            ...newProgram,
                            end_date: e.target.value,
                          })
                        }
                        className="rounded-md border p-2"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="executionYear"
                        className="text-sm font-medium"
                      >
                        Año de Ejecución
                      </label>
                      <input
                        type="number"
                        id="execution_year"
                        value={newProgram.execution_year}
                        onChange={(e) =>
                          setNewProgram({
                            ...newProgram,
                            execution_year: parseInt(e.target.value),
                          })
                        }
                        className="rounded-md border p-2"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-[#1c2851] text-white px-4 py-2 rounded-md hover:bg-[#1c2851]/80"
                  disabled={isLoading}
                >
                  {isLoading ? "Creando..." : "Crear Programa"}
                </button>
              </form>

              <div className="w-full overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Institución
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre del Programa
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Responsable
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Presupuesto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoadingPrograms ? (
                      <tr>
                        <td colSpan={5} className="text-center">
                          Cargando...
                        </td>
                      </tr>
                    ) : (
                      programmes.map((program: Programme) => (
                        <tr key={program.name}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {program.institution}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {program.program_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {program.program_manager}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {program.budget}
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
                              disabled={isLoading}
                            >
                              {isLoading && program.id === editingProgram?.id
                                ? "Eliminando..."
                                : "Eliminar"}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="border rounded-lg px-4">
            <AccordionTrigger className="py-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium text-[#505050]">
                  Gestión de beneficios
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <form onSubmit={handleCreateBenefit} className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col col-span-2 gap-2">
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

                  <div className="flex flex-col col-span-2 gap-2">
                    <label
                      htmlFor="subproductName"
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

                  <div className="flex flex-col col-span-2 gap-2">
                    <label htmlFor="shortName" className="text-sm font-medium">
                      Nombre Corto del Beneficio
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

                  <div className="flex flex-col col-span-2 gap-2">
                    <label
                      htmlFor="description"
                      className="text-sm font-medium"
                    >
                      Descripción del Beneficio
                    </label>
                    <textarea
                      id="description"
                      value={newBenefit.description}
                      onChange={(e) =>
                        setNewBenefit({
                          ...newBenefit,
                          description: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                      required
                    />
                  </div>

                  <div className="flex flex-col col-span-2 gap-2">
                    <label htmlFor="objective" className="text-sm font-medium">
                      Objetivo del Beneficio
                    </label>
                    <textarea
                      id="objective"
                      value={newBenefit.objective}
                      onChange={(e) =>
                        setNewBenefit({
                          ...newBenefit,
                          objective: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                      required
                    />
                  </div>

                  <div className="flex flex-col col-span-2 gap-2">
                    <label htmlFor="criteria" className="text-sm font-medium">
                      Criterio de Inclusión
                    </label>
                    <textarea
                      id="criteria"
                      value={newBenefit.criteria}
                      onChange={(e) =>
                        setNewBenefit({
                          ...newBenefit,
                          criteria: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="intervention_finality"
                      className="text-sm font-medium"
                    >
                      Finalidad de la Intervención
                    </label>
                    <select
                      id="intervention_finality"
                      value={newBenefit.intervention_finality}
                      onChange={(e) =>
                        setNewBenefit({
                          ...newBenefit,
                          intervention_finality: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                      required
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="Option1">Option1</option>
                      <option value="Option2">Option2</option>
                      <option value="Option3">Option3</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="social_atention"
                      className="text-sm font-medium"
                    >
                      Atención Social
                    </label>
                    <select
                      id="social_atention"
                      value={newBenefit.social_atention}
                      onChange={(e) =>
                        setNewBenefit({
                          ...newBenefit,
                          social_atention: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                      required
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="Option1">Option1</option>
                      <option value="Option2">Option2</option>
                      <option value="Option3">Option3</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="selectionAndFocalizationForm"
                      className="text-sm font-medium"
                    >
                      Forma de Selección y Focalización
                    </label>
                    <select
                      id="selection_and_focalization_form"
                      value={newBenefit.selection_and_focalization_form}
                      onChange={(e) =>
                        setNewBenefit({
                          ...newBenefit,
                          selection_and_focalization_form: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                      required
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="Option1">Option1</option>
                      <option value="Option2">Option2</option>
                      <option value="Option3">Option3</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="temporality"
                      className="text-sm font-medium"
                    >
                      Temporalidad
                    </label>
                    <select
                      id="temporality"
                      value={newBenefit.temporality}
                      onChange={(e) =>
                        setNewBenefit({
                          ...newBenefit,
                          temporality: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                      required
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="Option1">Option1</option>
                      <option value="Option2">Option2</option>
                      <option value="Option3">Option3</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="type" className="text-sm font-medium">
                      Tipo de Beneficio
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
                      <option value="">Seleccione una opción</option>
                      <option value="Option1">Option1</option>
                      <option value="Option2">Option2</option>
                      <option value="Option3">Option3</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="targetPopulation"
                      className="text-sm font-medium"
                    >
                      Población Objetivo
                    </label>
                    <select
                      id="target_population"
                      value={newBenefit.target_population}
                      onChange={(e) =>
                        setNewBenefit({
                          ...newBenefit,
                          target_population: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                      required
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="Option1">Option1</option>
                      <option value="Option2">Option2</option>
                      <option value="Option3">Option3</option>
                      <option value="Option4">Option4</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="interventionObjective"
                      className="text-sm font-medium"
                    >
                      Objeto Intervención
                    </label>
                    <select
                      id="intervention_objective"
                      value={newBenefit.intervention_objective}
                      onChange={(e) =>
                        setNewBenefit({
                          ...newBenefit,
                          intervention_objective: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                      required
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="Option1">Option1</option>
                      <option value="Option2">Option2</option>
                      <option value="Option3">Option3</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-[#1c2851] text-white px-4 py-2 rounded-md hover:bg-[#1c2851]/80"
                >
                  Crear Beneficio
                </button>
              </form>
              <div className="w-full overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                  <thead className="bg-gray-300">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subproducto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre Corto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Partida Presupuestaria
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoadingBenefits ? (
                      <tr>
                        <td colSpan={5} className="text-center">
                          Cargando...
                        </td>
                      </tr>
                    ) : (
                      benefits.map((benefit: Benefit) => (
                        <tr key={benefit.subproduct_name}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {benefit.subproduct_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {benefit.short_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {benefit.budget}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {benefit.description}
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
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="border rounded-lg px-4">
            <AccordionTrigger className="py-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium text-[#505050]">
                  Gestión de metas
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <GoalsSection />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4" className="border rounded-lg px-4">
            <AccordionTrigger className="py-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium text-[#505050]">
                  Gestión de Fichas, Programas y Beneficios (Institucional)
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              {/* Render the FichasSection which now handles Fichas, Programas, and Beneficios */}
              <FichasSection />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Dialog for editing program */}
        <Dialog
          open={!!editingProgram}
          onOpenChange={() => setEditingProgram(null)}
        >
          <DialogContent className="max-[80vw]">
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

                  <div className="flex flex-col gap-2">
                    <label htmlFor="edit-programName">
                      Nombre del Programa
                    </label>
                    <input
                      id="edit-program_name"
                      value={editingProgram.program_name}
                      onChange={(e) =>
                        setEditingProgram({
                          ...editingProgram,
                          program_name: e.target.value,
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
