import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import guatemalaJSON from "@/data/guatemala.json";
import { Programme } from "@/data/programme";
import {
  addProgram,
  updateProgram,
  deleteProgram,
  addBenefit,
  updateBenefit,
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
import FichasSection from "./FichasSection";
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
      setProgrammes([]);
    } catch (error) {
      console.error("Error fetching programs:", error);
    } finally {
      setIsLoadingPrograms(false);
    }
  };

  const fetchBenefits = async () => {
    setIsLoadingBenefits(true);
    try {
      setBenefits([]);
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
      case "interventions-table":
        return "Tabla de Intervenciones";
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
