import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import handleBulkUpload from "@/services/bulk-upload";
interface UploadSectionProps {
  title: string;
  description: string;
  uploadType: "interventions" | "goals" | "executions";
}

const UploadSection = ({ description, uploadType }: UploadSectionProps) => {
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

    // Mock upload
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
        className="w-full"
      >
        Subir archivo
      </Button>
      <Toaster />
    </div>
  );
};

const AdminBulkUploadsSection = () => {
  return (
    <div className="w-full h-full flex flex-col justify-start items-start gap-4">
      <h2 className="text-2xl font-bold text-[#505050]">
        Carga de Datos / Mano a Mano
      </h2>
      <div className="w-full h-full flex flex-col justify-start items-start gap-4">
        <Accordion type="multiple" className="w-full space-y-4">
          <AccordionItem value="item-1" className="border rounded-lg px-4">
            <AccordionTrigger className="py-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium text-[#505050]">
                  Carga de intervenciones
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <UploadSection
                title="Carga de intervenciones"
                description={`El archivo CSV debe contener las siguientes columnas:

                  - Tipo de intervención (tipo_intervencion)
                  - CUI (cui)
                  - Número de teléfono (telefono)
                  - Departamento (departamento)
                  - Municipio (municipio)
                  - Lugar poblado (lugar_poblado)
                  - Latitud (latitud)
                  - Longitud (longitud)
                  - Institución (institucion)
                  - Intervención aplicada (intervencion_aplicada)
                  - Estado de intervención (estado_intervencion)
                  - URL de imagen (url_imagen)
                  - Nombre (nombre)
                  - CUI del promotor que entregó/realizó la intervención (cui_promotor)
                  `}
                uploadType="interventions"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border rounded-lg px-4">
            <AccordionTrigger className="py-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium text-[#505050]">
                  Carga de metas
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <UploadSection
                title="Carga de metas"
                description={`El archivo CSV debe contener las siguientes columnas:

                  - Departamento (departamento)
                  - Municipio (municipio)
                  - Lugar poblado (lugar_poblado)
                  - Intervención (intervencion)
                  - Meta (meta) - valor numérico
                  - Ejecutado (ejecutado) - valor numérico`}
                uploadType="goals"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border rounded-lg px-4">
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
      </div>
    </div>
  );
};

export default AdminBulkUploadsSection;
