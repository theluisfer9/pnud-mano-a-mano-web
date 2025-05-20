import { useCallback, useState, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import handleBulkUpload from "@/services/bulk-upload";
import CSVColumnMatcher from "./csv-column-matcher";
import parseCSV from "@/services/parsecsv";
import {
  getInterventionsWithFilters,
  addInterventionsBulk,
  deleteInterventions,
  sendInterventionsToSNIS,
  getInterventionsSummaryWithFilters,
} from "@/db/queries";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  EntregaIntervencionesJoined,
  EntregaIntervencionesSummary,
} from "@/data/intervention";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Check,
  ChevronDown,
  EyeIcon,
  FilterIcon,
  Loader2,
  TrashIcon,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/Combobox/combobox";
import { getAllProgramasWithBeneficios } from "@/services/fichas";
import { guatemalaGeography } from "@/data/geography";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import getFile from "@/services/getfile";

// Define an interface for the filters, matching the function parameters
interface InterventionFunctionFilters {
  año?: number;
  mes?: number;
  programa?: number;
  beneficio?: number;
  departamento_entrega?: number;
  municipio_entrega?: number;
  cui?: string;
}

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
  const [itemsPerPage, setItemsPerPage] = useState(50);

  // State to hold the filters that are actually applied to the query
  const [appliedFilters, setAppliedFilters] =
    useState<InterventionFunctionFilters>({}); // Use the new interface

  const {
    data: interventionsResponse = {
      interventions: [],
      totalCount: 0,
      page: 1,
      perPage: itemsPerPage,
      totalPages: 1,
    },
    isLoading: isLoadingInterventions,
  } = useQuery({
    queryKey: ["interventions", currentPage, itemsPerPage, appliedFilters],
    queryFn: () =>
      getInterventionsWithFilters(
        currentPage,
        itemsPerPage,
        appliedFilters.año,
        appliedFilters.mes,
        appliedFilters.programa,
        appliedFilters.beneficio,
        appliedFilters.departamento_entrega,
        appliedFilters.municipio_entrega,
        appliedFilters.cui
      ),
    staleTime: 3 * 60 * 1000,
  });

  const {
    data: interventionsSummary,
    isLoading: isLoadingInterventionsSummary,
  } = useQuery({
    queryKey: ["interventionsSummary", appliedFilters],
    queryFn: () =>
      getInterventionsSummaryWithFilters(
        appliedFilters.año,
        appliedFilters.mes,
        appliedFilters.programa,
        appliedFilters.beneficio,
        appliedFilters.departamento_entrega,
        appliedFilters.municipio_entrega,
        appliedFilters.cui
      ),
  });

  const {
    data: programas,
    isLoading: isLoadingProgramas,
    isError: isProgramasError,
    error: programasError,
  } = useQuery({
    queryKey: ["programas"],
    queryFn: () => getAllProgramasWithBeneficios(),
  });

  useEffect(() => {
    if (isProgramasError && programasError) {
      const message =
        programasError instanceof Error
          ? programasError.message
          : "Error al cargar programas";
      toast.error(message, {});
    }
  }, [isProgramasError, programasError]);

  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [selectedBeneficio, setSelectedBeneficio] = useState<string>("");

  // Extract data for easier use in the component
  const interventionsList = interventionsResponse?.interventions || [];
  const totalInterventionsCount = interventionsResponse?.totalCount || 0;
  const totalPages = interventionsResponse?.totalPages || 1;

  // Logic for pagination of interventions
  // if (!interventionsResponse) return null; // Or a loading state, but useQuery handles isLoading

  // Function to handle page changes
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleDeleteInterventions = async (interventions_ids: number[]) => {
    const response = await deleteInterventions(interventions_ids);
    if (response) {
      toast.success("Intervenciones eliminadas correctamente", {});
      queryClient.invalidateQueries({ queryKey: ["interventions"] });
    } else {
      toast.error("Error al eliminar las intervenciones", {});
    }
  };

  const renderPageNumbers = () => {
    const pageButtons = [];
    const showAllThreshold = 7; // Show all pages if total is 7 or less
    const countAtEdges = 5; // Number of pages to show in blocks at start/end (e.g., 1,2,3,4,5 or L-4,...,L)
    const siblingCount = 1; // For middle block: c-1, c, c+1

    if (totalPages <= 1) {
      if (totalPages === 1) {
        pageButtons.push(
          <Button
            key="page-1"
            variant="outline"
            size="sm"
            className="bg-[#2f4489] text-white" // Only one page, so it's "active"
            onClick={() => handlePageChange(1)}
          >
            1
          </Button>
        );
      }
      return pageButtons;
    }

    if (totalPages <= showAllThreshold) {
      for (let i = 1; i <= totalPages; i++) {
        pageButtons.push(
          <Button
            key={`page-${i}`}
            variant={currentPage === i ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(i)}
            className={currentPage === i ? "bg-[#2f4489] text-white" : ""}
          >
            {i}
          </Button>
        );
      }
    } else {
      const pageItems: (number | string)[] = [];
      const pagesSet = new Set<number>();

      // Always add first and last page to the set
      pagesSet.add(1);
      pagesSet.add(totalPages);

      // Determine which block of pages to add based on current page
      const isNearStart = currentPage < countAtEdges; // e.g., for count=5, c=1,2,3,4
      const isNearEnd = currentPage > totalPages - countAtEdges + 1; // e.g., for count=5, c > L-4

      if (isNearStart) {
        for (let i = 1; i <= countAtEdges; i++) {
          if (i <= totalPages) pagesSet.add(i);
        }
      } else if (isNearEnd) {
        for (let i = totalPages - countAtEdges + 1; i <= totalPages; i++) {
          if (i >= 1) pagesSet.add(i);
        }
      } else {
        // Middle case: c-sibling, c, c+sibling
        for (
          let i = currentPage - siblingCount;
          i <= currentPage + siblingCount;
          i++
        ) {
          if (i >= 1 && i <= totalPages) pagesSet.add(i);
        }
      }

      const sortedPages = Array.from(pagesSet).sort((a, b) => a - b);
      let lastPushedPage = 0;
      for (const page of sortedPages) {
        if (page > lastPushedPage + 1) {
          // If there's a gap, add an ellipsis
          pageItems.push("...");
        }
        pageItems.push(page);
        lastPushedPage = page;
      }

      // Convert items to buttons
      pageItems.forEach((item, index) => {
        if (typeof item === "number") {
          pageButtons.push(
            <Button
              key={`page-${item}`}
              variant={currentPage === item ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(item)}
              className={currentPage === item ? "bg-[#2f4489] text-white" : ""}
            >
              {item}
            </Button>
          );
        } else {
          // Ellipsis
          pageButtons.push(
            <span
              key={`ellipsis-${index}`}
              className="px-2 py-1 self-center text-sm"
            >
              ...
            </span>
          );
        }
      });
    }
    return pageButtons;
  };

  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedCui, setSelectedCui] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>("");

  // --- State for Summary Detail Modal ---
  const [isSummaryDetailModalOpen, setIsSummaryDetailModalOpen] =
    useState(false);
  const [selectedSummaryItemForModal, setSelectedSummaryItemForModal] =
    useState<EntregaIntervencionesSummary | null>(null);
  // --- End State for Summary Detail Modal ---

  const refetchWithFilters = () => {
    const currentFilters: InterventionFunctionFilters = {
      cui: selectedCui || undefined,
      año: selectedYear ? parseInt(selectedYear, 10) : undefined,
      mes: selectedMonth ? parseInt(selectedMonth, 10) : undefined,
      programa: selectedProgram ? parseInt(selectedProgram, 10) : undefined,
      beneficio: selectedBeneficio
        ? parseInt(selectedBeneficio, 10)
        : undefined,
      departamento_entrega: selectedDepartment
        ? parseInt(selectedDepartment, 10)
        : undefined,
      municipio_entrega: selectedMunicipality
        ? parseInt(selectedMunicipality, 10)
        : undefined,
    };
    // Remove undefined properties to avoid sending them as empty strings or NaN
    Object.keys(currentFilters).forEach(
      (key) =>
        currentFilters[key as keyof InterventionFunctionFilters] ===
          undefined &&
        delete currentFilters[key as keyof InterventionFunctionFilters]
    );
    setAppliedFilters(currentFilters);
    setCurrentPage(1); // Reset to page 1 when filters are applied
  };

  // Get query client
  const queryClient = useQueryClient();

  // Invalidate interventions query when bulk-management section is active
  useEffect(() => {
    if (activeSubViewId === "bulk-management") {
      queryClient.invalidateQueries({ queryKey: ["interventions"] });
    }
  }, [activeSubViewId, queryClient]);

  // Add new useEffect to reset municipality when department changes
  useEffect(() => {
    setSelectedMunicipality(""); // Clear municipality when department changes
  }, [selectedDepartment]);

  const handleParseCSV = (parsedCSV: {
    columns: string[];
    data: { [key: string]: any }[];
  }) => {
    console.log("parsedCSV", parsedCSV);
    setParsedCSV(parsedCSV);
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
    const { inserted_count, skipped_count, db_error_count, message, success } =
      response;
    if (success) {
      // Clear the parsedCSV state
      toast.success("Limpiando en 5 segundos", {});
      setTimeout(() => {
        setParsedCSV(null);
      }, 5000);
      toast.success(
        `Se crearon ${inserted_count} intervenciones y se encontraron ${skipped_count} errores.`,
        {}
      );
      if (message) {
        toast.error(message, {});
      }
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["interventions"] });
      queryClient.invalidateQueries({ queryKey: ["interventionsSummary"] });
    } else {
      toast.error(`Se encontraron ${db_error_count} errores.`, {});
      if (message) {
        toast.error(message, {});
      }
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
        return "Gestión de Entregas";
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
            <span className="text-sm text-gray-500">
              Puedes descargar el archivo de ejemplo{" "}
              <a
                download
                className="text-blue-500 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  getFile(
                    "sample-data/07cf974e-c4ff-4630-bebe-940a6da2f561.csv"
                  ).then((url) => {
                    window.open(url, "_blank");
                  });
                }}
              >
                intervenciones-ejemplo.csv
              </a>
            </span>
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
          <div className="w-full p-4">
            <h3 className="text-lg font-bold mb-4">Filtros</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col gap-2 col-span-2 md:col-span-1">
                <div className="flex w-full gap-2">
                  <Input
                    type="number"
                    placeholder="Año"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-1/2"
                  />
                  <Combobox
                    options={[
                      { label: "Enero", value: "1" },
                      { label: "Febrero", value: "2" },
                      { label: "Marzo", value: "3" },
                      { label: "Abril", value: "4" },
                      { label: "Mayo", value: "5" },
                      { label: "Junio", value: "6" },
                      { label: "Julio", value: "7" },
                      { label: "Agosto", value: "8" },
                      { label: "Septiembre", value: "9" },
                      { label: "Octubre", value: "10" },
                      { label: "Noviembre", value: "11" },
                      { label: "Diciembre", value: "12" },
                    ]}
                    value={selectedMonth}
                    onChange={setSelectedMonth}
                    placeholder="Mes"
                    width="50%"
                    popOverWidth="full"
                  />
                </div>
              </div>
              <div className="flex flex-col w-full gap-2">
                <div
                  className={cn(
                    "w-full",
                    (isLoadingProgramas || isProgramasError) &&
                      "opacity-50 pointer-events-none"
                  )}
                >
                  <Combobox
                    options={
                      Array.isArray(programas)
                        ? programas.map((program) => ({
                            label: program.nombreComun,
                            value: program.id.toString(),
                          }))
                        : []
                    }
                    value={selectedProgram}
                    onChange={setSelectedProgram}
                    placeholder="Programa"
                    width="full"
                    popOverWidth="full"
                  />
                </div>
              </div>
              <div className="flex flex-col w-full gap-2">
                <div
                  className={cn(
                    "w-full",
                    (!selectedProgram ||
                      isLoadingProgramas ||
                      isProgramasError) &&
                      "opacity-50 pointer-events-none"
                  )}
                >
                  <Combobox
                    options={
                      Array.isArray(programas) &&
                      selectedProgram &&
                      programas.length > 0
                        ? programas
                            .find((p) => p.id.toString() === selectedProgram)
                            ?.beneficios?.map((beneficio) => ({
                              label: beneficio.nombreCorto,
                              value: beneficio.id.toString(),
                            })) || []
                        : []
                    }
                    value={selectedBeneficio}
                    onChange={setSelectedBeneficio}
                    placeholder="Beneficio"
                    width="full"
                    popOverWidth="full"
                  />
                </div>
              </div>
              <div className="flex flex-col w-full gap-2">
                <div className="w-full">
                  <Input
                    type="text"
                    placeholder="CUI"
                    value={selectedCui}
                    onChange={(e) => setSelectedCui(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col w-full gap-2">
                <div className="w-full">
                  <Combobox
                    options={guatemalaGeography.map((depto) => ({
                      label: depto.title,
                      value: depto.id.toString(),
                    }))}
                    value={selectedDepartment}
                    onChange={setSelectedDepartment}
                    placeholder="Departamento"
                    width="full"
                    popOverWidth="full"
                  />
                </div>
              </div>
              <div className="flex flex-col w-full gap-2">
                <div
                  className={cn(
                    "w-full",
                    !selectedDepartment && "opacity-50 pointer-events-none"
                  )}
                >
                  <Combobox
                    options={
                      selectedDepartment
                        ? guatemalaGeography
                            .find(
                              (depto) =>
                                depto.id.toString() === selectedDepartment
                            )
                            ?.municipalities.map((muni) => ({
                              label: muni.title,
                              value: muni.id.toString(),
                            })) || []
                        : []
                    }
                    value={selectedMunicipality}
                    onChange={setSelectedMunicipality}
                    placeholder="Municipio"
                    width="full"
                    popOverWidth="full"
                  />
                </div>
              </div>
              <div className="flex flex-col w-full gap-2 self-end col-start-2 md:col-start-3">
                <div className="flex gap-2">
                  <Button
                    className="gap-4 w-1/2 bg-[#2f4489] hover:bg-[#2f4489]/80 text-white"
                    onClick={() => {
                      refetchWithFilters();
                    }}
                  >
                    Filtrar <FilterIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-1/2"
                    onClick={() => {
                      setSelectedYear("");
                      setSelectedMonth("");
                      setSelectedCui("");
                      setSelectedDepartment("");
                      setSelectedMunicipality("");
                      setSelectedProgram("");
                      setSelectedBeneficio("");
                      setAppliedFilters({});
                      setCurrentPage(1);
                    }}
                  >
                    Limpiar
                  </Button>
                </div>
              </div>
            </div>
            {isLoadingInterventionsSummary ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            ) : (
              interventionsSummary && (
                <div className="flex flex-col gap-4 mb-4">
                  <h3 className="text-lg font-bold">
                    Resumen de Intervenciones
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Año</TableHead>
                        <TableHead>Programa</TableHead>
                        <TableHead>Beneficio</TableHead>
                        <TableHead>Entregas</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {interventionsSummary.summary.map(
                        (item: EntregaIntervencionesSummary, index: number) => (
                          <TableRow key={index}>
                            <TableCell>
                              {interventionsSummary.filters_applied.año}
                            </TableCell>
                            <TableCell>{item.programa_nombre}</TableCell>
                            <TableCell>{item.beneficio_nombre}</TableCell>
                            <TableCell>{item.total_entregas}</TableCell>
                            <TableCell>{item.total_valor}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="gap-2 bg-[#2f4489] hover:bg-[#2f4489]/80 text-white"
                                  onClick={() => {
                                    // Logic to open modal with item details
                                    setSelectedSummaryItemForModal(item);
                                    setIsSummaryDetailModalOpen(true);
                                  }}
                                >
                                  <EyeIcon className="w-4 h-4" />
                                  Ver
                                </Button>
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="gap-2 bg-[#2f4489] hover:bg-[#2f4489]/80 text-white"
                                  onClick={async () => {
                                    // Confirmation
                                    if (
                                      window.confirm(
                                        "¿Estás seguro de que deseas enviar estas intervenciones a SNIS?"
                                      )
                                    ) {
                                      const response =
                                        await sendInterventionsToSNIS(
                                          item.intervention_ids
                                        );
                                      if (response) {
                                        queryClient.invalidateQueries({
                                          queryKey: ["interventions"],
                                        });
                                        queryClient.invalidateQueries({
                                          queryKey: ["interventionsSummary"],
                                        });
                                        toast.success(
                                          "Intervenciones enviadas a SNIS correctamente"
                                        );
                                      } else {
                                        toast.error(
                                          "Error al enviar las intervenciones a SNIS"
                                        );
                                      }
                                    }
                                  }}
                                >
                                  <Check className="w-4 h-4" />
                                  Integrar al SNIS
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
              )
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CUI</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Fecha de Otorgamiento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Programa</TableHead>
                  <TableHead>Beneficio</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Municipio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingInterventions ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Cargando...
                    </TableCell>
                  </TableRow>
                ) : (
                  interventionsList.map(
                    (intervention: EntregaIntervencionesJoined) => (
                      <TableRow key={intervention.id}>
                        <TableCell>{intervention.cui}</TableCell>
                        <TableCell>{intervention.nombre1}</TableCell>
                        <TableCell>
                          {intervention.fecha_otorgamiento
                            ? new Date(
                                intervention.fecha_otorgamiento
                              ).toLocaleDateString("es-GT", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              })
                            : ""}
                        </TableCell>
                        <TableCell>{intervention.valor}</TableCell>
                        <TableCell>{intervention.programa}</TableCell>
                        <TableCell>{intervention.beneficio}</TableCell>
                        <TableCell>
                          {
                            guatemalaGeography.find(
                              (depto) =>
                                depto.id ===
                                intervention.departamento_otorgamiento
                            )?.title
                          }
                        </TableCell>
                        <TableCell>
                          {
                            guatemalaGeography
                              .find(
                                (depto) =>
                                  depto.id ===
                                  intervention.departamento_otorgamiento
                              )
                              ?.municipalities?.find(
                                (muni) =>
                                  muni.id ===
                                  intervention.municipio_otorgamiento
                              )?.title
                          }
                        </TableCell>
                        <TableCell>
                          {intervention.estado === 1
                            ? "Activo"
                            : intervention.estado === 2
                            ? "Eliminado"
                            : "Enviado a SNIS"}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            onClick={async () => {
                              if (
                                window.confirm(
                                  "¿Estás seguro de que deseas eliminar esta intervención?"
                                )
                              ) {
                                await handleDeleteInterventions([
                                  intervention.id,
                                ]);
                                queryClient.invalidateQueries({
                                  queryKey: ["interventions"],
                                });
                                queryClient.invalidateQueries({
                                  queryKey: ["interventionsSummary"],
                                });
                                toast.success(
                                  "Intervención eliminada correctamente"
                                );
                              }
                            }}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  )
                )}
              </TableBody>
            </Table>

            {/* Pagination controls */}
            {!isLoadingInterventions && interventionsList.length > 0 && (
              <div className="flex justify-between items-center my-4">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-500">
                    Mostrando {interventionsList.length} de{" "}
                    {totalInterventionsCount} intervenciones
                  </div>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value={50}>50 por página</option>
                    <option value={100}>100 por página</option>
                    <option value={200}>200 por página</option>
                  </select>
                </div>
                <div className="flex gap-2 items-center">
                  {" "}
                  {/* Added items-center for vertical alignment of ellipses */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  {renderPageNumbers()} {/* Call the new function here */}
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
            <div className="flex justify-end gap-4">
              <Button
                variant="destructive"
                onClick={async () => {
                  if (
                    window.confirm(
                      "¿Estás seguro de que deseas eliminar todas las intervenciones?"
                    )
                  ) {
                    await handleDeleteInterventions(
                      interventionsList.map((i) => i.id)
                    );
                  }
                }}
              >
                Eliminar Todo
              </Button>
              <Button
                variant="default"
                className="bg-[#2f4489] hover:bg-[#2f4489]/80 text-white"
                onClick={async () => {
                  if (
                    window.confirm(
                      "¿Estás seguro de que deseas enviar todas las intervenciones a SNIS?"
                    )
                  ) {
                    const response = await sendInterventionsToSNIS(
                      interventionsList.map((i) => i.id)
                    );
                    if (response) {
                      toast.success(
                        "Intervenciones enviadas a SNIS correctamente"
                      );
                      // Invalidate queries to refetch data
                      queryClient.invalidateQueries({
                        queryKey: ["interventions"],
                      });
                      queryClient.invalidateQueries({
                        queryKey: ["interventionsSummary"],
                      });
                    } else {
                      toast.error(
                        "Error al enviar las intervenciones a SNIS",
                        {}
                      );
                    }
                  }
                }}
              >
                Enviar Todo a SNIS
              </Button>
            </div>
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
                      JSON.parse(
                        localStorage.getItem("mano-a-mano-token") || "{}"
                      ).apiToken
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
                      {`Authorization: Bearer ${
                        JSON.parse(
                          localStorage.getItem("mano-a-mano-token") || "{}"
                        ).apiToken
                      }`}
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
                      {`POST /api/insertInterventions

Content-Type: application/json
Authorization: Bearer ${
                        JSON.parse(
                          localStorage.getItem("mano-a-mano-token") || "{}"
                        ).apiToken
                      }

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
      "trabaja": 1,                         // Opcional (1=Si, 2=No)
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
      "referencia": "Texto de referencia", // Opcional
      "discapacidad": 1                     // Requerido (1=Si, 2=No)
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

        {/* --- Summary Detail Modal --- */}
        {selectedSummaryItemForModal && (
          <Dialog
            open={isSummaryDetailModalOpen}
            onOpenChange={setIsSummaryDetailModalOpen}
          >
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Detalle del Resumen de Intervención</DialogTitle>
                <DialogDescription>
                  Información detallada para el programa y beneficio
                  seleccionado.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 items-center gap-4">
                  <span className="font-semibold text-right">Año:</span>
                  <span>
                    {interventionsSummary?.filters_applied?.año ||
                      appliedFilters.año ||
                      "Todos"}
                  </span>
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <span className="font-semibold text-right">Programa:</span>
                  <span>{selectedSummaryItemForModal.programa_nombre}</span>
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <span className="font-semibold text-right">Beneficio:</span>
                  <span>{selectedSummaryItemForModal.beneficio_nombre}</span>
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <span className="font-semibold text-right">
                    Total Entregas:
                  </span>
                  <span>{selectedSummaryItemForModal.total_entregas}</span>
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <span className="font-semibold text-right">Valor Total:</span>
                  <span>
                    Q
                    {selectedSummaryItemForModal.total_valor?.toLocaleString(
                      "es-GT",
                      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                    )}
                  </span>
                </div>
                {/* Add other fields from selectedSummaryItemForModal if needed */}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cerrar
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        {/* --- End Summary Detail Modal --- */}

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
