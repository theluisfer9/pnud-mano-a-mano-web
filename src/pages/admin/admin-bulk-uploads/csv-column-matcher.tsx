import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CSVMatcherProps {
  columns: string[];
  data: { [key: string]: any }[];
  onClick: (mapping: { [key: string]: string }) => void;
}
// Predefined columns (you can modify this list as needed)
const predefinedColumns = [
  "id_hogar",
  "cui",
  "apellido1",
  "apellido2",
  "apellido_de_casada",
  "nombre1",
  "nombre2",
  "nombre3",
  "sexo",
  "fecha_nacimiento",
  "departamento_nacimiento",
  "municipio_nacimiento",
  "pueblo_pertenencia",
  "comunidad_linguistica",
  "idioma",
  "trabaja",
  "telefono",
  "escolaridad",
  "departamento_residencia",
  "municipio_residencia",
  "direccion_residencia",
  "institucion",
  "programa",
  "beneficio",
  "departamento_otorgamiento",
  "municipio_otorgamiento",
  "fecha_otorgamiento",
  "valor",
  "discapacidad",
];

export default function CSVColumnMatcher({
  columns,
  data,
  onClick,
}: CSVMatcherProps) {
  const [csvData, setCsvData] = useState<{ [key: string]: any }[]>([]);
  const [csvColumns, setCsvColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<{ [key: string]: string }>(
    {}
  );
  const [matchedColumns, setMatchedColumns] = useState<number>(0);
  useEffect(() => {
    const loadCSVData = async () => {
      setCsvColumns(columns);
      setCsvData(data);

      // Auto-match columns with exact names
      const initialMapping: { [key: string]: string } = {};
      let matched = 0;
      predefinedColumns.forEach((col) => {
        const index = columns.findIndex(
          (h) => h.toLowerCase() === col.toLowerCase()
        );
        if (index !== -1) {
          initialMapping[col] = columns[index];
          matched++;
        }
      });
      setColumnMapping(initialMapping);
      setMatchedColumns(matched);
    };

    loadCSVData();
  }, [columns, data]);

  const handleColumnAssignment = useCallback(
    (predefinedCol: string, csvCol: string) => {
      setColumnMapping((prev) => {
        const newMapping = { ...prev };

        // Remove the old assignment for this predefined column
        Object.keys(newMapping).forEach((key) => {
          if (newMapping[key] === csvCol) {
            delete newMapping[key];
          }
        });

        // Set the new assignment
        if (csvCol) {
          newMapping[predefinedCol] = csvCol;
        } else {
          delete newMapping[predefinedCol];
        }

        setMatchedColumns(Object.keys(newMapping).length);
        return newMapping;
      });
    },
    []
  );

  const isAllColumnsAssigned = matchedColumns === predefinedColumns.length;
  const missingColumns = predefinedColumns.length - matchedColumns;

  // Get the list of already assigned CSV columns
  const assignedCsvColumns = Object.values(columnMapping);

  // Create a mapping of CSV column names to their indices
  const csvColumnIndices = useMemo(() => {
    const indices: { [key: string]: number } = {};
    csvColumns.forEach((col, index) => {
      indices[col] = index;
    });
    return indices;
  }, [csvColumns]);

  // Generate the dynamic table data based on current assignments
  const dynamicTableData = useMemo(() => {
    const headers = predefinedColumns.filter((col) => columnMapping[col]);
    const data = csvData.map((row) =>
      headers.map((header) => {
        const csvCol = columnMapping[header];
        return csvCol ? row[csvCol] : null;
      })
    );
    return { headers, data };
  }, [csvData, columnMapping, csvColumnIndices]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">
          Visualización y asignación de columnas
        </h2>
        <p className="mb-4">
          {isAllColumnsAssigned
            ? "¡Todas las columnas han sido asignadas correctamente!"
            : `Faltan ${missingColumns} columna${
                missingColumns !== 1 ? "s" : ""
              } por asignar.`}
        </p>
        <div className="grid grid-cols-2 gap-4">
          {predefinedColumns.map((col) => {
            const isAssigned = !!columnMapping[col];
            return (
              <div key={col} className="flex items-center space-x-2">
                <span
                  className={`font-medium ${isAssigned ? "" : "text-red-500"}`}
                >
                  {col}:
                </span>
                <div className="relative flex-grow">
                  <Select
                    value={columnMapping[col] || ""}
                    onValueChange={(value) =>
                      handleColumnAssignment(col, value)
                    }
                  >
                    <SelectTrigger
                      className={`w-[220px] ${
                        isAssigned ? "" : "border-red-500"
                      }`}
                    >
                      <SelectValue placeholder="Seleccionar una columna" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Unassign">Desasignar</SelectItem>
                      {csvColumns.map((csvCol) => (
                        <SelectItem
                          key={csvCol}
                          value={csvCol}
                          disabled={
                            assignedCsvColumns.includes(csvCol) &&
                            columnMapping[col] !== csvCol
                          }
                        >
                          {csvCol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!isAssigned && (
                    <AlertCircle className="h-5 w-5 text-red-500 absolute right-8 top-1/2 transform -translate-y-1/2" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {dynamicTableData.headers.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">
            Vista previa del archivo a cargar
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                {dynamicTableData.headers.map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {dynamicTableData.data.slice(0, 5).map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>
                      {cell !== null ? cell : "N/A"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Button
        disabled={!isAllColumnsAssigned}
        onClick={() => {
          console.log("Column mapping:", columnMapping);
          onClick(columnMapping);
        }}
      >
        Cargar Archivo
      </Button>
    </div>
  );
}
