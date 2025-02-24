import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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

interface Intervention {
  id: string;
  institution: string;
  name: string;
  type: "individual" | "home" | "communitary";
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
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [editingIntervention, setEditingIntervention] =
    useState<Intervention | null>(null);
  const [interventionToDelete, setInterventionToDelete] =
    useState<Intervention | null>(null);
  const [newIntervention, setNewIntervention] = useState<
    Omit<Intervention, "id">
  >({
    institution: "",
    name: "",
    type: "individual",
  });
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
  const handleCreateIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    const interventionData: Intervention = {
      id: crypto.randomUUID(),
      ...newIntervention,
    };
    setInterventions([...interventions, interventionData]);
    setNewIntervention({
      institution: "",
      name: "",
      type: "individual",
    });
  };

  const handleEditIntervention = (updatedIntervention: Intervention) => {
    setInterventions(
      interventions.map((intervention) =>
        intervention.id === updatedIntervention.id
          ? updatedIntervention
          : intervention
      )
    );
    setEditingIntervention(null);
  };

  const handleDeleteIntervention = (intervention: Intervention) => {
    setInterventions(interventions.filter((i) => i.id !== intervention.id));
    setInterventionToDelete(null);
  };

  const handleParseCSV = (parsedCSV: {
    columns: string[];
    data: { [key: string]: any }[];
  }) => {
    console.log("parsedCSV", parsedCSV);
    setParsedCSV(parsedCSV);
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
                >
                  <div className="flex flex-col gap-2">
                    <label htmlFor="id_hogar" className="text-sm font-medium">
                      ID Hogar
                    </label>
                    <input
                      type="text"
                      id="id_hogar"
                      className="rounded-md border p-2"
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
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
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
                      onChange={(e) =>
                        setSelectedBornDepartment(e.target.value)
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
                      onChange={(e) =>
                        setSelectedBornMunicipality(e.target.value)
                      }
                      required
                    >
                      <option value="">Seleccione un municipio</option>
                      {availableBornMunicipalities.map((mun) => (
                        <option key={mun} value={mun}>
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
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="Maya">Maya</option>
                      <option value="Garifuna">Garifuna</option>
                      <option value="Xinka">Xinka</option>
                      <option value="Afrodescendiente / Creole / Afromestizo">
                        Afrodescendiente / Creole / Afromestizo
                      </option>
                      <option value="Ladina(o)">Ladina(o)</option>
                      <option value="Extranjera(o)">Extranjera(o)</option>
                      <option value="Sin información">Sin información</option>
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
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="Achi">Achi</option>
                      <option value="Akateka">Akateka</option>
                      <option value="Awakateka">Awakateka</option>
                      <option value="Ch'orti'">Ch'orti'</option>
                      <option value="Chalchiteka">Chalchiteka</option>
                      <option value="Chuj">Chuj</option>
                      <option value="Itza'">Itza'</option>
                      <option value="Ixil">Ixil</option>
                      <option value="Jakalteka/Popti'">Jakalteka/Popti'</option>
                      <option value="K'iche'">K'iche'</option>
                      <option value="Kaqchikel">Kaqchikel</option>
                      <option value="Mam">Mam</option>
                      <option value="Mopan">Mopan</option>
                      <option value="Poqoman">Poqoman</option>
                      <option value="Poqomchi'">Poqomchi'</option>
                      <option value="Q'anjob'al">Q'anjob'al</option>
                      <option value="Q'eqchi'">Q'eqchi'</option>
                      <option value="Sakapulteka">Sakapulteka</option>
                      <option value="Sipakapense">Sipakapense</option>
                      <option value="Tektiteka">Tektiteka</option>
                      <option value="Tz'utujil">Tz'utujil</option>
                      <option value="Uspanteka">Uspanteka</option>
                      <option value="No aplica">No aplica</option>
                      <option value="Sin información">Sin información</option>
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
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="Achi">Achi</option>
                      <option value="Akateka">Akateka</option>
                      <option value="Awakateka">Awakateka</option>
                      <option value="Ch'orti'">Ch'orti'</option>
                      <option value="Chalchiteko">Chalchiteko</option>
                      <option value="Chuj">Chuj</option>
                      <option value="Itza'">Itza'</option>
                      <option value="Ixil">Ixil</option>
                      <option value="Jakalteka/Popti'">Jakalteka/Popti'</option>
                      <option value="K'iche'">K'iche'</option>
                      <option value="Kaqchikel">Kaqchikel</option>
                      <option value="Mam">Mam</option>
                      <option value="Mopan">Mopan</option>
                      <option value="Poqomam">Poqomam</option>
                      <option value="Poqomchi'">Poqomchi'</option>
                      <option value="Q'anjob'al">Q'anjob'al</option>
                      <option value="Q'eqchi'">Q'eqchi'</option>
                      <option value="Sakapulteko">Sakapulteko</option>
                      <option value="Sipakapense">Sipakapense</option>
                      <option value="Tektiteko">Tektiteko</option>
                      <option value="Tz'utujil">Tz'utujil</option>
                      <option value="Uspanteko">Uspanteko</option>
                      <option value="Xinka">Xinka</option>
                      <option value="Garifuna">Garifuna</option>
                      <option value="Español">Español</option>
                      <option value="Inglés">Inglés</option>
                      <option value="Señas">Señas</option>
                      <option value="Otro idioma">Otro idioma</option>
                      <option value="No habla">No habla</option>
                      <option value="Sin Información">Sin Información</option>
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
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="Si">Si</option>
                      <option value="No">No</option>
                      <option value="Sin Información">Sin Información</option>
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
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="Ninguno">Ninguno</option>
                      <option value="Preprimaria">Preprimaria</option>
                      <option value="Primaria">Primaria</option>
                      <option value="Básico">Básico</option>
                      <option value="Diversificado">Diversificado</option>
                      <option value="Superior">Superior</option>
                      <option value="Maestría">Maestría</option>
                      <option value="Doctorado">Doctorado</option>
                      <option value="Sin Información">Sin Información</option>
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
                      onChange={(e) =>
                        setSelectedResidenceDepartment(e.target.value)
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
                      onChange={(e) =>
                        setSelectedResidenceMunicipality(e.target.value)
                      }
                      className="rounded-md border p-2"
                      disabled={!selectedResidenceDepartment}
                      required
                    >
                      <option value="">Seleccione un municipio</option>
                      {availableResidenceMunicipalities.map((mun) => (
                        <option key={mun} value={mun}>
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
                      className="rounded-md border p-2"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="programa" className="text-sm font-medium">
                      Programa
                    </label>
                    <input
                      type="text"
                      id="programa"
                      className="rounded-md border p-2"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="beneficio" className="text-sm font-medium">
                      Beneficio
                    </label>
                    <input
                      type="text"
                      id="beneficio"
                      className="rounded-md border p-2"
                    />
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
                      onChange={(e) =>
                        setSelectedHandedDepartment(e.target.value)
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
                      onChange={(e) =>
                        setSelectedHandedMunicipality(e.target.value)
                      }
                      disabled={!selectedHandedDepartment}
                      className="rounded-md border p-2"
                      required
                    >
                      <option value="">Seleccione un municipio</option>
                      {availableHandedMunicipalities.map((mun) => (
                        <option key={mun} value={mun}>
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
                      className="rounded-md border p-2"
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="Si">Si</option>
                      <option value="No">No</option>
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
                  Gestión de Intervenciones
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <form
                onSubmit={handleCreateIntervention}
                className="space-y-4 mb-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      value={newIntervention.institution}
                      onChange={(e) =>
                        setNewIntervention({
                          ...newIntervention,
                          institution: e.target.value,
                        })
                      }
                      className="rounded-md border p-2"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Nombre de la Intervención
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={newIntervention.name}
                      onChange={(e) =>
                        setNewIntervention({
                          ...newIntervention,
                          name: e.target.value,
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
                      value={newIntervention.type}
                      onChange={(e) =>
                        setNewIntervention({
                          ...newIntervention,
                          type: e.target.value as Intervention["type"],
                        })
                      }
                      className="rounded-md border p-2"
                      required
                    >
                      <option value="individual">Individual</option>
                      <option value="home">Hogar</option>
                      <option value="communitary">Comunitaria</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Crear Intervención
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
                        Nombre
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
                    {interventions.map((intervention) => (
                      <tr key={intervention.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {intervention.institution}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {intervention.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {intervention.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setEditingIntervention(intervention)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() =>
                              setInterventionToDelete(intervention)
                            }
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
            </AccordionContent>
          </AccordionItem>
          <h3 className="text-lg font-bold text-[#505050] underline">
            Sección de datos abiertos
          </h3>

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
          open={!!editingIntervention}
          onOpenChange={() => setEditingIntervention(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Intervención</DialogTitle>
              <DialogDescription>
                Modifique los campos necesarios para actualizar la intervención.
              </DialogDescription>
            </DialogHeader>
            {editingIntervention && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEditIntervention(editingIntervention);
                }}
                className="space-y-4"
              >
                <div className="flex flex-col gap-2">
                  <label htmlFor="edit-institution">Institución</label>
                  <input
                    id="edit-institution"
                    value={editingIntervention.institution}
                    onChange={(e) =>
                      setEditingIntervention({
                        ...editingIntervention,
                        institution: e.target.value,
                      })
                    }
                    className="rounded-md border p-2"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="edit-name">Nombre</label>
                  <input
                    id="edit-name"
                    value={editingIntervention.name}
                    onChange={(e) =>
                      setEditingIntervention({
                        ...editingIntervention,
                        name: e.target.value,
                      })
                    }
                    className="rounded-md border p-2"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="edit-type">Tipo</label>
                  <select
                    id="edit-type"
                    value={editingIntervention.type}
                    onChange={(e) =>
                      setEditingIntervention({
                        ...editingIntervention,
                        type: e.target.value as Intervention["type"],
                      })
                    }
                    className="rounded-md border p-2"
                  >
                    <option value="individual">Individual</option>
                    <option value="home">Hogar</option>
                    <option value="communitary">Comunitaria</option>
                  </select>
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

        <Dialog
          open={!!interventionToDelete}
          onOpenChange={() => setInterventionToDelete(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmación de Eliminación</DialogTitle>
              <DialogDescription>
                Esta acción eliminará permanentemente la intervención "
                {interventionToDelete?.name}" de la institución{" "}
                {interventionToDelete?.institution}. Esta acción no se puede
                deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <button
                onClick={() => setInterventionToDelete(null)}
                className="px-4 py-2 rounded-md mr-2 border"
              >
                Cancelar
              </button>
              <button
                onClick={() =>
                  interventionToDelete &&
                  handleDeleteIntervention(interventionToDelete)
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
