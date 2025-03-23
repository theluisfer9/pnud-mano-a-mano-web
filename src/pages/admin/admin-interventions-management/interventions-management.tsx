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
        </Accordion>

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
