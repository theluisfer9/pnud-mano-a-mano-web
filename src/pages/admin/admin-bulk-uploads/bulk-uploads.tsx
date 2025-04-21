import { useCallback, useState, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import handleBulkUpload from "@/services/bulk-upload";
import guatemalaJSON from "@/data/guatemala.json";
import CSVColumnMatcher from "./csv-column-matcher";
import parseCSV from "@/services/parsecsv";
import {
  addInterventions,
  getInterventions,
  addInterventionsBulk,
} from "@/db/queries";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import EntregasSection from "./EntregasSection";

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

  // Get query client
  const queryClient = useQueryClient();

  // Invalidate interventions query when bulk-management section is active
  useEffect(() => {
    if (activeSubViewId === "bulk-management") {
      queryClient.invalidateQueries({ queryKey: ["interventions"] });
    }
  }, [activeSubViewId, queryClient]);

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
        {activeSubViewId === "interventions-entregas" && (
          <div className="w-full">
            <EntregasSection />
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
                  {
                    JSON.parse(
                      localStorage.getItem("mano-a-mano-token") || "{}"
                    ).apiToken
                  }
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
                    2. Subir una o más intervenciones
                  </h4>
                  <p className="text-sm text-gray-600">
                    Para registrar intervenciones (sean individuales o en lote),
                    envía una solicitud POST con un cuerpo JSON al siguiente
                    endpoint:
                  </p>
                  <pre className="bg-gray-100 p-2 rounded-md mt-1 overflow-x-auto">
                    <code className="text-xs">
                      {`POST /insertInterventions

Content-Type: application/json
Authorization: Bearer <TU_API_KEY>

{
  "interventions": [
    {
      "id_hogar": 123,                      // Requerido (según uso)
      "cui": "1234567890123",             // Requerido
      "apellido1": "Pérez",                 // Requerido
      "apellido2": "López",                 // Opcional
      "apellido_de_casada": null,           // Opcional
      "nombre1": "Juan",                    // Requerido
      "nombre2": "Antonio",                 // Opcional
      "nombre3": null,                      // Opcional
      "sexo": 1,                            // Requerido (1=Masc, 2=Fem)
      "fecha_nacimiento": "1990-05-15",     // Requerido (Formato YYYY-MM-DD)
      "departamento_nacimiento": 1,         // Requerido (ID Depto)
      "municipio_nacimiento": 101,          // Requerido (ID Muni)
      "pueblo_pertenencia": 1,              // Opcional (ID Pueblo) - Ejemplo: 1=Maya
      "comunidad_linguistica": 11,          // Opcional (ID Comunidad) - Ejemplo: 11=Kaqchikel
      "idioma": 25,                         // Opcional (ID Idioma) - Ejemplo: 25=Español
      "trabaja": 1,                         // Opcional (1=Sí, 0=No)
      "telefono": "55551234",               // Opcional
      "escolaridad": 5,                     // Opcional (ID Escolaridad) - Ejemplo: 5=Superior
      "departamento_residencia": 1,         // Requerido (ID Depto)
      "municipio_residencia": 108,          // Requerido (ID Muni)
      "direccion_residencia": "Calle Falsa 123", // Opcional
      "institucion": 1,                     // Requerido (ID Institución)
      "programa": 1,                        // Requerido (ID Programa)
      "beneficio": 2,                       // Requerido (ID Beneficio)
      "departamento_otorgamiento": 1,       // Requerido (ID Depto)
      "municipio_otorgamiento": 108,        // Requerido (ID Muni)
      "fecha_otorgamiento": "2024-04-17",   // Requerido (Formato YYYY-MM-DD)
      "valor": 150.75,                      // Requerido (Valor numérico)
      "discapacidad": 0                     // Requerido (1=Sí, 0=No)
    }
    // , { ... otra intervención ... }
  ]
}`}
                    </code>
                  </pre>
                  <p className="text-sm text-gray-600 mt-2">
                    La clave <code className="text-xs">interventions</code> debe
                    contener un arreglo (lista) de objetos, donde cada objeto
                    representa una intervención.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Importante:</span> Para subir
                    una sola intervención, simplemente incluye un único objeto
                    dentro del arreglo{" "}
                    <code className="text-xs">interventions</code>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Asegúrate de incluir todos los campos requeridos para cada
                    intervención y usar los IDs correctos para campos como
                    departamentos, municipios, instituciones, programas y
                    beneficios. Revisa los catálogos correspondientes si es
                    necesario.
                  </p>
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
