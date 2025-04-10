import { useCallback, useState, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import handleBulkUpload from "@/services/bulk-upload";
import guatemalaJSON from "@/data/guatemala.json";
import CSVColumnMatcher from "./csv-column-matcher";
import parseCSV from "@/services/parsecsv";
import { Programme } from "@/data/programme";
import { Benefit } from "@/data/benefit";
import {
  getPrograms,
  getBenefits,
  addInterventions,
  getInterventions,
  addInterventionsBulk,
} from "@/db/queries";
import { useQuery } from "@tanstack/react-query";
import { EntregaIntervenciones } from "@/data/intervention";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
      toast.success(
        `El archivo ${file.name} ha sido cargado correctamente.`,
        {}
      );
    } else {
      toast.error(`El archivo ${file.name} no pudo ser cargado.`, {});
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

interface AdminBulkUploadsSectionProps {
  activeSubViewId: string | null;
}

const AdminBulkUploadsSection = ({
  activeSubViewId,
}: AdminBulkUploadsSectionProps) => {
  // State for form data
  const [_, setIsLoading] = useState(false);
  const [parsedCSV, setParsedCSV] = useState<{
    columns: string[];
    data: { [key: string]: any }[];
  } | null>(null);
  // Add state for current page
  const [currentPage, setCurrentPage] = useState(1);

  const { data: programmes = [], isLoading: _isLoadingPrograms } = useQuery({
    queryKey: ["programs"],
    queryFn: getPrograms,
    staleTime: 3 * 60 * 1000, // Data will be considered fresh for 3 minutes
  });
  const { data: benefits = [], isLoading: _isLoadingBenefits } = useQuery({
    queryKey: ["benefits"],
    queryFn: getBenefits,
    staleTime: 3 * 60 * 1000, // Data will be considered fresh for 3 minutes
  });
  const { data: interventions = [], isLoading: isLoadingInterventions } =
    useQuery({
      queryKey: ["interventions"],
      queryFn: getInterventions,
      staleTime: 3 * 60 * 1000, // Data will be considered fresh for 3 minutes
    });

  // Logic for pagination of interventions
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(interventions.length / ITEMS_PER_PAGE);
  const paginatedInterventions = interventions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Function to handle page changes
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

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
      valor: 0,
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
      valor: 0,
      discapacidad: -1,
    });
    setIsLoading(false);
  };
  const handleCreateInterventions = async (columnMapping: {
    [key: string]: string;
  }) => {
    setIsLoading(true);
    // Set the column mapping as the headers of the CSV, changing accordingly the columnMapping
    const originalHeaders = parsedCSV?.columns;
    if (!originalHeaders) {
      toast.error("No se pudo obtener los headers del CSV", {});
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
      toast.error("No se pudo asignar las columnas del CSV", {});
      setIsLoading(false);
      return;
    }
    // Instead of transforming the data, just get the original CSV content
    const originalRows = parsedCSV?.data.map((row) => {
      // Create an array of values in the original order
      return originalHeaders?.map((header) => row[header]) || [];
    });
    console.log("originalRows", originalRows);

    if (!originalRows) {
      toast.error("No se pudieron procesar los datos del CSV", {});
      setIsLoading(false);
      return;
    }

    // Convert rows to CSV string
    const csvString = originalRows.map((row) => row.join(",")).join("\n");

    // Add the new headers to the csvString
    const csvStringWithHeaders = [newHeaders.join(","), csvString].join("\n");
    console.log("csvStringWithHeaders", csvStringWithHeaders);
    const file = new File([csvStringWithHeaders], "interventions.csv", {
      type: "text/csv",
    });
    const response = await addInterventionsBulk(file);
    const { invalid_count, invalid_interventions, valid_count, sucess } =
      response;
    const invalid_messages = invalid_interventions.map(
      (invalid_intervention: any) => {
        return `Error: ${invalid_intervention.error}, para ${invalid_intervention.intervention.cui}`;
      }
    );
    if (sucess) {
      toast.success(
        `Se crearon ${valid_count} intervenciones y se encontraron ${invalid_count} errores.`,
        {}
      );
      invalid_messages.forEach((message: string) => {
        toast.error(message, {});
      });
    } else {
      toast.error(`Se encontraron ${invalid_count} errores.`, {});
      invalid_messages.forEach((message: string) => {
        toast.error(message, {});
      });
    }
    setIsLoading(false);
  };
  const mockDatabaseLookup = (idHogar?: number, cui?: string) => {
    if (!idHogar && !cui) return null;

    if (idHogar === 987) {
      const mockPersonDataIdHogar = {
        cui: cui || "1234567890123",
        apellido1: "Pérez",
        apellido2: "López",
        apellido_de_casada: "",
        nombre1: "Juan",
        nombre2: "Antonio",
        nombre3: "",
        sexo: 0, // Masculino
        fecha_nacimiento: new Date("1990-05-15"),
        departamento_nacimiento: 1,
        municipio_nacimiento: 2,
        pueblo_pertenencia: 4, // Ladino
        comunidad_linguistica: 22, // Español
        idioma: 24, // Español
        trabaja: 1, // Sí
        telefono: "12345678",
        escolaridad: 3, // Secundaria
        departamento_residencia: 1,
        municipio_residencia: 2,
        direccion_residencia: "Zona 1, Ciudad de Guatemala",
        discapacidad: 0, // No
      };

      // Set the mock person data to the new intervention
      setNewIntervention({
        ...newIntervention,
        ...mockPersonDataIdHogar,
        id_hogar: idHogar || 987,
      });

      // Update the selected department and municipality state variables
      setSelectedBornDepartment(
        mockPersonDataIdHogar.departamento_nacimiento.toString()
      );

      setSelectedBornMunicipality(
        mockPersonDataIdHogar.municipio_nacimiento.toString()
      );

      // Set the residence department and municipality values
      setSelectedResidenceDepartment(
        mockPersonDataIdHogar.departamento_residencia.toString()
      );

      setSelectedResidenceMunicipality(
        mockPersonDataIdHogar.municipio_residencia.toString()
      );

      return;
    }

    if (cui === "123") {
      const mockPersonDataCui = {
        id_hogar: idHogar || 1,
        institucion: 1,
        cui: cui || "1234567890123",
        apellido1: "Pérez",
        apellido2: "López",
        apellido_de_casada: "",
        nombre1: "Juan",
        nombre2: "Antonio",
        nombre3: "",
        sexo: 0, // Masculino
        fecha_nacimiento: new Date("1990-05-15"),
        departamento_nacimiento: 1,
        municipio_nacimiento: 2,
        pueblo_pertenencia: 4, // Ladino
        comunidad_linguistica: 18, // Español
        idioma: 24, // Español
        trabaja: 1, // Sí
        telefono: "12345678",
        escolaridad: 3, // Secundaria
        departamento_residencia: 1,
        municipio_residencia: 2,
        direccion_residencia: "Zona 1, Ciudad de Guatemala",
        discapacidad: 0, // No
      };

      // Set the mock person data to the new intervention
      setNewIntervention({
        ...newIntervention,
        ...mockPersonDataCui,
      });

      // Update the selected department and municipality state variables
      // Find the department title based on the index
      setSelectedBornDepartment(
        mockPersonDataCui.departamento_nacimiento.toString()
      );

      // Set the municipality value as a string (since ComboBox expects string values)
      setSelectedBornMunicipality(
        mockPersonDataCui.municipio_nacimiento.toString()
      );
      setSelectedResidenceDepartment(
        mockPersonDataCui.departamento_residencia.toString()
      );
      setSelectedResidenceMunicipality(
        mockPersonDataCui.municipio_residencia.toString()
      );
    }
  };

  // Helper to get title based on activeSubViewId
  const getSectionTitle = () => {
    switch (activeSubViewId) {
      case "bulk-csv":
        return "Carga de entrega de intervenciones (CSV)";
      case "bulk-individual":
        return "Carga de entrega de intervenciones (Individual)";
      case "bulk-management":
        return "Gestión de Intervenciones";
      case "bulk-api":
        return "API para Carga de Intervenciones";
      default:
        return "Carga de Datos / Mano a Mano";
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-start items-start gap-4">
      <h2 className="text-2xl font-bold text-[#505050]">{getSectionTitle()}</h2>
      <div className="w-full h-full flex flex-col justify-start items-start gap-4 bg-white p-4 rounded-lg">
        {/* Replace Accordion with conditional rendering based on activeSubViewId */}

        {/* CSV Upload Section */}
        {activeSubViewId === "bulk-csv" && (
          <div className="w-full">
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
          </div>
        )}

        {/* Individual Upload Section */}
        {activeSubViewId === "bulk-individual" && (
          <div className="w-full">
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
                    value={
                      newIntervention.id_hogar === -1 ||
                      isNaN(newIntervention.id_hogar)
                        ? ""
                        : newIntervention.id_hogar
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewIntervention({
                        ...newIntervention,
                        id_hogar: value === "" ? -1 : parseInt(value) || -1,
                      });
                      mockDatabaseLookup(parseInt(value), undefined);
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="institution" className="text-sm font-medium">
                    Institución
                  </label>
                  <input
                    type="text"
                    id="institution"
                    className="rounded-md border p-2"
                    value={
                      newIntervention.institucion === -1 ||
                      isNaN(newIntervention.institucion ?? 0)
                        ? ""
                        : newIntervention.institucion
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewIntervention({
                        ...newIntervention,
                        institucion: value === "" ? -1 : parseInt(value) || -1,
                      });
                    }}
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
                    onChange={(e) => {
                      setNewIntervention({
                        ...newIntervention,
                        cui: e.target.value,
                      });
                      mockDatabaseLookup(undefined, e.target.value);
                    }}
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
                  <ComboBox
                    options={[
                      { value: "0", label: "Masculino" },
                      { value: "1", label: "Femenino" },
                    ]}
                    value={newIntervention.sexo.toString()}
                    onChange={(e) =>
                      setNewIntervention({
                        ...newIntervention,
                        sexo: parseInt(e),
                      })
                    }
                  />
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
                  <ComboBox
                    options={guatemalaJSON.map((dep, index) => ({
                      value: index.toString(),
                      label: dep.title,
                    }))}
                    value={selectedBornDepartment}
                    onChange={(e) => {
                      setSelectedBornDepartment(e);
                      setNewIntervention({
                        ...newIntervention,
                        departamento_nacimiento: parseInt(e),
                      });
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="municipio_nacimiento"
                    className="text-sm font-medium"
                  >
                    Municipio de Nacimiento
                  </label>
                  <ComboBox
                    options={
                      guatemalaJSON
                        .find(
                          (_dep, index) =>
                            index.toString() === selectedBornDepartment
                        )
                        ?.mun.map((mun, index) => ({
                          value: index.toString(),
                          label: mun,
                        })) ?? []
                    } // Add fallback for undefined case
                    value={selectedBornMunicipality}
                    disabled={!selectedBornDepartment}
                    onChange={(e) => {
                      setSelectedBornMunicipality(e);
                      setNewIntervention({
                        ...newIntervention,
                        municipio_nacimiento: parseInt(e),
                      });
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="pueblo_pertenencia"
                    className="text-sm font-medium"
                  >
                    Pueblo de Pertenencia
                  </label>
                  <ComboBox
                    options={[
                      { value: "0", label: "Maya" },
                      { value: "1", label: "Garifuna" },
                      { value: "2", label: "Xinka" },
                      {
                        value: "3",
                        label: "Afrodescendiente / Creole / Afromestizo",
                      },
                      { value: "4", label: "Ladina(o)" },
                      { value: "5", label: "Extranjera(o)" },
                      { value: "6", label: "Sin información" },
                    ]}
                    value={
                      newIntervention.pueblo_pertenencia?.toString() ?? "6"
                    }
                    onChange={(e) =>
                      setNewIntervention({
                        ...newIntervention,
                        pueblo_pertenencia: parseInt(e),
                      })
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="comunidad_linguistica"
                    className="text-sm font-medium"
                  >
                    Comunidad Lingüística
                  </label>
                  <ComboBox
                    options={[
                      { value: "0", label: "Achi" },
                      { value: "1", label: "Akateka" },
                      { value: "2", label: "Awakateka" },
                      { value: "3", label: "Ch'orti'" },
                      { value: "4", label: "Chalchiteka" },
                      { value: "5", label: "Chuj" },
                      { value: "6", label: "Itza'" },
                      { value: "7", label: "Ixil" },
                      { value: "8", label: "Jakalteka/Popti'" },
                      { value: "9", label: "K'iche'" },
                      { value: "10", label: "Kaqchikel" },
                      { value: "11", label: "Mam" },
                      { value: "12", label: "Mopan" },
                      { value: "13", label: "Poqoman" },
                      { value: "14", label: "Poqomchi'" },
                      { value: "15", label: "Q'anjob'al" },
                      { value: "16", label: "Q'eqchi'" },
                      { value: "17", label: "Sakapulteka" },
                      { value: "18", label: "Sipakapense" },
                      { value: "19", label: "Tektiteka" },
                      { value: "20", label: "Tz'utujil" },
                      { value: "21", label: "Uspanteka" },
                      { value: "22", label: "No aplica" },
                      { value: "23", label: "Sin información" },
                    ]}
                    value={
                      newIntervention.comunidad_linguistica?.toString() ?? "23"
                    }
                    onChange={(e) =>
                      setNewIntervention({
                        ...newIntervention,
                        comunidad_linguistica: parseInt(e),
                      })
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="idioma" className="text-sm font-medium">
                    Idioma
                  </label>
                  <ComboBox
                    options={[
                      { value: "0", label: "Achi" },
                      { value: "1", label: "Akateka" },
                      { value: "2", label: "Awakateka" },
                      { value: "3", label: "Ch'orti'" },
                      { value: "4", label: "Chalchiteko" },
                      { value: "5", label: "Chuj" },
                      { value: "6", label: "Itza'" },
                      { value: "7", label: "Ixil" },
                      { value: "8", label: "Jakalteka/Popti'" },
                      { value: "9", label: "K'iche'" },
                      { value: "10", label: "Kaqchikel" },
                      { value: "11", label: "Mam" },
                      { value: "12", label: "Mopan" },
                      { value: "13", label: "Poqomam" },
                      { value: "14", label: "Poqomchi'" },
                      { value: "15", label: "Q'anjob'al" },
                      { value: "16", label: "Q'eqchi'" },
                      { value: "17", label: "Sakapulteko" },
                      { value: "18", label: "Sipakapense" },
                      { value: "19", label: "Tektiteko" },
                      { value: "20", label: "Tz'utujil" },
                      { value: "21", label: "Uspanteko" },
                      { value: "22", label: "Xinka" },
                      { value: "23", label: "Garifuna" },
                      { value: "24", label: "Español" },
                      { value: "25", label: "Inglés" },
                      { value: "26", label: "Señas" },
                      { value: "27", label: "Otro idioma" },
                      { value: "28", label: "No habla" },
                      { value: "29", label: "Sin Información" },
                    ]}
                    value={newIntervention.idioma?.toString() ?? "29"}
                    onChange={(e) =>
                      setNewIntervention({
                        ...newIntervention,
                        idioma: parseInt(e),
                      })
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="trabaja" className="text-sm font-medium">
                    Trabaja
                  </label>
                  <ComboBox
                    options={[
                      { value: "0", label: "Si" },
                      { value: "1", label: "No" },
                      { value: "2", label: "Sin Información" },
                    ]}
                    value={newIntervention.trabaja?.toString() ?? "2"}
                    onChange={(e) =>
                      setNewIntervention({
                        ...newIntervention,
                        trabaja: parseInt(e),
                      })
                    }
                  />
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
                  <label htmlFor="escolaridad" className="text-sm font-medium">
                    Escolaridad
                  </label>
                  <ComboBox
                    options={[
                      { value: "0", label: "Ninguno" },
                      { value: "1", label: "Preprimaria" },
                      { value: "2", label: "Primaria" },
                      { value: "3", label: "Básico" },
                      { value: "4", label: "Diversificado" },
                      { value: "5", label: "Superior" },
                      { value: "6", label: "Maestría" },
                      { value: "7", label: "Doctorado" },
                      { value: "8", label: "Sin Información" },
                    ]}
                    value={newIntervention.escolaridad?.toString() ?? "8"}
                    onChange={(e) =>
                      setNewIntervention({
                        ...newIntervention,
                        escolaridad: parseInt(e),
                      })
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="departamento_residencia"
                    className="text-sm font-medium"
                  >
                    Departamento de Residencia
                  </label>
                  <ComboBox
                    options={guatemalaJSON.map((dep, index) => ({
                      value: index.toString(),
                      label: dep.title,
                    }))}
                    value={selectedResidenceDepartment}
                    onChange={(e) => {
                      setSelectedResidenceDepartment(e);
                      setNewIntervention({
                        ...newIntervention,
                        departamento_residencia: parseInt(e),
                      });
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="municipio_residencia"
                    className="text-sm font-medium"
                  >
                    Municipio de Residencia
                  </label>
                  <ComboBox
                    options={
                      guatemalaJSON
                        .find(
                          (_dep, index) =>
                            index.toString() === selectedResidenceDepartment
                        )
                        ?.mun.map((mun, index) => ({
                          value: index.toString(),
                          label: mun,
                        })) ?? []
                    } // Add fallback for undefined case
                    value={selectedResidenceMunicipality}
                    disabled={!selectedResidenceDepartment}
                    onChange={(e) => {
                      setSelectedResidenceMunicipality(e);
                      setNewIntervention({
                        ...newIntervention,
                        municipio_residencia: parseInt(e),
                      });
                    }}
                  />
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
                  <ComboBox
                    options={programmes.map(
                      (programme: Programme, index: number) => ({
                        value: index.toString(),
                        label: programme.name,
                      })
                    )}
                    value={(newIntervention.programa ?? -1).toString()} // Use index as string like the beneficio ComboBox
                    onChange={(e) =>
                      setNewIntervention({
                        ...newIntervention,
                        programa: parseInt(e),
                      })
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="beneficio" className="text-sm font-medium">
                    Beneficio
                  </label>
                  <ComboBox
                    options={benefits.map(
                      (benefit: Benefit, index: number) => ({
                        value: index.toString(),
                        label: benefit.short_name,
                      })
                    )}
                    value={(newIntervention.beneficio ?? -1).toString()} // Convert to string and use index directly
                    onChange={(e) =>
                      setNewIntervention({
                        ...newIntervention,
                        beneficio: parseInt(e),
                      })
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="departamento_otorgamiento"
                    className="text-sm font-medium"
                  >
                    Departamento de Otorgamiento
                  </label>
                  <ComboBox
                    options={guatemalaJSON.map((dep, index) => ({
                      value: index.toString(),
                      label: dep.title,
                    }))}
                    value={selectedHandedDepartment}
                    onChange={(e) => {
                      setSelectedHandedDepartment(e);
                      setNewIntervention({
                        ...newIntervention,
                        departamento_otorgamiento: parseInt(e),
                      });
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="municipio_otorgamiento"
                    className="text-sm font-medium"
                  >
                    Municipio de Otorgamiento
                  </label>
                  <ComboBox
                    options={
                      guatemalaJSON
                        .find(
                          (_dep, index) =>
                            index.toString() === selectedHandedDepartment
                        )
                        ?.mun.map((mun, index) => ({
                          value: index.toString(),
                          label: mun,
                        })) ?? []
                    }
                    value={selectedHandedMunicipality}
                    onChange={(e) => {
                      setSelectedHandedMunicipality(e);
                      setNewIntervention({
                        ...newIntervention,
                        municipio_otorgamiento: parseInt(e),
                      });
                    }}
                  />
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
                    value={
                      newIntervention.valor === 0 ? "" : newIntervention.valor
                    }
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
                  <label htmlFor="discapacidad" className="text-sm font-medium">
                    Discapacidad
                  </label>
                  <ComboBox
                    options={[
                      { value: "0", label: "No" },
                      { value: "1", label: "Sí" },
                      { value: "2", label: "Sin Información" },
                    ]}
                    value={newIntervention.discapacidad?.toString() ?? "2"}
                    onChange={(e) =>
                      setNewIntervention({
                        ...newIntervention,
                        discapacidad: parseInt(e),
                      })
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#1c2851] h-3/5 self-end text-white px-4 rounded-md hover:bg-[#1c2851]/80"
                >
                  Crear
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Intervention Management Section */}
        {activeSubViewId === "bulk-management" && (
          <div className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Hogar</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Programa</TableHead>
                  <TableHead>Beneficio</TableHead>
                  <TableHead>Fecha de Otorgamiento</TableHead>
                  <TableHead>Departamento de Otorgamiento</TableHead>
                  <TableHead>Municipio de Otorgamiento</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingInterventions
                  ? "Cargando..."
                  : paginatedInterventions.map(
                      (intervention: EntregaIntervenciones) => (
                        <TableRow key={intervention.id}>
                          <TableCell>{intervention.id_hogar}</TableCell>
                          <TableCell>{intervention.nombre1}</TableCell>
                          <TableCell>{intervention.programa}</TableCell>
                          <TableCell>{intervention.beneficio}</TableCell>
                          <TableCell>
                            {intervention.fecha_otorgamiento
                              ? new Date(intervention.fecha_otorgamiento)
                                  .toISOString()
                                  .split("T")[0]
                              : ""}
                          </TableCell>
                          <TableCell>
                            {intervention.departamento_otorgamiento}
                          </TableCell>
                          <TableCell>
                            {intervention.municipio_otorgamiento}
                          </TableCell>
                          <TableCell>{intervention.valor}</TableCell>
                        </TableRow>
                      )
                    )}
              </TableBody>
            </Table>

            {/* Pagination controls */}
            {!isLoadingInterventions && interventions.length > 0 && (
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500">
                  Mostrando {paginatedInterventions.length} de{" "}
                  {interventions.length} intervenciones
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={currentPage === page ? "bg-[#2f4489]" : ""}
                      >
                        {page}
                      </Button>
                    )
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* API Documentation Section */}
        {activeSubViewId === "bulk-api" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-md font-medium mb-2">Tu token de API</h3>
              <div className="flex items-center gap-2">
                <code className="bg-gray-100 p-2 rounded-md flex-1 font-mono text-sm break-all">
                  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1hbm8gYSBNYW5vIEFQSSIsImlhdCI6MTUxNjIzOTAyMn0
                </code>
                <Button
                  className="bg-[#2f4489] hover:bg-[#2f4489]/80 text-white"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1hbm8gYSBNYW5vIEFQSSIsImlhdCI6MTUxNjIzOTAyMn0"
                    );
                    toast.success("Token copiado al portapapeles", {});
                  }}
                >
                  Copiar
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Este token es necesario para autenticar todas tus solicitudes a
                la API.
              </p>
            </div>

            <div>
              <h3 className="text-md font-medium mb-2">Documentación de API</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">1. Autenticación</h4>
                  <p className="text-sm text-gray-600">
                    Incluye tu token en el encabezado de cada solicitud como:
                  </p>
                  <pre className="bg-gray-100 p-2 rounded-md mt-1 overflow-x-auto">
                    <code className="text-xs">
                      {`Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1hbm8gYSBNYW5vIEFQSSIsImlhdCI6MTUxNjIzOTAyMn0`}
                    </code>
                  </pre>
                </div>

                <div>
                  <h4 className="font-medium">
                    2. Subir una intervención individual
                  </h4>
                  <p className="text-sm text-gray-600">
                    Envía una solicitud POST al siguiente endpoint:
                  </p>
                  <pre className="bg-gray-100 p-2 rounded-md mt-1 overflow-x-auto">
                    <code className="text-xs">
                      {`POST /api/interventions

{
  "id_hogar": 123,
  "cui": "1234567890123",
  "apellido1": "Pérez",
  "apellido2": "López",
  "nombre1": "Juan",
  "nombre2": "Antonio",
  "sexo": 0,
  "fecha_nacimiento": "1990-05-15",
  "departamento_nacimiento": 1,
  "municipio_nacimiento": 2,
  "programa": 1,
  "beneficio": 2,
  ...
}`}
                    </code>
                  </pre>
                </div>

                <div>
                  <h4 className="font-medium">
                    3. Subir intervenciones en lote
                  </h4>
                  <p className="text-sm text-gray-600">
                    Envía un archivo CSV como 'multipart/form-data':
                  </p>
                  <pre className="bg-gray-100 p-2 rounded-md mt-1 overflow-x-auto">
                    <code className="text-xs">
                      {`POST /api/interventions/bulk

Content-Type: multipart/form-data
[Archivo CSV adjunto]`}
                    </code>
                  </pre>
                  <p className="text-sm text-gray-600 mt-2">
                    El formato del CSV debe coincidir con los campos requeridos.
                    Consulta la sección "Formato de CSV" para más detalles.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">4. Consultar intervenciones</h4>
                  <p className="text-sm text-gray-600">
                    Envía una solicitud GET para consultar las intervenciones:
                  </p>
                  <pre className="bg-gray-100 p-2 rounded-md mt-1 overflow-x-auto">
                    <code className="text-xs">
                      {`GET /api/interventions?page=1&limit=10
GET /api/interventions?cui=1234567890123
GET /api/interventions?programa=1`}
                    </code>
                  </pre>
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-4">
                Para más información, consulta la documentación completa de la
                API o contacta al equipo de soporte técnico.
              </p>
            </div>
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

        <Toaster />
      </div>
    </div>
  );
};

interface ComboBoxProps {
  options: { value: string; label: string }[];
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}
export const ComboBox = ({
  options,
  value,
  disabled,
  onChange,
}: ComboBoxProps) => {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
    if (value) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleSelect = (currentValue: string) => {
    setSelectedValue(currentValue);
    onChange(currentValue);
    setOpen(false);
  };
  const selectedLabel = useMemo(() => {
    return (
      options.find((option) => option.value === selectedValue)?.label || ""
    );
  }, [selectedValue, options]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedLabel || "Seleccione una opción..."}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full min-w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Buscar..." />
          <CommandEmpty>No se encontraron opciones.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                  className={cn(
                    "cursor-pointer",
                    selectedValue === option.value && "bg-accent"
                  )}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValue === option.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default AdminBulkUploadsSection;
