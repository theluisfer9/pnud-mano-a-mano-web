import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCallback, useState, useMemo, useEffect } from "react";
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
import { guatemalaGeography } from "@/data/geography";
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

  // Get available municipalities based on selected department
  const availableMunicipalities = useMemo(() => {
    const department = guatemalaGeography.find(
      (dep) => dep.title === newGoal.departamento
    );
    return department?.municipalities || [];
  }, [newGoal.departamento]);

  // Reset municipality when department changes
  useEffect(() => {
    setNewGoal((prev) => ({
      ...prev,
      municipio: "",
    }));
  }, [newGoal.departamento]);

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
              {guatemalaGeography.map((dep) => (
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
                  {guatemalaGeography.map((dep) => (
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
                  {guatemalaGeography
                    .find((dep) => dep.title === editingGoal.departamento)
                    ?.municipalities.map((mun) => (
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
                  Carga de entrega de intervenciones
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
