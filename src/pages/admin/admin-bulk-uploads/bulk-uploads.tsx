import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { toast, useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import handleBulkUpload from "@/services/bulk-upload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import guatemalaJSON from "@/data/guatemala.json";
import CSVColumnMatcher from "./csv-column-matcher";
import parseCSV from "@/services/parsecsv";
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
  addInterventions,
  getInterventions,
  addInterventionsBulk,
} from "@/db/queries";
import { useQuery } from "@tanstack/react-query";
import { EntregaIntervenciones } from "@/data/intervention";

interface UploadSectionProps {
  title: string;
  description: string;
  uploadType: "interventions" | "goals" | "executions";
  onParseCSV?: (parsedCSV: any) => void;
}

const UploadSection = ({
  description,
  uploadType,
  onParseCSV,
}: UploadSectionProps) => {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    maxFiles: 1,
  });

  const handleUpload = async (
    type: "interventions" | "goals" | "executions"
  ) => {
    if (!file) return;
    if (type === "interventions") {
      const parsedCSV = await parseCSV(file);
      if (onParseCSV) {
        onParseCSV(parsedCSV);
      }
      return;
    }
    const response = await handleBulkUpload(file, type);
    if (response?.status === 200) {
      toast({
        title: "Carga exitosa",
        description: `El archivo ${file.name} ha sido cargado correctamente.`,
        className: "bg-green-50 border-green-200 text-green-800",
        duration: 3000,
      });
    } else {
      toast({
        title: "Error",
        description: `El archivo ${file.name} no pudo ser cargado.`,
        variant: "destructive",
        duration: 3000,
      });
    }
    setFile(null);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 whitespace-pre-line">{description}</p>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
          ${file ? "bg-green-50" : ""}`}
      >
        <input {...getInputProps()} />
        {file ? (
          <p className="text-green-600">Archivo seleccionado: {file.name}</p>
        ) : (
          <p>
            {isDragActive
              ? "Suelta el archivo aquí"
              : "Arrastra un archivo CSV o haz clic para seleccionar"}
          </p>
        )}
      </div>

      <Button
        onClick={() => handleUpload(uploadType)}
        disabled={!file}
        className="w-full bg-[#2f4489] hover:bg-[#2f4489]/80 text-white"
      >
        Subir archivo
      </Button>
      <Toaster />
    </div>
  );
};

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

const AdminBulkUploadsSection = () => {
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
  /*const { data: interventions = [], isLoading: isLoadingInterventions } =
    useQuery({
      queryKey: ["interventions"],
      queryFn: getInterventions,
      staleTime: 3 * 60 * 1000, // Data will be considered fresh for 3 minutes
    });*/

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
  const [parsedCSV, setParsedCSV] = useState<{
    columns: string[];
    data: { [key: string]: any }[];
  } | null>(null);

  const [selectedBornDepartment, setSelectedBornDepartment] =
    useState<string>("");
  const [selectedBornMunicipality, setSelectedBornMunicipality] =
    useState<string>("");
  const [availableBornMunicipalities, setAvailableBornMunicipalities] =
    useState<string[]>([]);
  const [selectedResidenceDepartment, setSelectedResidenceDepartment] =
    useState<string>("");
  const [selectedResidenceMunicipality, setSelectedResidenceMunicipality] =
    useState<string>("");
  const [
    availableResidenceMunicipalities,
    setAvailableResidenceMunicipalities,
  ] = useState<string[]>([]);
  const [selectedHandedDepartment, setSelectedHandedDepartment] =
    useState<string>("");
  const [selectedHandedMunicipality, setSelectedHandedMunicipality] =
    useState<string>("");
  const [availableHandedMunicipalities, setAvailableHandedMunicipalities] =
    useState<string[]>([]);

  // Update available municipalities when the department changes
  useEffect(() => {
    const department = guatemalaJSON.find(
      (dep) => dep.title === selectedBornDepartment
    );
    setAvailableBornMunicipalities(department ? department.mun : []);
  }, [selectedBornDepartment]);

  useEffect(() => {
    const municipality = availableBornMunicipalities.find(
      (mun) => mun === selectedBornMunicipality
    );
    setSelectedBornMunicipality(municipality || "");
  }, [availableBornMunicipalities, selectedBornMunicipality]);

  useEffect(() => {
    const department = guatemalaJSON.find(
      (dep) => dep.title === selectedResidenceDepartment
    );
    setAvailableResidenceMunicipalities(department ? department.mun : []);
  }, [selectedResidenceDepartment]);

  useEffect(() => {
    const municipality = availableResidenceMunicipalities.find(
      (mun) => mun === selectedResidenceMunicipality
    );
    setSelectedResidenceMunicipality(municipality || "");
  }, [availableResidenceMunicipalities, selectedResidenceMunicipality]);

  useEffect(() => {
    const department = guatemalaJSON.find(
      (dep) => dep.title === selectedHandedDepartment
    );
    setAvailableHandedMunicipalities(department ? department.mun : []);
  }, [selectedHandedDepartment]);

  useEffect(() => {
    const municipality = availableHandedMunicipalities.find(
      (mun) => mun === selectedHandedMunicipality
    );
    setSelectedHandedMunicipality(municipality || "");
  }, [availableHandedMunicipalities, selectedHandedMunicipality]);
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
  const handleParseCSV = (parsedCSV: {
    columns: string[];
    data: { [key: string]: any }[];
  }) => {
    console.log("parsedCSV", parsedCSV);
    setParsedCSV(parsedCSV);
  };
  const [newIntervention, setNewIntervention] = useState<EntregaIntervenciones>(
    {
      id: 0,
      id_hogar: -1,
      cui: "",
      apellido1: "",
      apellido2: "",
      apellido_de_casada: "",
      nombre1: "",
      nombre2: "",
      nombre3: "",
      sexo: -1,
      fecha_nacimiento: new Date(),
      departamento_nacimiento: -1,
      municipio_nacimiento: -1,
      pueblo_pertenencia: -1,
      comunidad_linguistica: -1,
      idioma: -1,
      trabaja: -1,
      telefono: "",
      escolaridad: -1,
      departamento_residencia: -1,
      municipio_residencia: -1,
      direccion_residencia: "",
      institucion: -1,
      programa: -1,
      beneficio: -1,
      departamento_otorgamiento: -1,
      municipio_otorgamiento: -1,
      fecha_otorgamiento: new Date(),
      valor: -1,
      discapacidad: -1,
    }
  );
  const handleCreateIntervention = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Use the single intervention data to create an intervention, not from the CSV
    const interventionData: EntregaIntervenciones = {
      ...newIntervention,
    };
    await addInterventions([interventionData]);
    setNewIntervention({
      id: 0,
      id_hogar: -1,
      cui: "",
      apellido1: "",
      apellido2: "",
      apellido_de_casada: "",
      nombre1: "",
      nombre2: "",
      nombre3: "",
      sexo: -1,
      fecha_nacimiento: new Date(),
      departamento_nacimiento: -1,
      municipio_nacimiento: -1,
      pueblo_pertenencia: -1,
      comunidad_linguistica: -1,
      idioma: -1,
      trabaja: -1,
      telefono: "",
      escolaridad: -1,
      departamento_residencia: -1,
      municipio_residencia: -1,
      direccion_residencia: "",
      institucion: -1,
      programa: -1,
      beneficio: -1,
      departamento_otorgamiento: -1,
      municipio_otorgamiento: -1,
      fecha_otorgamiento: new Date(),
      valor: -1,
      discapacidad: -1,
    });
    setIsLoading(false);
  };
  const handleCreateInterventions = async (columnMapping: {
    [key: string]: string;
  }) => {
    setIsLoading(true);
    // Set the column mapping as the headers of the CSV, changing accordingly the columnMapping
    const originalHeaders = Object.values(columnMapping);
    if (!originalHeaders) {
      toast({
        title: "Error al crear las intervenciones",
        description: "No se pudo obtener los headers del CSV",
      });
      setIsLoading(false);
      return;
    }
    const newHeaders = originalHeaders?.map((header) => {
      const key = Object.keys(columnMapping).find(
        (key) => columnMapping[key] === header
      );
      return key || header;
    });
    console.log("newHeaders", newHeaders);
    if (!newHeaders) {
      toast({
        title: "Error al crear las intervenciones",
        description: "No se pudo crear los headers del CSV",
      });
      setIsLoading(false);
      return;
    }
    const csvData = parsedCSV?.data.map((row) => {
      if (!newHeaders) return null;
      return newHeaders.map((header) => row[header]);
    });
    console.log("csvData", csvData);
    if (!csvData) {
      toast({
        title: "Error al crear las intervenciones",
      });
      setIsLoading(false);
      return;
    }
    // Convert csvData to a string first
    const csvString = csvData
      .map((row) => {
        const joinedRow = row?.join(",");
        return joinedRow;
      })
      .join("\n");

    const file = new File([csvString], "interventions.csv", {
      type: "text/csv",
    });
    const response = await addInterventionsBulk(file);
    if (response) {
      toast({
        title: "Intervenciones creadas correctamente",
      });
    } else {
      toast({
        title: "Error al crear las intervenciones",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full h-full flex flex-col justify-start items-start gap-4">
      <h2 className="text-2xl font-bold text-[#505050]">
        Carga de Datos / Mano a Mano
      </h2>
      <div className="w-full h-full flex flex-col justify-start items-start gap-4 bg-white p-4 rounded-lg">
        <Accordion type="multiple" className="w-full space-y-4">
          <AccordionItem value="item-1" className="border-2 rounded-lg px-4">
            <AccordionTrigger className="py-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium text-[#505050]">
                  Carga de entrega de intervenciones (CSV)
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <UploadSection
                title="Carga el archivo CSV con los datos de las intervenciones"
                description="El visualizador y asignador de columnas te permitirá verificar y asignar las columnas del archivo CSV a los campos de la base de datos."
                uploadType="interventions"
                onParseCSV={handleParseCSV}
              />
              {parsedCSV && (
                <CSVColumnMatcher
                  columns={parsedCSV.columns}
                  data={parsedCSV.data}
                  onClick={handleCreateInterventions}
                />
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="border-2 rounded-lg px-4">
            <AccordionTrigger className="py-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium text-[#505050]">
                  Carga de entrega de intervenciones (Individual)
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="flex flex-col gap-4">
                <form
                  action=""
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  onSubmit={handleCreateIntervention}
                >
                  <div className="flex flex-col gap-2">
                    <label htmlFor="id_hogar" className="text-sm font-medium">
                      ID Hogar
                    </label>
                    <input
                      type="text"
                      id="id_hogar"
                      className="rounded-md border p-2"
                      required
                      value={newIntervention.id_hogar}
                      onChange={(e) =>
                        setNewIntervention({
                          ...newIntervention,
                          id_hogar: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="institution"
                      className="text-sm font-medium"
                    >
                      Institución
                    </label>
                    <input
                      type="text"
                      id="institution"
                      className="rounded-md border p-2"
                      required
                      value={newIntervention.institucion}
                      onChange={(e) =>
                        setNewIntervention({
                          ...newIntervention,
                          institucion: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="cui" className="text-sm font-medium">
                      CUI
                    </label>
                    <input
                      type="text"
                      id="cui"
                      className="rounded-md border p-2"
                      required
                      value={newIntervention.cui}
                      onChange={(e) =>
                        setNewIntervention({
                          ...newIntervention,
                          cui: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="apellido1" className="text-sm font-medium">
                      Apellido 1
                    </label>
                    <input
                      type="text"
                      id="apellido1"
                      className="rounded-md border p-2"
                      required
                      value={newIntervention.apellido1}
                      onChange={(e) =>
                        setNewIntervention({
                          ...newIntervention,
                          apellido1: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="apellido2" className="text-sm font-medium">
                      Apellido 2
                    </label>
                    <input
                      type="text"
                      id="apellido2"
                      className="rounded-md border p-2"
                      required
                      value={newIntervention.apellido2}
                      onChange={(e) =>
                        setNewIntervention({
                          ...newIntervention,
                          apellido2: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="apellido_de_casada"
                      className="text-sm font-medium"
                    >
                      Apellido de Casada
                    </label>
                    <input
                      type="text"
                      id="apellido_de_casada"
                      className="rounded-md border p-2"
                      required
                      value={newIntervention.apellido_de_casada}
                      onChange={(e) =>
                        setNewIntervention({
                          ...newIntervention,
                          apellido_de_casada: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="nombre1" className="text-sm font-medium">
                      Nombre 1
                    </label>
                    <input
                      type="text"
                      id="nombre1"
                      className="rounded-md border p-2"
                      required
                      value={newIntervention.nombre1}
                      onChange={(e) =>
                        setNewIntervention({
                          ...newIntervention,
                          nombre1: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="nombre2" className="text-sm font-medium">
                      Nombre 2
                    </label>
                    <input
                      type="text"
                      id="nombre2"
                      className="rounded-md border p-2"
                      required
                      value={newIntervention.nombre2}
                      onChange={(e) =>
                        setNewIntervention({
                          ...newIntervention,
                          nombre2: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="nombre3" className="text-sm font-medium">
                      Nombre 3
                    </label>
                    <input
                      type="text"
                      id="nombre3"
                      className="rounded-md border p-2"
                      required
                      value={newIntervention.nombre3}
                      onChange={(e) =>
                        setNewIntervention({
                          ...newIntervention,
                          nombre3: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="sexo" className="text-sm font-medium">
                      Sexo
                    </label>
                    <select
                      id="sexo"
                      className="rounded-md border p-2"
                      required
                      value={newIntervention.sexo}
                      onChange={(e) =>
                        setNewIntervention({
                          ...newIntervention,
                          sexo: parseInt(e.target.value),
                        })
                      }
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="0">Masculino</option>
                      <option value="1">Femenino</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="fecha_nacimiento"
                      className="text-sm font-medium"
                    >
                      Fecha de Nacimiento
                    </label>
                    <input
                      type="date"
                      id="fecha_nacimiento"
                      className="rounded-md border p-2"
                      required
                      value={
                        newIntervention.fecha_nacimiento
                          .toISOString()
                          .split("T")[0]
                      }
                      onChange={(e) =>
                        setNewIntervention({
                          ...newIntervention,
                          fecha_nacimiento: new Date(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="departamento_nacimiento"
                      className="text-sm font-medium"
                    >
                      Departamento de Nacimiento
                    </label>
                    <select
                      id="departamento_nacimiento"
                      value={selectedBornDepartment}
                      onChange={(e) => {
                        setSelectedBornDepartment(e.target.value);
                        setNewIntervention({
                          ...newIntervention,
                          departamento_nacimiento: parseInt(e.target.value),
                        });
                      }}
                      className="rounded-md border p-2"
                      required
                    >
                      <option value="">Seleccione un departamento</option>
                      {guatemalaJSON.map((dep, index) => (
                        <option key={index} value={index}>
                          {dep.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="municipio_nacimiento"
                      className="text-sm font-medium"
                    >
                      Municipio de Nacimiento
                    </label>
                    <select
                      id="municipio_nacimiento"
                      className="rounded-md border p-2"
                      disabled={!selectedBornDepartment}
                      value={selectedBornMunicipality}
                      onChange={(e) => {
                        setSelectedBornMunicipality(e.target.value);
                        setNewIntervention({
                          ...newIntervention,
                          municipio_nacimiento: parseInt(e.target.value),
                        });
                      }}
                      required
                    >
                      <option value="">Seleccione un municipio</option>
                      {availableBornMunicipalities.map((mun, index) => (
                        <option key={index} value={index}>
                          {mun}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="pueblo_pertenencia"
                      className="text-sm font-medium"
                    >
                      Pueblo de Pertenencia
                    </label>
                    <select
                      id="pueblo_pertenencia"
                      className="rounded-md border p-2"
                      required
                      value={newIntervention.pueblo_pertenencia}
                      onChange={(e) =>
                        setNewIntervention({
                          ...newIntervention,
                          pueblo_pertenencia: parseInt(e.target.value),
                        })
                      }
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="0">Maya</option>
                      <option value="1">Garifuna</option>
                      <option value="2">Xinka</option>
                      <option value="3">
                        Afrodescendiente / Creole / Afromestizo
                      </option>
                      <option value="4">Ladina(o)</option>
                      <option value="5">Extranjera(o)</option>
                      <option value="6">Sin información</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="comunidad_linguistica"
                      className="text-sm font-medium"
                    >
                      Comunidad Lingüística
                    </label>
                    <select
                      id="comunidad_linguistica"
                      className="rounded-md border p-2"
                      required
                      value={newIntervention.comunidad_linguistica}
                      onChange={(e) =>
                        setNewIntervention({
                          ...newIntervention,
                          comunidad_linguistica: parseInt(e.target.value),
                        })
                      }
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="0">Achi</option>
                      <option value="1">Akateka</option>
                      <option value="2">Awakateka</option>
                      <option value="3">Ch'orti'</option>
                      <option value="4">Chalchiteka</option>
                      <option value="5">Chuj</option>
                      <option value="6">Itza'</option>
                      <option value="7">Ixil</option>
                      <option value="8">Jakalteka/Popti'</option>
                      <option value="9">K'iche'</option>
                      <option value="10">Kaqchikel</option>
                      <option value="11">Mam</option>
                      <option value="12">Mopan</option>
                      <option value="13">Poqoman</option>
                      <option value="14">Poqomchi'</option>
                      <option value="15">Q'anjob'al</option>
                      <option value="16">Q'eqchi'</option>
                      <option value="17">Sakapulteka</option>
                      <option value="18">Sipakapense</option>
                      <option value="19">Tektiteka</option>
                      <option value="20">Tz'utujil</option>
                      <option value="21">Uspanteka</option>
                      <option value="22">No aplica</option>
                      <option value="23">Sin información</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="idioma" className="text-sm font-medium">
                      Idioma
                    </label>
                    <select
                      id="idioma"
                      className="rounded-md border p-2"
                      required
                      value={newIntervention.idioma}
                      onChange={(e) =>
                        setNewIntervention({
                          ...newIntervention,
                          idioma: parseInt(e.target.value),
                        })
                      }
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="0">Achi</option>
                      <option value="1">Akateka</option>
                      <option value="2">Awakateka</option>
                      <option value="3">Ch'orti'</option>
                      <option value="4">Chalchiteko</option>
                      <option value="5">Chuj</option>
                      <option value="6">Itza'</option>
                      <option value="7">Ixil</option>
                      <option value="8">Jakalteka/Popti'</option>
                      <option value="9">K'iche'</option>
                      <option value="10">Kaqchikel</option>
                      <option value="11">Mam</option>
                      <option value="12">Mopan</option>
                      <option value="13">Poqomam</option>
                      <option value="14">Poqomchi'</option>
                      <option value="15">Q'anjob'al</option>
                      <option value="16">Q'eqchi'</option>
                      <option value="17">Sakapulteko</option>
                      <option value="18">Sipakapense</option>
                      <option value="19">Tektiteko</option>
                      <option value="20">Tz'utujil</option>
                      <option value="21">Uspanteko</option>
                      <option value="22">Xinka</option>
                      <option value="23">Garifuna</option>
                      <option value="24">Español</option>
                      <option value="25">Inglés</option>
                      <option value="26">Señas</option>
                      <option value="27">Otro idioma</option>
                      <option value="28">No habla</option>
                      <option value="29">Sin Información</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="trabaja" className="text-sm font-medium">
                      Trabaja
                    </label>
                    <select
                      id="trabaja"
                      className="rounded-md border p-2"
                      required
                      value={newIntervention.trabaja}
                      onChange={(e) =>
                        setNewIntervention({
                          ...newIntervention,
                          trabaja: parseInt(e.target.value),
                        })
                      }
                    >
                      <option value="0">Si</option>
                      <option value="1">No</option>
                      <option value="2">Sin Información</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="telefono" className="text-sm font-medium">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      id="telefono"
                      className="rounded-md border p-2"
                      required
                      value={newIntervention.telefono}
                      onChange={(e) =>
                        setNewIntervention({
                          ...newIntervention,
                          telefono: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="escolaridad"
                      className="text-sm font-medium"
                    >
                      Escolaridad
                    </label>
                    <select
                      id="escolaridad"
                      className="rounded-md border p-2"
                      required
                      value={newIntervention.escolaridad}
                      onChange={(e) =>
                        setNewIntervention({
                          ...newIntervention,
                          escolaridad: parseInt(e.target.value),
                        })
                      }
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="0">Ninguno</option>
                      <option value="1">Preprimaria</option>
                      <option value="2">Primaria</option>
                      <option value="3">Básico</option>
                      <option value="4">Diversificado</option>
                      <option value="5">Superior</option>
                      <option value="6">Maestría</option>
                      <option value="7">Doctorado</option>
                      <option value="8">Sin Información</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="departamento_residencia"
                      className="text-sm font-medium"
                    >
                      Departamento de Residencia
                    </label>
                    <select
                      id="departamento_residencia"
                      value={selectedResidenceDepartment}
                      onChange={(e) => {
                        setSelectedResidenceDepartment(e.target.value);
                        setNewIntervention({
                          ...newIntervention,
                          departamento_residencia: parseInt(e.target.value),
                        });
                      }}
                      className="rounded-md border p-2"
                      required
                    >
                      <option value="">Seleccione un departamento</option>
                      {guatemalaJSON.map((dep, index) => (
                        <option key={index} value={index}>
                          {dep.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="municipio_residencia"
                      className="text-sm font-medium"
                    >
                      Municipio de Residencia
                    </label>
                    <select
                      id="municipio_residencia"
                      value={selectedResidenceMunicipality}
                      onChange={(e) => {
                        setSelectedResidenceMunicipality(e.target.value);
                        setNewIntervention({
                          ...newIntervention,
                          municipio_residencia: parseInt(e.target.value),
                        });
                      }}
                      className="rounded-md border p-2"
                      disabled={!selectedResidenceDepartment}
                      required
                    >
                      <option value="">Seleccione un municipio</option>
                      {availableResidenceMunicipalities.map((mun, index) => (
                        <option key={index} value={index}>
                          {mun}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="direccion_residencia"
                      className="text-sm font-medium"
                    >
                      Dirección de Residencia
                    </label>
                    <input
                      type="text"
                      id="direccion_residencia"
                      value={newIntervention.direccion_residencia}
                      onChange={(e) =>
                        setNewIntervention({
                          ...newIntervention,
                          direccion_residencia: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="programa" className="text-sm font-medium">
                      Programa
                    </label>
                    <select
                      id="programa"
                      value={newIntervention.programa}
                      onChange={(e) =>
                        setNewIntervention({
                          ...newIntervention,
                          programa: parseInt(e.target.value),
                        })
                      }
                      className="rounded-md border p-2"
                    >
                      <option value="">Seleccione un programa</option>
                      {programmes.map((programme: Programme, index: number) => (
                        <option key={index} value={index}>
                          {programme.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="beneficio" className="text-sm font-medium">
                      Beneficio
                    </label>
                    <select
                      id="beneficio"
                      value={newIntervention.beneficio}
                      onChange={(e) =>
                        setNewIntervention({
                          ...newIntervention,
                          beneficio: parseInt(e.target.value),
                        })
                      }
                      className="rounded-md border p-2"
                    >
                      <option value="">Seleccione un beneficio</option>
                      {benefits.map((benefit: Benefit, index: number) => (
                        <option key={index} value={index}>
                          {benefit.short_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="departamento_otorgamiento"
                      className="text-sm font-medium"
                    >
                      Departamento de Otorgamiento
                    </label>
                    <select
                      id="departamento_otorgamiento"
                      value={selectedHandedDepartment}
                      onChange={(e) => {
                        setSelectedHandedDepartment(e.target.value);
                        setNewIntervention({
                          ...newIntervention,
                          departamento_otorgamiento: parseInt(e.target.value),
                        });
                      }}
                      className="rounded-md border p-2"
                      required
                    >
                      <option value="">Seleccione un departamento</option>
                      {guatemalaJSON.map((dep, index) => (
                        <option key={index} value={index}>
                          {dep.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="municipio_otorgamiento"
                      className="text-sm font-medium"
                    >
                      Municipio de Otorgamiento
                    </label>
                    <select
                      id="municipio_otorgamiento"
                      value={selectedHandedMunicipality}
                      onChange={(e) => {
                        setSelectedHandedMunicipality(e.target.value);
                        setNewIntervention({
                          ...newIntervention,
                          municipio_otorgamiento: parseInt(e.target.value),
                        });
                      }}
                      disabled={!selectedHandedDepartment}
                      className="rounded-md border p-2"
                      required
                    >
                      <option value="">Seleccione un municipio</option>
                      {availableHandedMunicipalities.map((mun, index) => (
                        <option key={index} value={index}>
                          {mun}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="fecha_otorgamiento"
                      className="text-sm font-medium"
                    >
                      Fecha de Otorgamiento
                    </label>
                    <input
                      type="date"
                      id="fecha_otorgamiento"
                      value={
                        newIntervention.fecha_otorgamiento
                          ?.toISOString()
                          .split("T")[0]
                      }
                      onChange={(e) =>
                        setNewIntervention({
                          ...newIntervention,
                          fecha_otorgamiento: new Date(e.target.value),
                        })
                      }
                      className="rounded-md border p-2"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="valor" className="text-sm font-medium">
                      Valor
                    </label>
                    <input
                      type="number"
                      id="valor"
                      value={newIntervention.valor}
                      onChange={(e) =>
                        setNewIntervention({
                          ...newIntervention,
                          valor: parseInt(e.target.value),
                        })
                      }
                      className="rounded-md border p-2"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="discapacidad"
                      className="text-sm font-medium"
                    >
                      Discapacidad
                    </label>
                    <select
                      name=""
                      id="discapacidad"
                      value={newIntervention.discapacidad}
                      onChange={(e) =>
                        setNewIntervention({
                          ...newIntervention,
                          discapacidad: parseInt(e.target.value),
                        })
                      }
                      className="rounded-md border p-2"
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="0">No</option>
                      <option value="1">Sí</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="bg-[#1c2851] h-3/5 self-end text-white px-4 rounded-md hover:bg-[#1c2851]/80"
                  >
                    Crear
                  </button>
                </form>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="border-2 rounded-lg px-4">
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
          <AccordionItem value="item-6" className="border rounded-lg px-4">
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
          <AccordionItem value="item-4" className="border rounded-lg px-4">
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

          <AccordionItem value="item-5" className="border rounded-lg px-4">
            <AccordionTrigger className="py-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium text-[#505050]">
                  Carga de ejecuciones
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <UploadSection
                title="Carga de ejecuciones"
                description={`El archivo CSV debe contener las siguientes columnas:

                  - Departamento (departamento)
                  - Municipio (municipio)
                  - Lugar poblado (lugar_poblado)
                  - Institución (institucion)
                  - Tipo de intervención (tipo_intervencion)
                  - Intervención (intervencion)
                  - Fecha de ejecución (fecha_ejecucion)
                  - Costo (costo) - valor numérico`}
                uploadType="executions"
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

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

                  <div className="flex flex-col gap-2">
                    <label htmlFor="edit-type">Tipo</label>
                    <select
                      id="edit-type"
                      value={editingProgram.type}
                      onChange={(e) =>
                        setEditingProgram({
                          ...editingProgram,
                          type: e.target.value as Programme["type"],
                        })
                      }
                      className="rounded-md border p-2"
                    >
                      <option value="individual">Individual</option>
                      <option value="home">Hogar</option>
                      <option value="communitary">Comunitaria</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="edit-programManager">Responsable</label>
                    <input
                      id="edit-program_manager"
                      value={editingProgram.program_manager}
                      onChange={(e) =>
                        setEditingProgram({
                          ...editingProgram,
                          program_manager: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="edit-adminDirection">
                      Dirección Administrativa
                    </label>
                    <input
                      id="edit-admin_direction"
                      value={editingProgram.admin_direction}
                      onChange={(e) =>
                        setEditingProgram({
                          ...editingProgram,
                          admin_direction: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="edit-email">Correo Electrónico</label>
                    <input
                      type="email"
                      id="edit-email"
                      value={editingProgram.email}
                      onChange={(e) =>
                        setEditingProgram({
                          ...editingProgram,
                          email: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="edit-phone">Teléfono</label>
                    <input
                      id="edit-phone"
                      value={editingProgram.phone}
                      onChange={(e) =>
                        setEditingProgram({
                          ...editingProgram,
                          phone: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="edit-budget">Presupuesto</label>
                    <input
                      type="number"
                      id="edit-budget"
                      value={editingProgram.budget}
                      onChange={(e) =>
                        setEditingProgram({
                          ...editingProgram,
                          budget: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="edit-productName">
                      Nombre del Producto
                    </label>
                    <input
                      id="edit-product_name"
                      value={editingProgram.product_name}
                      onChange={(e) =>
                        setEditingProgram({
                          ...editingProgram,
                          product_name: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="edit-programDescription">
                      Descripción del Programa
                    </label>
                    <textarea
                      id="edit-program_description"
                      value={editingProgram.program_description}
                      onChange={(e) =>
                        setEditingProgram({
                          ...editingProgram,
                          program_description: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="edit-programObjective">
                      Objetivo del Programa
                    </label>
                    <textarea
                      id="edit-program_objective"
                      value={editingProgram.program_objective}
                      onChange={(e) =>
                        setEditingProgram({
                          ...editingProgram,
                          program_objective: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="edit-legalFramework">Marco Legal</label>
                    <textarea
                      id="edit-legal_framework"
                      value={editingProgram.legal_framework}
                      onChange={(e) =>
                        setEditingProgram({
                          ...editingProgram,
                          legal_framework: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="edit-startDate">Fecha de Inicio</label>
                    <input
                      type="date"
                      id="edit-start_date"
                      value={editingProgram.start_date}
                      onChange={(e) =>
                        setEditingProgram({
                          ...editingProgram,
                          start_date: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="edit-endDate">Fecha de Finalización</label>
                    <input
                      type="date"
                      id="edit-end_date"
                      value={editingProgram.end_date}
                      onChange={(e) =>
                        setEditingProgram({
                          ...editingProgram,
                          end_date: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="edit-executionYear">Año de Ejecución</label>
                    <input
                      type="number"
                      id="edit-execution_year"
                      value={editingProgram.execution_year}
                      onChange={(e) =>
                        setEditingProgram({
                          ...editingProgram,
                          execution_year: parseInt(e.target.value),
                        })
                      }
                      className="rounded-md border p-2"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <button
                    type="submit"
                    className="bg-[#1c2851] text-white px-4 py-2 rounded-md hover:bg-[#1c2851]/80"
                    disabled={isLoading}
                  >
                    {isLoading ? "Guardando..." : "Guardar Cambios"}
                  </button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
        <Dialog
          open={!!editingBenefit}
          onOpenChange={() => setEditingBenefit(null)}
        >
          <DialogContent className="max-w-4xl">
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
                      type="text"
                      id="edit-budget"
                      value={editingBenefit?.budget || ""}
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
                    <label htmlFor="edit-subproductName">
                      Nombre del Subproducto
                    </label>
                    <input
                      type="text"
                      id="edit-subproduct_name"
                      value={editingBenefit?.subproduct_name || ""}
                      onChange={(e) =>
                        setEditingBenefit({
                          ...editingBenefit,
                          subproduct_name: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="edit-short_name">Nombre Corto</label>
                    <input
                      type="text"
                      id="edit-short_name"
                      value={editingBenefit?.short_name || ""}
                      onChange={(e) =>
                        setEditingBenefit({
                          ...editingBenefit,
                          short_name: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="edit-description">Descripción</label>
                    <textarea
                      id="edit-description"
                      value={editingBenefit?.description || ""}
                      onChange={(e) =>
                        setEditingBenefit({
                          ...editingBenefit,
                          description: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="edit-objective">Objetivo</label>
                    <textarea
                      id="edit-objective"
                      value={editingBenefit?.objective || ""}
                      onChange={(e) =>
                        setEditingBenefit({
                          ...editingBenefit,
                          objective: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="edit-criteria">Criterio</label>
                    <textarea
                      id="edit-criteria"
                      value={editingBenefit?.criteria || ""}
                      onChange={(e) =>
                        setEditingBenefit({
                          ...editingBenefit,
                          criteria: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="edit-interventionFinality">
                      Finalidad de la Intervención
                    </label>
                    <select
                      id="edit-intervention_finality"
                      value={editingBenefit?.intervention_finality || ""}
                      onChange={(e) =>
                        setEditingBenefit({
                          ...editingBenefit,
                          intervention_finality: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="option1">Opción 1</option>
                      <option value="option2">Opción 2</option>
                      <option value="option3">Opción 3</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="edit-socialAtention">Atención Social</label>
                    <select
                      id="edit-social_atention"
                      value={editingBenefit?.social_atention || ""}
                      onChange={(e) =>
                        setEditingBenefit({
                          ...editingBenefit,
                          social_atention: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="option1">Opción 1</option>
                      <option value="option2">Opción 2</option>
                      <option value="option3">Opción 3</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="edit-selectionAndFocalizationForm">
                      Forma de Selección y Focalización
                    </label>
                    <select
                      id="edit-selection_and_focalization_form"
                      value={
                        editingBenefit?.selection_and_focalization_form || ""
                      }
                      onChange={(e) =>
                        setEditingBenefit({
                          ...editingBenefit,
                          selection_and_focalization_form: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="option1">Opción 1</option>
                      <option value="option2">Opción 2</option>
                      <option value="option3">Opción 3</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="edit-temporality">Temporalidad</label>
                    <select
                      id="edit-temporality"
                      value={editingBenefit?.temporality || ""}
                      onChange={(e) =>
                        setEditingBenefit({
                          ...editingBenefit,
                          temporality: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="option1">Opción 1</option>
                      <option value="option2">Opción 2</option>
                      <option value="option3">Opción 3</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="edit-type">Tipo</label>
                    <select
                      id="edit-type"
                      value={editingBenefit?.type || ""}
                      onChange={(e) =>
                        setEditingBenefit({
                          ...editingBenefit,
                          type: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="option1">Opción 1</option>
                      <option value="option2">Opción 2</option>
                      <option value="option3">Opción 3</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="edit-targetPopulation">
                      Población Objetivo
                    </label>
                    <select
                      id="edit-target_population"
                      value={editingBenefit?.target_population || ""}
                      onChange={(e) =>
                        setEditingBenefit({
                          ...editingBenefit,
                          target_population: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="option1">Opción 1</option>
                      <option value="option2">Opción 2</option>
                      <option value="option3">Opción 3</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="edit-interventionObjective">
                      Objetivo de la Intervención
                    </label>
                    <select
                      id="edit-intervention_objective"
                      value={editingBenefit?.intervention_objective || ""}
                      onChange={(e) =>
                        setEditingBenefit({
                          ...editingBenefit,
                          intervention_objective: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="option1">Opción 1</option>
                      <option value="option2">Opción 2</option>
                      <option value="option3">Opción 3</option>
                    </select>
                  </div>
                </div>

                <DialogFooter>
                  <button
                    type="submit"
                    className="bg-[#1c2851] text-white px-4 py-2 rounded-md hover:bg-[#1c2851]/80"
                  >
                    Guardar Cambios
                  </button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
        <Dialog
          open={!!benefitToDelete}
          onOpenChange={() => setBenefitToDelete(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmación de Eliminación</DialogTitle>
              <DialogDescription>
                Esta acción eliminará permanentemente el beneficio "
                <span className="font-bold">
                  {benefitToDelete?.subproduct_name}
                </span>
                " de la partida presupuestaria "
                <span className="font-bold">{benefitToDelete?.budget}</span>.
                Esta acción no se puede deshacer.
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
                onClick={() =>
                  benefitToDelete && handleDeleteBenefit(benefitToDelete.id)
                }
                className="bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Eliminar
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminBulkUploadsSection;
