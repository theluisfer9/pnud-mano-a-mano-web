import { useState } from "react";
import type {
  New_RelacionConElemento,
  New_RelacionConElementoSimple,
} from "@/services/fichas";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  getFichasWithDetails,
  createFicha,
  updateFicha,
  deleteFicha,
  createFichaCabecera,
  createDelegado,
  createFichaAutoridad,
  Delegado,
  createPrograma,
  updatePrograma,
  deletePrograma,
  createBeneficio,
  updateBeneficio,
  deleteBeneficio,
  createBeneficioFuncionarioFocal,
  addBeneficioPoblacionObjetivoAssociation,
  addBeneficioFinalidadAssociation,
  addBeneficioClasificadorTematicoAssociation,
  addBeneficioObjetoAssociation,
  addBeneficioFormaAssociation,
  addBeneficioFocalizacionAssociation,
  getPoblacionObjetivoElementos,
  getFinalidadElementos,
  getClasificadorTematicoElementos,
  getObjetoElementos,
  getFormaElementos,
  getFocalizacionElementos,
  getBeneficiosWithDetailsByProgramaId,
  updateBeneficioFuncionarioFocal,
  deleteBeneficioPoblacionObjetivoAssociation,
  deleteBeneficioFinalidadAssociation,
  deleteBeneficioClasificadorTematicoAssociation,
  deleteBeneficioObjetoAssociation,
  deleteBeneficioFormaAssociation,
  deleteBeneficioFocalizacionAssociation,
} from "@/services/fichas";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { New_Beneficio as Beneficio } from "@/services/fichas";

interface Ficha {
  id: number;
  nombre: string;
  ano: string;
  estado: string;
  cabecera: FichaCabecera;
  programas?: Programa[];
}
interface FichaCabecera {
  id: number;
  institucion: string;
  siglas: string;
  nombreCorto: string;
  delegados: Delegado[];
  autoridad: {
    nombre: string;
    cargo: string;
  };
}
interface Programa {
  id: number;
  codigo: string;
  codigoSicoin: string;
  tipo: "programa" | "intervencion";
  nombreSicoin: string;
  nombreComun: string;
  descripcion: string;
  objetivo: string;
  marcoLegal: string;
  autoridad: {
    nombre: string;
    cargo: string;
  };
  funcionario: {
    nombre: string;
    cargo: string;
  };
  beneficios: Beneficio[];
}

const FichasSection = () => {
  const queryClient = useQueryClient();
  const { data: fichas, isLoading: isLoadingFichas } = useQuery({
    queryKey: ["fichas"],
    queryFn: getFichasWithDetails,
  });

  const {
    data: poblacionObjetivoElementos,
    isLoading: isLoadingPoblacionObjetivoElementos,
  } = useQuery({
    queryKey: ["poblacionObjetivoElementos"],
    queryFn: getPoblacionObjetivoElementos,
  });

  const { data: finalidadElementos, isLoading: isLoadingFinalidadElementos } =
    useQuery({
      queryKey: ["finalidadElementos"],
      queryFn: getFinalidadElementos,
    });

  const {
    data: clasificadorTematicoElementos,
    isLoading: isLoadingClasificadorTematicoElementos,
  } = useQuery({
    queryKey: ["clasificadorTematicoElementos"],
    queryFn: getClasificadorTematicoElementos,
  });

  const { data: objetoElementos, isLoading: isLoadingObjetoElementos } =
    useQuery({
      queryKey: ["objetoElementos"],
      queryFn: getObjetoElementos,
    });

  const { data: formaElementos, isLoading: isLoadingFormaElementos } = useQuery(
    {
      queryKey: ["formaElementos"],
      queryFn: getFormaElementos,
    }
  );

  const {
    data: focalizacionElementos,
    isLoading: isLoadingFocalizacionElementos,
  } = useQuery({
    queryKey: ["focalizacionElementos"],
    queryFn: getFocalizacionElementos,
  });

  // State to control the visibility of the creation form
  const [isCreatingFicha, setIsCreatingFicha] = useState(false);

  // Define initial empty state for Ficha Cabecera
  const initialFichaCabecera: FichaCabecera = {
    id: 0,
    institucion: "",
    siglas: "",
    nombreCorto: "",
    delegados: [
      { id: 0, nombre: "", telefono: "", rol: "", correo: "" },
      { id: 0, nombre: "", telefono: "", rol: "", correo: "" },
      { id: 0, nombre: "", telefono: "", rol: "", correo: "" },
    ],
    autoridad: { nombre: "", cargo: "" },
  };

  // State to hold the data for the new/editing ficha being created
  const [newFichaCabecera, setNewFichaCabecera] =
    useState<FichaCabecera>(initialFichaCabecera);
  const [editingFicha, setEditingFicha] = useState<Ficha | null>(null); // State to track the ficha being edited
  const [fichaToDelete, setFichaToDelete] = useState<Ficha | null>(null); // State for delete confirmation

  // --- New State Variables ---
  // State to track the ficha whose programs are being viewed/edited
  const [viewingFicha, setViewingFicha] = useState<Ficha | null>(null);
  // State to control visibility of the program creation form for the selected ficha
  const [isCreatingPrograma, setIsCreatingPrograma] = useState(false);
  // State to hold data for the new program being created
  const [newProgramaData, setNewProgramaData] = useState<
    Omit<Programa, "beneficios">
  >({
    id: 0,
    codigo: "",
    codigoSicoin: "",
    tipo: "programa",
    nombreSicoin: "",
    nombreComun: "",
    descripcion: "",
    objetivo: "",
    marcoLegal: "",
    autoridad: { nombre: "", cargo: "" },
    funcionario: { nombre: "", cargo: "" },
  });
  // State to track the program being edited (includes fichaId for context)
  const [editingPrograma, setEditingPrograma] = useState<{
    id: number;
    fichaId: number;
    // Store the *original* program being edited, mainly its code/id
    // The form fields will bind to newProgramaData
    programaCodigo: string;
  } | null>(null);
  // State to track the program being deleted (includes fichaId for context)
  const [programaToDelete, setProgramaToDelete] = useState<{
    id: number;
    fichaId: number;
    programaCodigo: string;
    programaNombre: string; // For the confirmation message
  } | null>(null);
  // --- End New State Variables ---

  // --- Beneficio State Variables ---
  const [viewingPrograma, setViewingPrograma] = useState<Programa | null>(null); // Track selected program
  const [isCreatingBeneficio, setIsCreatingBeneficio] = useState(false); // Control create modal
  const [isEditingBeneficio, setIsEditingBeneficio] = useState(false); // Control edit modal
  const [editingBeneficio, setEditingBeneficio] = useState<Beneficio | null>(
    null
  ); // Control edit modal
  const [beneficioToDelete, setBeneficioToDelete] = useState<Beneficio | null>(
    null
  ); // Control delete dialog

  // Initial empty state for a new benefit - Now fully defined
  const initialNewBeneficioData: Omit<
    Beneficio,
    "id" | "codigoPrograma" | "nombrePrograma" | "programaId"
  > = {
    codigo: "",
    codigoSicoin: "",
    nombreSubproducto: "",
    nombreCorto: "",
    nombre: "",
    descripcion: "",
    objetivo: "",
    tipo: "individual",
    criteriosInclusion: "",
    atencionSocial: "protección",
    rangoEdad: "Adultos",
    poblacionObjetivo: [],
    finalidad: [],
    clasificadorTematico: [],
    objeto: [],
    forma: [],
    focalizacion: [],
    funcionarioFocal: { nombre: "", cargo: "", beneficioId: 0 },
  };

  const [newBeneficioData, setNewBeneficioData] = useState<
    Omit<Beneficio, "id" | "codigoPrograma" | "nombrePrograma" | "programaId">
  >(initialNewBeneficioData);
  // --- End Beneficio State Variables ---

  // Handler for input changes in the form
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: keyof FichaCabecera | "delegado" | "autoridad",
    index?: number,
    field?: string
  ) => {
    const { value } = e.target;

    if (section === "delegado" && index !== undefined && field) {
      const updatedDelegados = [...newFichaCabecera.delegados];
      updatedDelegados[index] = {
        ...updatedDelegados[index],
        [field]: value,
      };
      setNewFichaCabecera({
        ...newFichaCabecera,
        delegados: updatedDelegados,
      });
    } else if (section === "autoridad" && field) {
      setNewFichaCabecera({
        ...newFichaCabecera,
        autoridad: { ...newFichaCabecera.autoridad, [field]: value },
      });
    } else if (
      section !== "delegado" &&
      section !== "autoridad" &&
      section !== "delegados" // Ensure 'delegados' itself is not treated as a direct field
    ) {
      setNewFichaCabecera({
        ...newFichaCabecera,
        [section]: value, // Use 'section' which corresponds to institucion, siglas, nombreCorto
      });
    }
  };

  // Handler to add a new empty delegado if less than 3 exist
  const handleAddDelegado = () => {
    setNewFichaCabecera((prev) => {
      if (prev.delegados.length < 3) {
        return {
          ...prev,
          delegados: [
            ...prev.delegados,
            { id: 0, nombre: "", telefono: "", rol: "", correo: "" }, // Add empty delegado
          ],
        };
      }
      return prev; // Return previous state if already 3 or more
    });
  };

  // Handler to create or update the ficha
  const handleSubmitFicha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFicha) {
      // --- Update Logic ---
      const updatedFicha: Ficha = {
        ...editingFicha, // Keep id, ano, estado, programas etc. from the original
        cabecera: newFichaCabecera,
        // Optionally update the name based on the new cabecera data
        nombre:
          newFichaCabecera.siglas ||
          newFichaCabecera.nombreCorto ||
          newFichaCabecera.institucion,
      };

      // Convert the component Ficha to the API's Ficha format
      const apiFormatFicha: Partial<Ficha> = {
        ...updatedFicha,
        cabecera: {
          ...updatedFicha.cabecera,
          delegados: updatedFicha.cabecera.delegados.map((d) => ({
            ...d,
            id: d.id,
          })),
        },
        // Convert programas to match API format
        programas: updatedFicha.programas?.map((prog) => ({
          ...prog,
          id: prog.id,
          // Fix: Convert benefit IDs from number to string to match expected type
          beneficios: prog.beneficios,
        })),
      };

      // Now pass it to the API function
      updateFicha(editingFicha.id, apiFormatFicha);

      // Invalidate and refetch fichas after update
      queryClient.invalidateQueries({ queryKey: ["fichas"] });

      setEditingFicha(null); // Clear editing state
    } else {
      // --- Create Logic ---
      if (!fichas || (typeof fichas === "object" && "error" in fichas)) {
        return;
      }
      const newFicha: Ficha = {
        // Generate a more robust unique ID
        id: fichas.length > 0 ? Math.max(...fichas.map((f) => f.id)) + 1 : 1,
        nombre:
          newFichaCabecera.siglas ||
          newFichaCabecera.nombreCorto ||
          newFichaCabecera.institucion, // Example name derivation
        ano: new Date().getFullYear().toString(), // Default to current year
        estado: "Pendiente", // Default status
        cabecera: newFichaCabecera,
        programas: [],
      };
      const fichaResponse = await createFicha({
        id: newFicha.id,
        nombre: newFicha.nombre,
        ano: newFicha.ano,
        estado: newFicha.estado,
      });
      if ("error" in fichaResponse) {
        console.error("Error creating ficha:", fichaResponse.error);
        return;
      }
      const fichaId = fichaResponse.fichaId;
      // Now create the cabecera
      const cabeceraResponse = await createFichaCabecera(fichaId, {
        institucion: newFichaCabecera.institucion,
        siglas: newFichaCabecera.siglas,
        nombreCorto: newFichaCabecera.nombreCorto,
        id: 0,
      });

      // Check for error (if it's an object with 'error' property)
      if (typeof cabeceraResponse === "object" && "error" in cabeceraResponse) {
        console.error("Error creating cabecera:", cabeceraResponse.error);
        return;
      }
      // Success case (when response is a boolean)
      const delegado1Promise = createDelegado(fichaId, {
        id: 0,
        nombre: newFichaCabecera.delegados[0].nombre,
        telefono: newFichaCabecera.delegados[0].telefono,
        rol: newFichaCabecera.delegados[0].rol,
        correo: newFichaCabecera.delegados[0].correo,
      });
      const delegado2Promise = createDelegado(fichaId, {
        id: 0,
        nombre: newFichaCabecera.delegados[1].nombre,
        telefono: newFichaCabecera.delegados[1].telefono,
        rol: newFichaCabecera.delegados[1].rol,
        correo: newFichaCabecera.delegados[1].correo,
      });
      const delegado3Promise = createDelegado(fichaId, {
        id: 0,
        nombre: newFichaCabecera.delegados[2].nombre,
        telefono: newFichaCabecera.delegados[2].telefono,
        rol: newFichaCabecera.delegados[2].rol,
        correo: newFichaCabecera.delegados[2].correo,
      });
      const [delegado1, delegado2, delegado3] = await Promise.all([
        delegado1Promise,
        delegado2Promise,
        delegado3Promise,
      ]);
      if (
        "error" in delegado1 ||
        "error" in delegado2 ||
        "error" in delegado3
      ) {
        console.error("Error creating delegados:", {
          delegado1: "error" in delegado1 ? delegado1.error : null,
          delegado2: "error" in delegado2 ? delegado2.error : null,
          delegado3: "error" in delegado3 ? delegado3.error : null,
        });
        return;
      }
      const autoridadResponse = await createFichaAutoridad(fichaId, {
        nombre: newFichaCabecera.autoridad.nombre,
        cargo: newFichaCabecera.autoridad.cargo,
      });
      if ("error" in autoridadResponse) {
        console.error("Error creating autoridad:", autoridadResponse.error);
        return;
      }
      // Success, show success message
      toast.success("Ficha creada exitosamente");
      // Invalidate and refetch fichas after create
      queryClient.invalidateQueries({ queryKey: ["fichas"] });
    }
    // Reset form and hide it
    setNewFichaCabecera(initialFichaCabecera); // Reset to initial empty state
    setIsCreatingFicha(false);
  };

  // Handler to initiate editing a ficha
  const handleEditFicha = (fichaId: number) => {
    if (!fichas || (typeof fichas === "object" && "error" in fichas)) {
      return;
    }
    const fichaToEdit = fichas.find((f) => f.id === fichaId);
    if (fichaToEdit) {
      // Cast to component Ficha type with guaranteed non-undefined properties
      const normalizedFicha = {
        ...fichaToEdit,
        cabecera: fichaToEdit.cabecera || initialFichaCabecera,
        programas: (fichaToEdit.programas || []).map((prog) => ({
          ...prog,
          beneficios: prog.beneficios || [],
        })),
      } as Ficha;
      setEditingFicha(normalizedFicha);
      setNewFichaCabecera({
        ...(fichaToEdit.cabecera || initialFichaCabecera),
      });
      setIsCreatingFicha(true);
      setViewingFicha(null);
    }
  };

  // --- New Handlers ---
  // Handler for input changes in the program creation form
  const handleProgramaInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    section?: "autoridad" | "funcionario",
    field?: string
  ) => {
    const { name, value } = e.target;

    if (section === "autoridad" && field) {
      setNewProgramaData((prev) => ({
        ...prev,
        autoridad: { ...prev.autoridad, [field]: value },
      }));
    } else if (section === "funcionario" && field) {
      setNewProgramaData((prev) => ({
        ...prev,
        funcionario: { ...prev.funcionario, [field]: value },
      }));
    } else {
      // Handle top-level fields including 'tipo' select
      setNewProgramaData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handler to add the new program to the currently viewed ficha
  const handleSubmitPrograma = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingFicha) return;

    // --- Edit Logic ---
    if (editingPrograma) {
      const updatedProgramData: Omit<Programa, "beneficios"> = {
        ...newProgramaData, // Data from the form
        codigo: editingPrograma.programaCodigo, // Ensure original code is kept if needed, or use newProgramaData.codigo if editable
      };

      const updatedProgramResponse = await updatePrograma(
        editingPrograma.id,
        updatedProgramData
      );
      if ("error" in updatedProgramResponse) {
        console.error("Error updating programa:", updatedProgramResponse.error);
        toast.error("Error al actualizar el programa");
        return;
      }
      // Invalidate and refetch fichas after update
      queryClient.invalidateQueries({ queryKey: ["fichas"] });

      // Update the viewingFicha state as well to reflect the change immediately in the UI
      setViewingFicha((prev) =>
        prev && prev.id === editingPrograma.fichaId
          ? {
              ...prev,
              programas: prev.programas?.map((prog) =>
                prog.codigo === editingPrograma.programaCodigo
                  ? { ...prog, ...updatedProgramData } // Update existing program, keep benefits
                  : prog
              ),
            }
          : prev
      );

      setEditingPrograma(null); // Clear editing state
    }
    // --- Create Logic ---
    else {
      const newProgramaWithIdAndBenefits: Programa = {
        ...newProgramaData,
        codigo:
          newProgramaData.codigo ||
          `PROG-${viewingFicha.id}-${
            (viewingFicha.programas?.length || 0) + 1
          }`,
        beneficios: [], // Initialize with empty benefits array
      };
      const programaResponse = await createPrograma(viewingFicha.id, {
        ...newProgramaWithIdAndBenefits,
        id: 0,
      });
      if ("error" in programaResponse) {
        console.error("Error creating programa:", programaResponse.error);
        return;
      }
      // Success, show success message
      toast.success("Programa creado exitosamente");
      // Invalidate and refetch fichas after create
      queryClient.invalidateQueries({ queryKey: ["fichas"] });

      setViewingFicha((prev) =>
        prev
          ? {
              ...prev,
              programas: [
                ...(prev.programas || []),
                newProgramaWithIdAndBenefits,
              ],
            }
          : null
      );
    }

    // Reset form and state for both create and edit
    setIsCreatingPrograma(false);
    setNewProgramaData({
      // Reset to initial empty state
      id: 0,
      codigo: "",
      codigoSicoin: "",
      tipo: "programa",
      nombreSicoin: "",
      nombreComun: "",
      descripcion: "",
      objetivo: "",
      marcoLegal: "",
      autoridad: { nombre: "", cargo: "" },
      funcionario: { nombre: "", cargo: "" },
    });
  };

  const handleEditPrograma = (programaCodigo: string) => {
    if (!viewingFicha) return;
    const programaToEdit = viewingFicha.programas?.find(
      (p) => p.codigo === programaCodigo
    );
    if (programaToEdit) {
      // 1. Populate the form state (newProgramaData) with the program's current data
      setNewProgramaData({
        id: programaToEdit.id,
        codigo: programaToEdit.codigo,
        codigoSicoin: programaToEdit.codigoSicoin,
        tipo: programaToEdit.tipo,
        nombreSicoin: programaToEdit.nombreSicoin,
        nombreComun: programaToEdit.nombreComun,
        descripcion: programaToEdit.descripcion,
        objetivo: programaToEdit.objetivo,
        marcoLegal: programaToEdit.marcoLegal,
        autoridad: { ...programaToEdit.autoridad }, // Ensure deep copy for objects
        funcionario: { ...programaToEdit.funcionario }, // Ensure deep copy for objects
      });
      // 2. Set the editingPrograma state to indicate we are editing
      setEditingPrograma({
        id: programaToEdit.id,
        fichaId: viewingFicha.id,
        programaCodigo: programaToEdit.codigo, // Store the code/id of the program being edited
      });
      // 3. Show the form
      setIsCreatingPrograma(true);
      setViewingPrograma(null); // Ensure we are not in benefit view
    }
  };
  // Handler to set the ficha to view programs for
  const handleViewPrograms = (fichaId: number) => {
    if (!fichas || (typeof fichas === "object" && "error" in fichas)) {
      return;
    }
    const fichaToView = fichas.find((f) => f.id === fichaId);
    if (fichaToView) {
      // Cast to component Ficha type with guaranteed non-undefined properties
      const normalizedFicha = {
        ...fichaToView,
        cabecera: fichaToView.cabecera || initialFichaCabecera,
        programas: (fichaToView.programas || []).map((prog) => ({
          ...prog,
          beneficios: prog.beneficios || [],
        })),
      } as Ficha;

      setViewingFicha(normalizedFicha);
      setIsCreatingFicha(false);
      setIsCreatingPrograma(false);
      setViewingPrograma(null);
      setEditingPrograma(null);
      if (normalizedFicha.programas?.[0]?.id) {
        handleViewBeneficiosDetails(normalizedFicha.programas?.[0].id);
      }
    }
  };

  // Handler to go back to the main fichas list
  const handleBackToFichas = () => {
    setViewingFicha(null);
    setIsCreatingPrograma(false);
    setViewingPrograma(null); // Also clear viewing programa
    setEditingPrograma(null); // Reset program editing state
  };
  // --- End New Handlers ---

  // --- Beneficio Handlers ---

  // Navigate to the benefits view for a specific program
  const handleViewBeneficios = async (programaCodigo: string) => {
    if (!viewingFicha) return;
    const programa = viewingFicha.programas?.find(
      (p) => p.codigo === programaCodigo
    );
    if (programa) {
      setViewingPrograma(programa);
      await handleViewBeneficiosDetails(programa.id);
      // Reset other states if necessary
      setIsCreatingPrograma(false);
      setIsCreatingBeneficio(false);
      setEditingBeneficio(null);
      setBeneficioToDelete(null);
    }
  };
  const handleViewBeneficiosDetails = async (programaId: number) => {
    if (!programaId) return;
    try {
      const beneficios = await getBeneficiosWithDetailsByProgramaId(programaId);
      if ("error" in beneficios) {
        console.error("Error fetching beneficios:", beneficios.error);
        return;
      }
      // Convert API response to Beneficio format with proper mapping
      const beneficiosConverted: Beneficio[] = beneficios.map((beneficio) => ({
        id: beneficio.id,
        programaId: beneficio.programaId,
        codigoPrograma: beneficio.codigoPrograma || "",
        nombrePrograma: beneficio.nombrePrograma || "",
        codigo: beneficio.codigo || "",
        codigoSicoin: beneficio.codigoSicoin || "",
        nombreSubproducto: beneficio.nombreSubproducto || "",
        nombreCorto: beneficio.nombreCorto || "",
        nombre: beneficio.nombre || "",
        descripcion: beneficio.descripcion || "",
        objetivo: beneficio.objetivo || "",
        tipo: beneficio.tipo as
          | "individual"
          | "familiar"
          | "comunitario"
          | "actores sociales",
        criteriosInclusion: beneficio.criteriosInclusion || "",
        atencionSocial: beneficio.atencionSocial as
          | "protección"
          | "asistencia"
          | "promoción",
        rangoEdad: beneficio.rangoEdad as
          | "Primera infancia"
          | "Infancia"
          | "Adolescencia"
          | "Juventud"
          | "Adultos"
          | "Adultos mayores",
        poblacionObjetivo: beneficio.poblacionObjetivo,
        finalidad: beneficio.finalidad,
        clasificadorTematico: beneficio.clasificadorTematico,
        objeto: beneficio.objeto,
        forma: beneficio.forma,
        focalizacion: beneficio.focalizacion,
        funcionarioFocal: beneficio.funcionarioFocal,
      }));
      setViewingFicha((prev) =>
        prev
          ? {
              ...prev,
              programas: prev.programas?.map((programa) =>
                programa.id === programaId
                  ? { ...programa, beneficios: beneficiosConverted }
                  : programa
              ),
            }
          : null
      );
      setViewingPrograma((prev) =>
        prev ? { ...prev, beneficios: beneficiosConverted } : null
      );
    } catch (error) {
      console.error("Error fetching beneficios:", error);
    }
  };

  // Navigate back from benefits view to programs view
  const handleBackToProgramas = () => {
    setViewingPrograma(null);
    // Reset benefit-specific states
    setIsCreatingBeneficio(false);
    setEditingBeneficio(null);
    setBeneficioToDelete(null);
  };

  // Handle input changes for the new/editing beneficio form (Updated for nesting and arrays)
  const handleBeneficioInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const inputElement = e.target as HTMLInputElement;
    const dataset = (inputElement as HTMLElement).dataset; // Access dataset

    // --- Identify Checkbox Group Type ---
    const fieldType = dataset.fieldType as
      | keyof Pick<
          Beneficio,
          | "poblacionObjetivo"
          | "finalidad"
          | "clasificadorTematico"
          | "objeto"
          | "forma"
          | "focalizacion"
        >
      | undefined; // Type assertion for safety

    setNewBeneficioData((prev) => {
      const newState = JSON.parse(JSON.stringify(prev));

      // --- Handle Checkbox Groups (poblacionObjetivo, finalidad, etc.) ---
      if (fieldType && type === "checkbox" && dataset.elemento) {
        const elementoId = parseInt(value, 10); // Checkbox value is the elementoId
        const elementoData = JSON.parse(dataset.elemento); // Get element data from dataset
        const isChecked = inputElement.checked;

        // Ensure the target array exists in the state
        if (!Array.isArray(newState[fieldType])) {
          newState[fieldType] = [];
        }

        // Current array for the field type
        const currentArray: New_RelacionConElemento[] = newState[fieldType];

        if (isChecked) {
          // Add element if checked and not already present
          if (!currentArray.some((rel) => rel.elementoId === elementoId)) {
            // Construct the New_RelacionConElemento object
            // beneficioId will be set later during submission if needed, keep 0 for now
            const newRelation: New_RelacionConElemento = {
              id: 0, // Will be assigned by backend
              beneficioId: 0, // Placeholder, will be set on creation
              elementoId: elementoId,
              elemento: elementoData, // Include the full element data
            };
            newState[fieldType] = [...currentArray, newRelation];
          }
        } else {
          // Remove element if unchecked
          newState[fieldType] = currentArray.filter(
            (rel) => rel.elementoId !== elementoId
          );
        }
      }
      // --- Handle Nested Objects (like funcionarioFocal) ---
      else if (name.includes(".")) {
        const keys = name.split(".");
        let currentLevel: any = newState;

        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i].trim();
          if (
            !currentLevel[key] ||
            typeof currentLevel[key] !== "object" ||
            currentLevel[key] === null
          ) {
            currentLevel[key] = {};
          }
          currentLevel = currentLevel[key];
        }

        const finalKey = keys[keys.length - 1].trim();
        const targetValue = type === "checkbox" ? inputElement.checked : value;
        if (typeof currentLevel === "object" && currentLevel !== null) {
          currentLevel[finalKey] = targetValue;
        } else {
          console.error(
            "Error setting nested property: parent level is not an object.",
            { name, keyHierarchy: keys, parentLevel: currentLevel }
          );
        }
      }
      // --- Handle 'rangoEdad' (Assuming Radio Button like behavior) ---
      else if (name === "rangoEdad" && type === "checkbox") {
        if (inputElement.checked) {
          (newState as any)[name] = value;
        }
        // No change if unchecked (radio button behavior)
      }
      // --- Handle Direct Properties ---
      else if (name in newState) {
        const targetValue = type === "checkbox" ? inputElement.checked : value;
        (newState as any)[name] = targetValue;
      }
      return newState;
    });
  };

  // Add a new benefit to the current program
  const handleAddBeneficio = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding new benefit");
    if (!viewingFicha || !viewingPrograma) return;

    const newBenefit: Beneficio = {
      ...newBeneficioData,
      id: 0, // Generate a unique ID for the benefit
      programaId: viewingPrograma.id,
      codigoPrograma: viewingPrograma.codigo,
      nombrePrograma: viewingPrograma.nombreComun,
    };

    const createBeneficioResponse = await createBeneficio(
      viewingPrograma.id,
      newBeneficioData // Pass the structured data
    );

    if ("error" in createBeneficioResponse) {
      console.error("Error creating benefit:", createBeneficioResponse.error);
      toast.error("Error al crear el beneficio");
      return;
    }

    // Create associated entities
    try {
      // Create funcionario focal
      const funcionarioResponse = await createBeneficioFuncionarioFocal(
        createBeneficioResponse.beneficioId,
        newBenefit.funcionarioFocal
      );
      if (
        typeof funcionarioResponse === "object" &&
        "error" in funcionarioResponse
      ) {
        console.error(
          "Error creating funcionario focal:",
          funcionarioResponse.error
        );
        toast.error("Error al crear relaciones del beneficio");
        return;
      }

      // Create población objetivo
      if (!poblacionObjetivoElementos || "error" in poblacionObjetivoElementos)
        return;
      const poblacionResponse = await addBeneficioPoblacionObjetivoAssociation(
        createBeneficioResponse.beneficioId,
        newBeneficioData.poblacionObjetivo
      );
      if (
        typeof poblacionResponse === "object" &&
        "error" in poblacionResponse
      ) {
        console.error(
          "Error creating población objetivo:",
          poblacionResponse.error
        );
        toast.error("Error al crear relaciones del beneficio");
        return;
      }

      // Create finalidad
      if (!finalidadElementos || "error" in finalidadElementos) return;
      const finalidadResponse = await addBeneficioFinalidadAssociation(
        createBeneficioResponse.beneficioId,
        newBeneficioData.finalidad
      );
      if (
        typeof finalidadResponse === "object" &&
        "error" in finalidadResponse
      ) {
        console.error("Error creating finalidad:", finalidadResponse.error);
        toast.error("Error al crear relaciones del beneficio");
        return;
      }

      // Create clasificador temático
      if (
        !clasificadorTematicoElementos ||
        "error" in clasificadorTematicoElementos
      )
        return;
      const clasificadorResponse =
        await addBeneficioClasificadorTematicoAssociation(
          createBeneficioResponse.beneficioId,
          newBeneficioData.clasificadorTematico
        );
      if (
        typeof clasificadorResponse === "object" &&
        "error" in clasificadorResponse
      ) {
        console.error(
          "Error creating clasificador temático:",
          clasificadorResponse.error
        );
        toast.error("Error al crear relaciones del beneficio");
        return;
      }

      // Create objeto
      if (!objetoElementos || "error" in objetoElementos) return;
      const objetoResponse = await addBeneficioObjetoAssociation(
        createBeneficioResponse.beneficioId,
        newBeneficioData.objeto
      );
      if (typeof objetoResponse === "object" && "error" in objetoResponse) {
        console.error("Error creating objeto:", objetoResponse.error);
        toast.error("Error al crear relaciones del beneficio");
        return;
      }

      // Create forma
      if (!formaElementos || "error" in formaElementos) return;
      const formaResponse = await addBeneficioFormaAssociation(
        createBeneficioResponse.beneficioId,
        newBeneficioData.forma
      );
      if (typeof formaResponse === "object" && "error" in formaResponse) {
        console.error("Error creating forma:", formaResponse.error);
        toast.error("Error al crear relaciones del beneficio");
        return;
      }

      // Create focalización
      if (!focalizacionElementos || "error" in focalizacionElementos) return;
      const focalizacionResponse = await addBeneficioFocalizacionAssociation(
        createBeneficioResponse.beneficioId,
        newBeneficioData.focalizacion
      );
      if (
        typeof focalizacionResponse === "object" &&
        "error" in focalizacionResponse
      ) {
        console.error(
          "Error creating focalización:",
          focalizacionResponse.error
        );
        toast.error("Error al crear relaciones del beneficio");
        return;
      }
    } catch (error) {
      console.error("Error creating benefit associations:", error);
      toast.error("Error al crear relaciones del beneficio");
      return;
    }

    toast.success("Beneficio creado exitosamente");

    // --- Manually Update Local State for Immediate UI Feedback ---
    // Construct the newly created beneficio object as it should appear in the UI state
    const newlyAddedBeneficio: Beneficio = {
      ...newBeneficioData, // Spread the data from the form state
      id: createBeneficioResponse.beneficioId, // Add the ID returned from the backend
      programaId: viewingPrograma.id,
      codigoPrograma: viewingPrograma.codigo,
      nombrePrograma: viewingPrograma.nombreComun,
      // Ensure relation arrays (poblacionObjetivo, etc.) are correctly structured
      // The handleBeneficioInputChange should already be doing this.
    };

    // Update the viewingPrograma state
    setViewingPrograma((currentViewingPrograma) => {
      if (!currentViewingPrograma) return null; // Should not happen here, but good practice
      return {
        ...currentViewingPrograma,
        beneficios: [
          ...(currentViewingPrograma.beneficios || []), // Keep existing benefits
          newlyAddedBeneficio, // Add the new one
        ],
      };
    });
    // --- Local State Updated ---

    // --- Invalidate Queries for Background Sync & Consistency ---
    queryClient.invalidateQueries({ queryKey: ["fichas"] });

    // Close modal and reset form
    setIsCreatingBeneficio(false);
    setNewBeneficioData(initialNewBeneficioData); // Reset to the fully defined initial state

    // --- Remove explicit refetch call ---
    // handleViewBeneficiosDetails(viewingPrograma.id); // No longer needed for immediate update
  };

  // Open the delete confirmation
  const handleOpenDeleteBeneficioModal = (beneficio: Beneficio) => {
    setBeneficioToDelete(beneficio);
  };

  // Handle the actual deletion
  const handleDeleteBeneficio = async () => {
    if (!viewingFicha || !viewingPrograma || !beneficioToDelete) return;
    const deletedBeneficio = await deleteBeneficio(beneficioToDelete.id);
    if (deletedBeneficio === true) {
      setBeneficioToDelete(null); // Close the dialog
      toast.success("Beneficio eliminado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["fichas"] });
    } else if (
      typeof deletedBeneficio === "object" &&
      "error" in deletedBeneficio
    ) {
      toast.error("Error al eliminar el beneficio: " + deletedBeneficio.error);
    } else {
      toast.error("Error desconocido al eliminar el beneficio");
    }
  };

  // Open edit modal for a beneficio
  const handleOpenEditBeneficioModal = (beneficio: Beneficio) => {
    setEditingBeneficio(beneficio);
    setIsEditingBeneficio(true);
    // Pre-populate the form with the beneficio data, omitting properties not in the form state
    const { id, codigoPrograma, nombrePrograma, ...formData } = beneficio;
    setNewBeneficioData(formData);
  };
  const getElementIds = (
    relations:
      | New_RelacionConElemento[]
      | New_RelacionConElementoSimple[]
      | undefined
  ): number[] => {
    return (relations || []).map((rel) => rel.elementoId);
  };
  // Handle editing a beneficio
  const handleEditBeneficio = async (updatedBeneficio: Beneficio) => {
    console.log("Editing benefit");
    try {
      if (!viewingFicha || !viewingPrograma) return;
      const currentBeneficio = viewingPrograma.beneficios.find(
        (b) => b.id === updatedBeneficio.id
      );
      console.log("Current benefit", currentBeneficio);
      console.log("Updated benefit", updatedBeneficio);
      if (!currentBeneficio) {
        toast.error("Beneficio no encontrado");
        return;
      }
      // TODO: First update the beneficio (codigo, codigoSicoin, nombreCorto, nombre, descripcion, objetivo, tipo, criteriosInclusion, atencionSocial, rangoEdad) if it has changed
      const hasChanged = Object.keys(updatedBeneficio).some(
        (key) =>
          updatedBeneficio[key as keyof Beneficio] !==
          currentBeneficio[key as keyof Beneficio]
      );
      if (hasChanged) {
        const {
          id,
          poblacionObjetivo,
          finalidad,
          clasificadorTematico,
          objeto,
          forma,
          focalizacion,
          funcionarioFocal,
          ...rest
        } = updatedBeneficio;
        const updatedBeneficioResponse = await updateBeneficio(
          updatedBeneficio.id,
          rest
        );
        if (
          typeof updatedBeneficioResponse === "object" &&
          "error" in updatedBeneficioResponse
        ) {
          toast.error("Error al actualizar el beneficio");
          return;
        }
      }
      // Then, update the funcionario focal, if it has changed
      const funcionarioChanged =
        updatedBeneficio.funcionarioFocal.nombre !==
          currentBeneficio.funcionarioFocal.nombre ||
        updatedBeneficio.funcionarioFocal.cargo !==
          currentBeneficio.funcionarioFocal.cargo;
      // Add checks for any other relevant fields if they exist
      if (funcionarioChanged) {
        const funcionarioResponse = await updateBeneficioFuncionarioFocal(
          updatedBeneficio.id,
          updatedBeneficio.funcionarioFocal
        );
        if (
          typeof funcionarioResponse === "object" &&
          "error" in funcionarioResponse
        ) {
          toast.error("Error al actualizar el funcionario focal");
          return;
        }
      }
      // If an element is not present in the new beneficio, remove it from the associations
      // If an element is present in the new beneficio, add it to the associations
      // Save the new associations
      // Delete removed population objective associations
      // Poblacion Objetivo
      const currentPoblacionIds = getElementIds(
        currentBeneficio.poblacionObjetivo
      );
      const updatedPoblacionIds = getElementIds(
        updatedBeneficio.poblacionObjetivo
      );

      const poblacionObjetivoAssociationsToDelete = (
        currentBeneficio.poblacionObjetivo || []
      ).filter(
        (poblacion) => !updatedPoblacionIds.includes(poblacion.elementoId) // Compare by elementoId
      );
      const poblacionObjetivoAssociationsToAdd = (
        updatedBeneficio.poblacionObjetivo || []
      ).filter(
        (poblacion) => !currentPoblacionIds.includes(poblacion.elementoId) // Compare by elementoId
      );
      if (poblacionObjetivoAssociationsToDelete.length > 0) {
        // Promise.all to delete all associations
        const deleteResponses = await Promise.all(
          poblacionObjetivoAssociationsToDelete.map((poblacion) =>
            deleteBeneficioPoblacionObjetivoAssociation(
              updatedBeneficio.id,
              poblacion.elementoId
            )
          )
        );
        deleteResponses.forEach((response) => {
          if (typeof response === "object" && "error" in response) {
            toast.error(
              "Error al eliminar la población objetivo: " + response.error
            );
            return;
          }
        });
      }
      if (poblacionObjetivoAssociationsToAdd.length > 0) {
        const addResponses = await addBeneficioPoblacionObjetivoAssociation(
          updatedBeneficio.id,
          poblacionObjetivoAssociationsToAdd
        );
        if (typeof addResponses === "object" && "error" in addResponses) {
          toast.error(
            "Error al agregar la población objetivo: " + addResponses.error
          );
          return;
        }
      }

      // --- Finalidad --- (Apply similar logic)
      const currentFinalidadIds = getElementIds(currentBeneficio.finalidad);
      const updatedFinalidadIds = getElementIds(updatedBeneficio.finalidad);

      const finalidadAssociationsToDelete = (
        currentBeneficio.finalidad || []
      ).filter(
        (finalidad) => !updatedFinalidadIds.includes(finalidad.elementoId)
      );
      const finalidadAssociationsToAdd = (
        updatedBeneficio.finalidad || []
      ).filter(
        (finalidad) => !currentFinalidadIds.includes(finalidad.elementoId)
      );
      if (finalidadAssociationsToDelete.length > 0) {
        const deleteResponses = await Promise.all(
          finalidadAssociationsToDelete.map((finalidad) =>
            deleteBeneficioFinalidadAssociation(
              updatedBeneficio.id,
              finalidad.elementoId
            )
          )
        );
        deleteResponses.forEach((response) => {
          if (typeof response === "object" && "error" in response) {
            toast.error("Error al eliminar la finalidad: " + response.error);
            return;
          }
        });
      }
      if (finalidadAssociationsToAdd.length > 0) {
        const addResponses = await addBeneficioFinalidadAssociation(
          updatedBeneficio.id,
          finalidadAssociationsToAdd
        );
        if (typeof addResponses === "object" && "error" in addResponses) {
          toast.error("Error al agregar la finalidad: " + addResponses.error);
          return;
        }
      }

      // --- Clasificador Tematico --- (Apply similar logic)
      const currentClasificadorIds = getElementIds(
        currentBeneficio.clasificadorTematico
      );
      const updatedClasificadorIds = getElementIds(
        updatedBeneficio.clasificadorTematico
      );

      const clasificadorAssociationsToDelete = (
        currentBeneficio.clasificadorTematico || []
      ).filter((clas) => !updatedClasificadorIds.includes(clas.elementoId));
      const clasificadorAssociationsToAdd = (
        updatedBeneficio.clasificadorTematico || []
      ).filter((clas) => !currentClasificadorIds.includes(clas.elementoId));
      if (clasificadorAssociationsToDelete.length > 0) {
        const deleteResponses = await Promise.all(
          clasificadorAssociationsToDelete.map((clas) =>
            deleteBeneficioClasificadorTematicoAssociation(
              updatedBeneficio.id,
              clas.elementoId
            )
          )
        );
        deleteResponses.forEach((response) => {
          if (typeof response === "object" && "error" in response) {
            toast.error(
              "Error al eliminar el clasificador temático: " + response.error
            );
            return;
          }
        });
      }
      if (clasificadorAssociationsToAdd.length > 0) {
        const addResponses = await addBeneficioClasificadorTematicoAssociation(
          updatedBeneficio.id,
          clasificadorAssociationsToAdd
        );
        if (typeof addResponses === "object" && "error" in addResponses) {
          toast.error(
            "Error al agregar el clasificador temático: " + addResponses.error
          );
          return;
        }
      }
      // --- Objeto --- (Apply similar logic)
      const currentObjetoIds = getElementIds(currentBeneficio.objeto);
      const updatedObjetoIds = getElementIds(updatedBeneficio.objeto);

      const objetoAssociationsToDelete = (currentBeneficio.objeto || []).filter(
        (obj) => !updatedObjetoIds.includes(obj.elementoId)
      );
      const objetoAssociationsToAdd = (updatedBeneficio.objeto || []).filter(
        (obj) => !currentObjetoIds.includes(obj.elementoId)
      );
      if (objetoAssociationsToDelete.length > 0) {
        const deleteResponses = await Promise.all(
          objetoAssociationsToDelete.map((obj) =>
            deleteBeneficioObjetoAssociation(
              updatedBeneficio.id,
              obj.elementoId
            )
          )
        );
        deleteResponses.forEach((response) => {
          if (typeof response === "object" && "error" in response) {
            toast.error("Error al eliminar el objeto: " + response.error);
            return;
          }
        });
      }
      if (objetoAssociationsToAdd.length > 0) {
        const addResponses = await addBeneficioObjetoAssociation(
          updatedBeneficio.id,
          objetoAssociationsToAdd
        );
        if (typeof addResponses === "object" && "error" in addResponses) {
          toast.error("Error al agregar el objeto: " + addResponses.error);
          return;
        }
      }
      // --- Forma --- (Apply similar logic)
      const currentFormaIds = getElementIds(currentBeneficio.forma);
      const updatedFormaIds = getElementIds(updatedBeneficio.forma);

      const formaAssociationsToDelete = (currentBeneficio.forma || []).filter(
        (forma) => !updatedFormaIds.includes(forma.elementoId)
      );
      const formaAssociationsToAdd = (updatedBeneficio.forma || []).filter(
        (forma) => !currentFormaIds.includes(forma.elementoId)
      );
      if (formaAssociationsToDelete.length > 0) {
        const deleteResponses = await Promise.all(
          formaAssociationsToDelete.map((forma) =>
            deleteBeneficioFormaAssociation(
              updatedBeneficio.id,
              forma.elementoId
            )
          )
        );
        deleteResponses.forEach((response) => {
          if (typeof response === "object" && "error" in response) {
            toast.error("Error al eliminar la forma: " + response.error);
            return;
          }
        });
      }
      if (formaAssociationsToAdd.length > 0) {
        const addResponses = await addBeneficioFormaAssociation(
          updatedBeneficio.id,
          formaAssociationsToAdd
        );
        if (typeof addResponses === "object" && "error" in addResponses) {
          toast.error("Error al agregar la forma: " + addResponses.error);
          return;
        }
      }

      // --- Focalizacion --- (Apply similar logic)
      const currentFocalizacionIds = getElementIds(
        currentBeneficio.focalizacion
      );
      const updatedFocalizacionIds = getElementIds(
        updatedBeneficio.focalizacion
      );

      const focalizacionAssociationsToDelete = (
        currentBeneficio.focalizacion || []
      ).filter((foc) => !updatedFocalizacionIds.includes(foc.elementoId));
      const focalizacionAssociationsToAdd = (
        updatedBeneficio.focalizacion || []
      ).filter((foc) => !currentFocalizacionIds.includes(foc.elementoId));
      if (focalizacionAssociationsToDelete.length > 0) {
        const deleteResponses = await Promise.all(
          focalizacionAssociationsToDelete.map((foc) =>
            deleteBeneficioFocalizacionAssociation(
              updatedBeneficio.id,
              foc.elementoId
            )
          )
        );
        deleteResponses.forEach((response) => {
          if (typeof response === "object" && "error" in response) {
            toast.error("Error al eliminar la focalización: " + response.error);
            return;
          }
        });
      }
      if (focalizacionAssociationsToAdd.length > 0) {
        const addResponses = await addBeneficioFocalizacionAssociation(
          updatedBeneficio.id,
          focalizacionAssociationsToAdd
        );
        if (typeof addResponses === "object" && "error" in addResponses) {
          toast.error(
            "Error al agregar la focalización: " + addResponses.error
          );
          return;
        }
      }
      const newlyAddedBeneficio: Beneficio = {
        ...newBeneficioData, // Spread the data from the form state
        id: updatedBeneficio.id, // Add the ID returned from the backend
        programaId: viewingPrograma.id,
        codigoPrograma: viewingPrograma.codigo,
        nombrePrograma: viewingPrograma.nombreComun,
      };

      // --- Invalidate Queries for Background Sync & Consistency ---
      queryClient.invalidateQueries({ queryKey: ["fichas"] });

      // Close modal and reset form
      setIsEditingBeneficio(false);
      setNewBeneficioData(initialNewBeneficioData); // Reset to the fully defined initial state

      // --- Remove explicit refetch call ---
      toast.success("Beneficio actualizado exitosamente");
    } catch (error) {
      toast.error("Error al actualizar el beneficio: " + error);
    }
  };

  // --- New Handler: Confirm and Delete Programa ---
  const handleConfirmDeletePrograma = async () => {
    if (!programaToDelete) return;

    // Update the main fichas state
    const deletedPrograma = await deletePrograma(programaToDelete.id);
    if (deletedPrograma === true) {
      setProgramaToDelete(null); // Close the dialog
      toast.success("Programa eliminado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["fichas"] });
    } else if (
      typeof deletedPrograma === "object" &&
      "error" in deletedPrograma
    ) {
      toast.error("Error al eliminar el programa: " + deletedPrograma.error);
    } else {
      toast.error("Error desconocido al eliminar el programa");
    }
    // Invalidate and refetch the fichas query to get updated data
    queryClient.invalidateQueries({ queryKey: ["fichas"] });

    // Update the viewingFicha state if it's the one being modified
    setViewingFicha((prev) => {
      if (prev && prev.id === programaToDelete.fichaId) {
        return {
          ...prev,
          programas: prev.programas?.filter(
            (prog) => prog.codigo !== programaToDelete.programaCodigo
          ),
        };
      }
      return prev;
    });

    setProgramaToDelete(null); // Close the dialog
  };
  // --- End New Handler ---

  // --- End Beneficio Handlers ---

  // Handler to confirm and execute ficha deletion
  const handleConfirmDeleteFicha = async () => {
    if (!fichaToDelete) return;
    // Update the fichas data in the query cache
    const deletedFicha = await deleteFicha(fichaToDelete.id);
    if (deletedFicha === true) {
      setFichaToDelete(null); // Close the dialog
      toast.success("Ficha eliminada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["fichas"] });
    } else if (typeof deletedFicha === "object" && "error" in deletedFicha) {
      toast.error("Error al eliminar la ficha: " + deletedFicha.error);
    } else {
      toast.error("Error desconocido al eliminar la ficha");
    }
  };

  // --- Determine Current View ---
  let currentView;
  if (viewingFicha) {
    if (viewingPrograma) {
      currentView = (
        <div className="w-full space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-[#505050]">
              Beneficios del Programa: {viewingPrograma.nombreComun} (
              {viewingPrograma.codigo})
              <br />
              <span className="text-lg">
                {" "}
                Ficha: {viewingFicha.nombre} ({viewingFicha.ano}){" "}
              </span>
            </h3>
            <button
              onClick={handleBackToProgramas}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Volver a Programas
            </button>
          </div>
          <button
            onClick={() => {
              // Reset the form data state *before* opening the modal
              setNewBeneficioData(initialNewBeneficioData);
              // Ensure edit mode is off
              setIsEditingBeneficio(false);
              setEditingBeneficio(null);
              // Now open the create modal
              setIsCreatingBeneficio(true);
            }}
            className="bg-[#1c2851] hover:bg-[#1c2851]/80 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <span>Crear Beneficio</span>
          </button>
          <div className="overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg">
              <thead className="bg-gray-300">
                <tr>
                  {/* Simplified Columns - Add more as needed */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre Corto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cod. Sicoin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {viewingPrograma.beneficios.length > 0 ? (
                  viewingPrograma.beneficios.map((beneficio) => (
                    <tr key={beneficio.id}>
                      {" "}
                      {/* Use the new unique id */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {beneficio.codigo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {beneficio.nombreCorto}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {beneficio.tipo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {beneficio.codigoSicoin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() =>
                            handleOpenEditBeneficioModal(beneficio)
                          }
                          className="text-[#1c2851] hover:text-[#1c2851]/80 mr-4"
                        >
                          Ver/Editar
                        </button>
                        <button
                          onClick={() =>
                            handleOpenDeleteBeneficioModal(beneficio)
                          }
                          className="text-red-600 hover:text-red-800 mr-4"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No hay beneficios registrados para este programa.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else if (isCreatingPrograma) {
      // Changed condition: Show form if creating OR editing
      // --- View: Create/Edit Programa Form ---
      currentView = (
        <form
          onSubmit={handleSubmitPrograma} // Use the combined handler
          className="w-full space-y-6 p-4 border rounded-lg bg-white shadow"
        >
          <h3 className="text-xl font-semibold text-[#505050]">
            {/* Conditional Title checks editingPrograma state */}
            {editingPrograma
              ? `Editando Programa: ${editingPrograma.programaCodigo}` // Use code from editing state
              : `Agregar Programa/Intervención a Ficha: ${viewingFicha.nombre} (${viewingFicha.ano})`}
          </h3>

          {/* Programa Fields (bound to newProgramaData) */}
          {/* ... existing program form fields ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded">
            {/* ... Codigo, CodigoSicoin, Tipo, etc. ... */}
            <div className="flex flex-col gap-1">
              <label htmlFor="codigo" className="text-sm font-medium">
                Código Programa/Intervención
              </label>
              <input
                type="text"
                id="codigo"
                name="codigo"
                value={newProgramaData.codigo}
                onChange={handleProgramaInputChange}
                className="rounded-md border p-2"
                // Make codigo read-only when editing if it shouldn't change
                readOnly={!!editingPrograma}
                disabled={!!editingPrograma}
              />
            </div>
            {/* ... rest of the fields ... */}
            <div className="flex flex-col gap-1">
              <label htmlFor="codigoSicoin" className="text-sm font-medium">
                Código Sicoin
              </label>
              <input
                type="text"
                id="codigoSicoin"
                name="codigoSicoin"
                value={newProgramaData.codigoSicoin}
                onChange={handleProgramaInputChange}
                className="rounded-md border p-2"
                required
              />
            </div>
            {/* ... Tipo ... */}
            <div className="flex flex-col gap-1">
              <label htmlFor="tipo" className="text-sm font-medium">
                Tipo
              </label>
              <select
                id="tipo"
                name="tipo"
                value={newProgramaData.tipo}
                onChange={handleProgramaInputChange}
                className="rounded-md border p-2"
                required
              >
                <option value="programa">Programa</option>
                <option value="intervencion">Intervención</option>
              </select>
            </div>
            {/* ... Nombre Sicoin ... */}
            <div className="flex flex-col gap-1">
              <label htmlFor="nombreSicoin" className="text-sm font-medium">
                Nombre Sicoin
              </label>
              <input
                type="text"
                id="nombreSicoin"
                name="nombreSicoin"
                value={newProgramaData.nombreSicoin}
                onChange={handleProgramaInputChange}
                className="rounded-md border p-2"
                required
              />
            </div>
            {/* ... Nombre Comun ... */}
            <div className="flex flex-col gap-1 col-span-2">
              <label htmlFor="nombreComun" className="text-sm font-medium">
                Nombre Común
              </label>
              <input
                type="text"
                id="nombreComun"
                name="nombreComun"
                value={newProgramaData.nombreComun}
                onChange={handleProgramaInputChange}
                className="rounded-md border p-2"
                required
              />
            </div>
            {/* ... Descripcion ... */}
            <div className="flex flex-col gap-1 col-span-2">
              <label htmlFor="descripcion" className="text-sm font-medium">
                Descripción
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={newProgramaData.descripcion}
                onChange={handleProgramaInputChange}
                className="rounded-md border p-2"
                required
              />
            </div>
            {/* ... Objetivo ... */}
            <div className="flex flex-col gap-1 col-span-2">
              <label htmlFor="objetivo" className="text-sm font-medium">
                Objetivo
              </label>
              <textarea
                id="objetivo"
                name="objetivo"
                value={newProgramaData.objetivo}
                onChange={handleProgramaInputChange}
                className="rounded-md border p-2"
                required
              />
            </div>
            {/* ... Marco Legal ... */}
            <div className="flex flex-col col-span-2 gap-2">
              <label htmlFor="marcoLegal" className="text-sm font-medium">
                Marco Legal
              </label>
              <textarea
                id="marcoLegal"
                name="marcoLegal"
                value={newProgramaData.marcoLegal}
                onChange={handleProgramaInputChange}
                className="rounded-md border p-2"
              />
            </div>
          </div>

          {/* Autoridad Programa Fields */}
          {/* ... existing autoridad fields ... */}
          <div className="space-y-3 border p-4 rounded">
            <h4 className="text-lg font-medium text-gray-700">
              Autoridad del Programa
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="prog-autoridad-nombre"
                  className="text-sm font-medium"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  id="prog-autoridad-nombre"
                  value={newProgramaData.autoridad.nombre}
                  onChange={(e) =>
                    handleProgramaInputChange(e, "autoridad", "nombre")
                  }
                  className="rounded-md border p-2"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="prog-autoridad-cargo"
                  className="text-sm font-medium"
                >
                  Cargo
                </label>
                <input
                  type="text"
                  id="prog-autoridad-cargo"
                  value={newProgramaData.autoridad.cargo}
                  onChange={(e) =>
                    handleProgramaInputChange(e, "autoridad", "cargo")
                  }
                  className="rounded-md border p-2"
                  required
                />
              </div>
            </div>
          </div>

          {/* Funcionario Programa Fields */}
          {/* ... existing funcionario fields ... */}
          <div className="space-y-3 border p-4 rounded">
            <h4 className="text-lg font-medium text-gray-700">
              Funcionario Responsable
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="prog-funcionario-nombre"
                  className="text-sm font-medium"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  id="prog-funcionario-nombre"
                  value={newProgramaData.funcionario.nombre}
                  onChange={(e) =>
                    handleProgramaInputChange(e, "funcionario", "nombre")
                  }
                  className="rounded-md border p-2"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="prog-funcionario-cargo"
                  className="text-sm font-medium"
                >
                  Cargo
                </label>
                <input
                  type="text"
                  id="prog-funcionario-cargo"
                  value={newProgramaData.funcionario.cargo}
                  onChange={(e) =>
                    handleProgramaInputChange(e, "funcionario", "cargo")
                  }
                  className="rounded-md border p-2"
                  required
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsCreatingPrograma(false); // Hide form
                setEditingPrograma(null); // Clear editing state
                // Reset form data
                setNewProgramaData({
                  id: 0,
                  codigo: "",
                  codigoSicoin: "",
                  tipo: "programa",
                  nombreSicoin: "",
                  nombreComun: "",
                  descripcion: "",
                  objetivo: "",
                  marcoLegal: "",
                  autoridad: { nombre: "", cargo: "" },
                  funcionario: { nombre: "", cargo: "" },
                });
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#1c2851] hover:bg-[#1c2851]/80 text-white px-4 py-2 rounded-md"
            >
              {/* Conditional Button Text */}
              {editingPrograma ? "Guardar Cambios" : "Guardar Programa"}
            </button>
          </div>
        </form>
      );
    } else {
      // --- View: Programs Table for selected Ficha ---
      currentView = (
        <div className="w-full space-y-4">
          {/* ... existing code: title, back button, create button ... */}
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-[#505050]">
              Programas/Intervenciones de Ficha: {viewingFicha.nombre} (
              {viewingFicha.ano})
            </h3>
            <button
              onClick={handleBackToFichas} // Go back to Fichas list
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Volver a Fichas
            </button>
          </div>
          <button
            onClick={() => {
              setIsCreatingPrograma(true);
              setEditingPrograma(null); // Ensure not in edit mode when creating new
            }}
            className="bg-[#1c2851] hover:bg-[#1c2851]/80 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <span>Crear Programa/Intervención</span>
          </button>
          <div className="overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg">
              {/* ... table head ... */}
              <thead className="bg-gray-300">
                {/* ... existing th ... */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre Común
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cod. Sicoin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {viewingFicha.programas && viewingFicha.programas.length > 0 ? (
                  viewingFicha.programas.map((programa) => (
                    <tr key={programa.codigo}>
                      {/* ... table cells ... */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {programa.codigo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {programa.nombreComun}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {programa.tipo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {programa.codigoSicoin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {/* Edit Programa button - Updated */}
                        <button
                          onClick={() => handleEditPrograma(programa.codigo)}
                          className="text-blue-600 hover:text-blue-800 mr-4"
                        >
                          Editar Programa
                        </button>
                        {/* View Benefits Button */}
                        <button
                          onClick={() => handleViewBeneficios(programa.codigo)}
                          className="text-[#1c2851] hover:text-[#1c2851]/80 mr-4"
                        >
                          Ver Beneficios ({programa.beneficios.length})
                        </button>
                        {/* Delete Programa button - Opens confirmation */}
                        <button
                          onClick={() =>
                            setProgramaToDelete({
                              id: programa.id,
                              fichaId: viewingFicha.id,
                              programaCodigo: programa.codigo,
                              programaNombre: programa.nombreComun,
                            })
                          }
                          className="text-red-600 hover:text-red-800 mr-4"
                        >
                          Eliminar Programa
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  // ... existing "no programs" row ...
                  <tr>
                    <td
                      colSpan={5} // Adjusted colspan
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No hay programas registrados para esta ficha.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  } else if (isCreatingFicha) {
    // --- View: Create/Edit Ficha Form ---
    currentView = (
      <form
        onSubmit={handleSubmitFicha} // Use the combined handler
        className="w-full space-y-6 p-4 border rounded-lg bg-white shadow"
      >
        {/* Section 1: Datos de la Institución */}
        <div className="space-y-4 p-4 rounded">
          <h3 className="text-lg font-semibold text-[#505050]">
            {/* Change title based on mode */}
            {editingFicha
              ? `Editando Ficha: ${editingFicha.nombre}`
              : "1. Datos de la Institución"}
          </h3>
          {/* ... rest of the institucion fields bound to newFichaCabecera ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 col-span-2">
              <label htmlFor="institucion" className="text-sm font-medium">
                Institución
              </label>
              <input
                type="text"
                id="institucion"
                name="institucion"
                value={newFichaCabecera.institucion}
                onChange={(e) => handleInputChange(e, "institucion")}
                className="rounded-md border p-2"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="siglas" className="text-sm font-medium">
                Siglas
              </label>
              <input
                type="text"
                id="siglas"
                name="siglas"
                value={newFichaCabecera.siglas}
                onChange={(e) => handleInputChange(e, "siglas")}
                className="rounded-md border p-2"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="nombreCorto" className="text-sm font-medium">
                Nombre Corto
              </label>
              <input
                type="text"
                id="nombreCorto"
                name="nombreCorto"
                value={newFichaCabecera.nombreCorto}
                onChange={(e) => handleInputChange(e, "nombreCorto")}
                className="rounded-md border p-2"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Delegados */}
        <div className="space-y-4 p-4 rounded">
          <h3 className="text-lg font-semibold text-[#505050]">
            2. Delegados Institucionales
          </h3>
          {newFichaCabecera.delegados.map((delegado, index) => (
            <div key={index} className="space-y-3 p-3 border rounded mt-2">
              <h4 className="text-md font-medium text-gray-700">
                Delegado {index + 1}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ... Name ... */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={`delegado-nombre-${index}`}
                    className="text-sm font-medium"
                  >
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    id={`delegado-nombre-${index}`}
                    value={delegado.nombre}
                    onChange={(e) =>
                      handleInputChange(e, "delegado", index, "nombre")
                    }
                    className="rounded-md border p-2"
                    required
                  />
                </div>
                {/* ... Telefono ... */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={`delegado-telefono-${index}`}
                    className="text-sm font-medium"
                  >
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id={`delegado-telefono-${index}`}
                    value={delegado.telefono}
                    onChange={(e) =>
                      handleInputChange(e, "delegado", index, "telefono")
                    }
                    className="rounded-md border p-2"
                    required
                  />
                </div>
                {/* ... Rol ... */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={`delegado-rol-${index}`}
                    className="text-sm font-medium"
                  >
                    Rol
                  </label>
                  <input
                    type="text"
                    id={`delegado-rol-${index}`}
                    value={delegado.rol}
                    onChange={(e) =>
                      handleInputChange(e, "delegado", index, "rol")
                    }
                    className="rounded-md border p-2"
                    required
                  />
                </div>
                {/* ... Correo ... */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={`delegado-correo-${index}`}
                    className="text-sm font-medium"
                  >
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id={`delegado-correo-${index}`}
                    value={delegado.correo}
                    onChange={(e) =>
                      handleInputChange(e, "delegado", index, "correo")
                    }
                    className="rounded-md border p-2"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
          {/* Add Delegado Button */}
          {newFichaCabecera.delegados.length < 3 && (
            <button
              type="button"
              onClick={handleAddDelegado}
              className="mt-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
            >
              Agregar Delegado ({newFichaCabecera.delegados.length}/3)
            </button>
          )}
        </div>

        {/* Section 3: Autoridad Responsable */}
        <div className="space-y-4 p-4 rounded">
          <h3 className="text-lg font-semibold text-[#505050]">
            3. Autoridad Responsable
          </h3>
          {/* ... rest of the autoridad fields bound to newFichaCabecera ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="autoridad-nombre" className="text-sm font-medium">
                Nombre Completo
              </label>
              <input
                type="text"
                id="autoridad-nombre"
                value={newFichaCabecera.autoridad.nombre}
                onChange={(e) =>
                  handleInputChange(e, "autoridad", undefined, "nombre")
                }
                className="rounded-md border p-2"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="autoridad-cargo" className="text-sm font-medium">
                Cargo
              </label>
              <input
                type="text"
                id="autoridad-cargo"
                value={newFichaCabecera.autoridad.cargo}
                onChange={(e) =>
                  handleInputChange(e, "autoridad", undefined, "cargo")
                }
                className="rounded-md border p-2"
                required
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => {
              setIsCreatingFicha(false); // Go back to Fichas list
              setEditingFicha(null); // Clear editing state
              setNewFichaCabecera(initialFichaCabecera); // Reset form fields
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-[#1c2851] hover:bg-[#1c2851]/80 text-white px-4 py-2 rounded-md"
          >
            {/* Change button text based on mode */}
            {editingFicha ? "Guardar Cambios" : "Confirmar y Guardar Ficha"}
          </button>
        </div>
      </form>
    );
  } else {
    // --- View: Main Fichas Table ---
    currentView = (
      <>
        <div className="flex justify-between items-center w-full">
          <h2 className="text-2xl font-bold text-[#505050]">
            Registro de Fichas de Intervención
          </h2>
          <button
            className="bg-[#1c2851] hover:bg-[#1c2851]/80 text-white px-4 py-2 rounded-md flex items-center gap-2"
            onClick={() => setIsCreatingFicha(true)} // Set state to true to show ficha form
          >
            <span>Generar nueva ficha</span>
          </button>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-gray-200">
            {/* ... table head ... */}
            <thead className="bg-gray-300">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ficha (Nombre/Siglas)
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Año
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Estado
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fichas &&
                !("error" in fichas) &&
                fichas.map((ficha) => (
                  <tr key={ficha.id}>
                    {/* ... table cells ... */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ficha.nombre}{" "}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ficha.ano}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ficha.estado}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {/* Edit Ficha Button */}
                      <button
                        onClick={() => handleEditFicha(ficha.id)} // Call edit handler
                        className="text-blue-600 hover:text-blue-800 mr-4"
                      >
                        Editar Ficha
                      </button>
                      {/* View Programs Button */}
                      <button
                        onClick={() => handleViewPrograms(ficha.id)} // Call new handler
                        className="text-[#1c2851] hover:text-[#1c2851]/80 mr-4"
                      >
                        Ver Programas ({ficha.programas?.length || 0})
                      </button>
                      {/* Delete Ficha Button */}
                      <button
                        onClick={() => {
                          // Cast to component Ficha type with guaranteed non-undefined properties
                          const normalizedFicha = {
                            ...ficha,
                            cabecera: ficha.cabecera || initialFichaCabecera,
                            programas: (ficha.programas || []).map((prog) => ({
                              ...prog,
                              beneficios: prog.beneficios || [],
                            })),
                          } as Ficha;

                          setFichaToDelete(normalizedFicha);
                        }}
                        className="text-red-600 hover:text-red-800 mr-4"
                      >
                        Eliminar Ficha
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }
  // --- End Determine Current View ---

  return (
    <div className="w-full h-full flex flex-col justify-start items-center gap-4">
      {/* Render the determined view */}
      {currentView}

      {/* --- Modals/Dialogs --- */}

      {/* Create Beneficio Modal */}
      <Dialog
        open={isCreatingBeneficio || isEditingBeneficio}
        onOpenChange={setIsCreatingBeneficio}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Crear Nuevo Beneficio para {viewingPrograma?.nombreComun}
            </DialogTitle>
            <DialogDescription>
              Complete los campos para registrar un nuevo beneficio o
              subproducto.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isCreatingBeneficio) {
                handleAddBeneficio(e);
              } else if (isEditingBeneficio) {
                const updatedBeneficio = {
                  ...newBeneficioData,
                  id: editingBeneficio?.id || 0,
                  codigoPrograma: editingBeneficio?.codigoPrograma || "",
                  nombrePrograma: editingBeneficio?.nombrePrograma || "",
                  programaId: editingBeneficio?.programaId || 0,
                };
                handleEditBeneficio(updatedBeneficio);
              }
            }}
            className="space-y-4"
          >
            {/* Simplified Form Fields - Add more based on Beneficio interface */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Codigo */}
              <div className="flex flex-col gap-1">
                <label htmlFor="benef-codigo" className="text-sm font-medium">
                  Código Beneficio
                </label>
                <input
                  type="text"
                  id="benef-codigo"
                  name="codigo"
                  value={newBeneficioData.codigo}
                  onChange={handleBeneficioInputChange}
                  className="rounded-md border p-2"
                  required
                />
              </div>
              {/* Codigo Sicoin */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="benef-codigoSicoin"
                  className="text-sm font-medium"
                >
                  Código Sicoin
                </label>
                <input
                  type="text"
                  id="benef-codigoSicoin"
                  name="codigoSicoin"
                  value={newBeneficioData.codigoSicoin}
                  onChange={handleBeneficioInputChange}
                  className="rounded-md border p-2"
                />
              </div>
              {/* Nombre Subproducto */}
              <div className="flex flex-col gap-1 col-span-2">
                <label
                  htmlFor="benef-nombreSubproducto"
                  className="text-sm font-medium"
                >
                  Nombre Subproducto
                </label>
                <input
                  type="text"
                  id="benef-nombreSubproducto"
                  name="nombreSubproducto"
                  value={newBeneficioData.nombreSubproducto}
                  onChange={handleBeneficioInputChange}
                  className="rounded-md border p-2"
                  required
                />
              </div>
              {/* Nombre Corto */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="benef-nombreCorto"
                  className="text-sm font-medium"
                >
                  Nombre Corto
                </label>
                <input
                  type="text"
                  id="benef-nombreCorto"
                  name="nombreCorto"
                  value={newBeneficioData.nombreCorto}
                  onChange={handleBeneficioInputChange}
                  className="rounded-md border p-2"
                  required
                />
              </div>
              {/* Nombre (Beneficio) */}
              <div className="flex flex-col gap-1">
                <label htmlFor="benef-nombre" className="text-sm font-medium">
                  Nombre Beneficio
                </label>
                <input
                  type="text"
                  id="benef-nombre"
                  name="nombre"
                  value={newBeneficioData.nombre}
                  onChange={handleBeneficioInputChange}
                  className="rounded-md border p-2"
                  required
                />
              </div>
              {/* Descripcion */}
              <div className="flex flex-col gap-1 col-span-2">
                <label
                  htmlFor="benef-descripcion"
                  className="text-sm font-medium"
                >
                  Descripción
                </label>
                <textarea
                  id="benef-descripcion"
                  name="descripcion"
                  value={newBeneficioData.descripcion}
                  onChange={handleBeneficioInputChange}
                  className="rounded-md border p-2"
                  required
                />
              </div>
              {/* Objetivo */}
              <div className="flex flex-col gap-1 col-span-2">
                <label htmlFor="benef-objetivo" className="text-sm font-medium">
                  Objetivo
                </label>
                <textarea
                  id="benef-objetivo"
                  name="objetivo"
                  value={newBeneficioData.objetivo}
                  onChange={handleBeneficioInputChange}
                  className="rounded-md border p-2"
                  required
                />
              </div>
              {/* Tipo */}
              <div className="flex flex-col gap-1">
                <label htmlFor="benef-tipo" className="text-sm font-medium">
                  Tipo
                </label>
                <select
                  id="benef-tipo"
                  name="tipo"
                  value={newBeneficioData.tipo}
                  onChange={handleBeneficioInputChange}
                  className="rounded-md border p-2"
                  required
                >
                  <option value="individual">Individual</option>
                  <option value="familiar">Familiar</option>
                  <option value="comunitario">Comunitario</option>
                  <option value="actores sociales">Actores Sociales</option>
                </select>
              </div>
              {/* Criterios Inclusion */}
              <div className="flex flex-col gap-1 col-span-2">
                <label
                  htmlFor="benef-criteriosInclusion"
                  className="text-sm font-medium"
                >
                  Criterios de Inclusión
                </label>
                <textarea
                  id="benef-criteriosInclusion"
                  name="criteriosInclusion"
                  value={newBeneficioData.criteriosInclusion}
                  onChange={handleBeneficioInputChange}
                  className="rounded-md border p-2"
                />
              </div>
              {/* Atencion Social */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="benef-atencionSocial"
                  className="text-sm font-medium"
                >
                  Atención Social
                </label>
                <select
                  id="benef-atencionSocial"
                  name="atencionSocial"
                  value={newBeneficioData.atencionSocial}
                  onChange={handleBeneficioInputChange}
                  className="rounded-md border p-2"
                >
                  <option value="protección">Protección</option>
                  <option value="asistencia">Asistencia</option>
                  <option value="promoción">Promoción</option>
                </select>
              </div>
              {/* Rango Edad */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="benef-rangoEdad"
                  className="text-sm font-medium"
                >
                  Rango Edad
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="benef-rangoEdad-primeraInfancia"
                      name="rangoEdad"
                      value="Primera infancia"
                      checked={
                        newBeneficioData.rangoEdad === "Primera infancia"
                      }
                      onChange={handleBeneficioInputChange}
                      className="rounded border"
                    />
                    <label
                      htmlFor="benef-rangoEdad-primeraInfancia"
                      className="text-sm"
                    >
                      Primera infancia
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="benef-rangoEdad-infancia"
                      name="rangoEdad"
                      value="Infancia"
                      checked={newBeneficioData.rangoEdad === "Infancia"}
                      onChange={handleBeneficioInputChange}
                      className="rounded border"
                    />
                    <label
                      htmlFor="benef-rangoEdad-infancia"
                      className="text-sm"
                    >
                      Infancia
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="benef-rangoEdad-adolescencia"
                      name="rangoEdad"
                      value="Adolescencia"
                      checked={newBeneficioData.rangoEdad === "Adolescencia"}
                      onChange={handleBeneficioInputChange}
                      className="rounded border"
                    />
                    <label
                      htmlFor="benef-rangoEdad-adolescencia"
                      className="text-sm"
                    >
                      Adolescencia
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="benef-rangoEdad-juventud"
                      name="rangoEdad"
                      value="Juventud"
                      checked={newBeneficioData.rangoEdad === "Juventud"}
                      onChange={handleBeneficioInputChange}
                      className="rounded border"
                    />
                    <label
                      htmlFor="benef-rangoEdad-juventud"
                      className="text-sm"
                    >
                      Juventud
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="benef-rangoEdad-adultos"
                      name="rangoEdad"
                      value="Adultos"
                      checked={newBeneficioData.rangoEdad === "Adultos"}
                      onChange={handleBeneficioInputChange}
                      className="rounded border"
                    />
                    <label
                      htmlFor="benef-rangoEdad-adultos"
                      className="text-sm"
                    >
                      Adultos
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="benef-rangoEdad-adultosMayores"
                      name="rangoEdad"
                      value="Adultos mayores"
                      checked={newBeneficioData.rangoEdad === "Adultos mayores"}
                      onChange={handleBeneficioInputChange}
                      className="rounded border"
                    />
                    <label
                      htmlFor="benef-rangoEdad-adultosMayores"
                      className="text-sm"
                    >
                      Adultos mayores
                    </label>
                  </div>
                </div>
              </div>
              {/* Poblacion Objetivo */}
              <div className="flex flex-col gap-1 col-span-2">
                <label
                  htmlFor="benef-poblacionObjetivo"
                  className="text-sm font-medium"
                >
                  Población Objetivo
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-md">
                  {isLoadingPoblacionObjetivoElementos ? (
                    <div className="col-span-2 p-3 text-center">
                      Cargando opciones...
                    </div>
                  ) : typeof poblacionObjetivoElementos === "object" &&
                    "error" in poblacionObjetivoElementos ? (
                    <div className="col-span-2 p-3 text-center text-red-500">
                      Error al cargar opciones
                    </div>
                  ) : (
                    // Group elements by category and render them
                    (() => {
                      // Group elements by category
                      const groupedElements = (
                        poblacionObjetivoElementos || []
                      ).reduce((acc, elem) => {
                        if (!acc[elem.categoria]) {
                          acc[elem.categoria] = [];
                        }
                        acc[elem.categoria]!.push(elem); // Add non-null assertion operator
                        return acc;
                      }, {} as Record<string, typeof poblacionObjetivoElementos>);

                      // Convert object keys to array for mapping
                      return Object.entries(groupedElements).map(
                        ([categoria, elementos]) => (
                          <div key={categoria} className="p-3">
                            <h5 className="font-medium text-sm mb-2">
                              {categoria}
                            </h5>
                            <div className="space-y-2">
                              {elementos &&
                                elementos.map((elemento) => {
                                  return (
                                    <div
                                      key={elemento.id}
                                      className="flex items-center gap-2"
                                    >
                                      <input
                                        type="checkbox"
                                        id={`benef-pobObj-${elemento.id}`}
                                        value={elemento.id} // Store elemento.id in value
                                        data-field-type="poblacionObjetivo" // Identify the field
                                        data-elemento={JSON.stringify(elemento)} // Pass the whole element data
                                        // Check if an element with this id exists in the state array
                                        checked={newBeneficioData.poblacionObjetivo.some(
                                          (rel) =>
                                            rel.elementoId === elemento.id
                                        )}
                                        onChange={handleBeneficioInputChange}
                                        className="rounded border"
                                      />
                                      <label
                                        htmlFor={`benef-pobObj-${elemento.id}`}
                                        className="text-sm"
                                      >
                                        {elemento.criterio}
                                      </label>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        )
                      );
                    })()
                  )}
                </div>
              </div>

              {/* Finalidad */}
              <div className="flex flex-col gap-1 col-span-2">
                <label
                  htmlFor="benef-finalidad"
                  className="text-sm font-medium"
                >
                  Finalidad
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-md p-3">
                  {isLoadingFinalidadElementos ? (
                    <div className="col-span-2 text-center">
                      Cargando opciones...
                    </div>
                  ) : typeof finalidadElementos === "object" &&
                    "error" in finalidadElementos ? (
                    <div className="col-span-2 text-center text-red-500">
                      Error al cargar opciones
                    </div>
                  ) : (
                    (finalidadElementos || []).map((elemento) => {
                      // const fieldName = `finalidad.${elemento.criterio.replace(/\s+/g,"")}`; // Remove
                      return (
                        <div
                          key={elemento.id}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            id={`benef-finalidad-${elemento.id}`}
                            value={elemento.id} // Add value
                            data-field-type="finalidad" // Add field type
                            data-elemento={JSON.stringify(elemento)} // Pass the whole element data
                            checked={newBeneficioData.finalidad.some(
                              (rel) => rel.elementoId === elemento.id
                            )}
                            onChange={handleBeneficioInputChange}
                            className="rounded border"
                          />
                          <label
                            htmlFor={`benef-finalidad-${elemento.id}`}
                            className="text-sm"
                          >
                            {elemento.criterio}
                          </label>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Clasificador Temático */}
              <div className="flex flex-col gap-1 col-span-2">
                <label
                  htmlFor="benef-clasificadorTematico"
                  className="text-sm font-medium"
                >
                  Clasificador Temático
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-md p-3">
                  {isLoadingClasificadorTematicoElementos ? (
                    <div className="col-span-2 text-center">
                      Cargando opciones...
                    </div>
                  ) : typeof clasificadorTematicoElementos === "object" &&
                    "error" in clasificadorTematicoElementos ? (
                    <div className="col-span-2 text-center text-red-500">
                      Error al cargar opciones
                    </div>
                  ) : (
                    (clasificadorTematicoElementos || []).map((elemento) => {
                      // const fieldName = `clasificadorTematico.${elemento.criterio.replace(/\s+/g,"")}`; // Remove
                      return (
                        <div
                          key={elemento.id}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            id={`benef-clasificadorTematico-${elemento.id}`}
                            value={elemento.id} // Add value
                            data-field-type="clasificadorTematico" // Add field type
                            data-elemento={JSON.stringify(elemento)} // Pass the whole element data
                            checked={newBeneficioData.clasificadorTematico.some(
                              (rel) => rel.elementoId === elemento.id
                            )}
                            onChange={handleBeneficioInputChange}
                            className="rounded border"
                          />
                          <label
                            htmlFor={`benef-clasificadorTematico-${elemento.id}`}
                            className="text-sm"
                          >
                            {elemento.criterio}
                          </label>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Objeto */}
              <div className="flex flex-col gap-1 col-span-2">
                <label htmlFor="benef-objeto" className="text-sm font-medium">
                  Objeto
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-md p-3">
                  {isLoadingObjetoElementos ? (
                    <div className="col-span-2 text-center">
                      Cargando opciones...
                    </div>
                  ) : typeof objetoElementos === "object" &&
                    "error" in objetoElementos ? (
                    <div className="col-span-2 text-center text-red-500">
                      Error al cargar opciones
                    </div>
                  ) : (
                    (objetoElementos || []).map((elemento) => {
                      // const fieldName = `objeto.${elemento.criterio.replace(/\s+/g,"")}`; // Remove
                      return (
                        <div
                          key={elemento.id}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            id={`benef-objeto-${elemento.id}`}
                            value={elemento.id} // Add value
                            data-field-type="objeto" // Add field type
                            data-elemento={JSON.stringify(elemento)} // Pass the whole element data
                            checked={newBeneficioData.objeto.some(
                              (rel) => rel.elementoId === elemento.id
                            )}
                            onChange={handleBeneficioInputChange}
                            className="rounded border"
                          />
                          <label
                            htmlFor={`benef-objeto-${elemento.id}`}
                            className="text-sm"
                          >
                            {elemento.criterio}
                          </label>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Forma */}
              <div className="flex flex-col gap-1 col-span-2">
                <label htmlFor="benef-forma" className="text-sm font-medium">
                  Forma
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-md p-3">
                  {isLoadingFormaElementos ? (
                    <div className="col-span-2 text-center">
                      Cargando opciones...
                    </div>
                  ) : typeof formaElementos === "object" &&
                    "error" in formaElementos ? (
                    <div className="col-span-2 text-center text-red-500">
                      Error al cargar opciones
                    </div>
                  ) : (
                    (formaElementos || []).map((elemento) => {
                      // const fieldName = `forma.${elemento.criterio.replace(/\s+/g,"")}`; // Remove
                      return (
                        <div
                          key={elemento.id}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            id={`benef-forma-${elemento.id}`}
                            value={elemento.id} // Add value
                            data-field-type="forma" // Add field type
                            data-elemento={JSON.stringify(elemento)} // Pass the whole element data
                            checked={newBeneficioData.forma.some(
                              (rel) => rel.elementoId === elemento.id
                            )}
                            onChange={handleBeneficioInputChange}
                            className="rounded border"
                          />
                          <label
                            htmlFor={`benef-forma-${elemento.id}`}
                            className="text-sm"
                          >
                            {elemento.criterio}
                          </label>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Focalización */}
              <div className="flex flex-col gap-1 col-span-2">
                <label
                  htmlFor="benef-focalizacion"
                  className="text-sm font-medium"
                >
                  Focalización
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-md">
                  {isLoadingFocalizacionElementos ? (
                    <div className="col-span-2 p-3 text-center">
                      Cargando opciones...
                    </div>
                  ) : typeof focalizacionElementos === "object" &&
                    "error" in focalizacionElementos ? (
                    <div className="col-span-2 p-3 text-center text-red-500">
                      Error al cargar opciones
                    </div>
                  ) : (
                    (() => {
                      // Group elements by subcategory (like we did for PoblacionObjetivo)
                      const groupedElements = (
                        focalizacionElementos || []
                      ).reduce((acc, elem) => {
                        if (!acc[elem.subcategoria]) {
                          acc[elem.subcategoria] = [];
                        }
                        acc[elem.subcategoria]!.push(elem); // Add non-null assertion operator
                        return acc;
                      }, {} as Record<string, typeof focalizacionElementos>);
                      // Convert object keys to array for mapping
                      return Object.entries(groupedElements).map(
                        ([subcategoria, elementos]) => {
                          if (!elementos) return null; // Satisfy TypeScript
                          return (
                            <div key={subcategoria} className="p-3">
                              <h5 className="font-medium text-sm mb-2">
                                {subcategoria}
                              </h5>
                              <div className="space-y-2">
                                {elementos.map((elemento) => {
                                  // const fieldName = `focalizacion.${subcategoria}.${elemento.criterio.replace(/\s+/g,"")}`; // Remove
                                  return (
                                    <div
                                      key={elemento.id}
                                      className="flex items-center gap-2"
                                    >
                                      <input
                                        type="checkbox"
                                        id={`benef-focalizacion-${elemento.id}`}
                                        value={elemento.id} // Add value
                                        data-field-type="focalizacion" // Add field type
                                        data-elemento={JSON.stringify(elemento)} // Pass the whole element data
                                        // Check if element exists in the array
                                        checked={newBeneficioData.focalizacion.some(
                                          (rel) =>
                                            rel.elementoId === elemento.id
                                        )}
                                        onChange={handleBeneficioInputChange}
                                        className="rounded border"
                                      />
                                      <label
                                        htmlFor={`benef-focalizacion-${elemento.id}`}
                                        className="text-sm"
                                      >
                                        {elemento.criterio}
                                      </label>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        }
                      );
                    })()
                  )}
                </div>
              </div>
              {/* Funcionario Focal */}
              <div className="col-span-2 border-t pt-4 mt-4">
                <h4 className="text-md font-medium text-gray-700 mb-2">
                  Funcionario Focal del Beneficio
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="benef-focal-nombre"
                      className="text-sm font-medium"
                    >
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="benef-focal-nombre"
                      name="funcionarioFocal.nombre"
                      value={newBeneficioData.funcionarioFocal.nombre}
                      onChange={handleBeneficioInputChange}
                      className="rounded-md border p-2"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="benef-focal-cargo"
                      className="text-sm font-medium"
                    >
                      Cargo
                    </label>
                    <input
                      type="text"
                      id="benef-focal-cargo"
                      name="funcionarioFocal.cargo"
                      value={newBeneficioData.funcionarioFocal.cargo}
                      onChange={handleBeneficioInputChange}
                      className="rounded-md border p-2"
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => {
                  setIsCreatingBeneficio(false);
                  setIsEditingBeneficio(false);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-[#1c2851] text-white px-4 py-2 rounded-md"
              >
                {isEditingBeneficio
                  ? "Actualizar Beneficio"
                  : "Guardar Beneficio"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Beneficio Confirmation Dialog */}
      <Dialog
        open={!!beneficioToDelete}
        onOpenChange={() => setBeneficioToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar el beneficio "
              {beneficioToDelete?.nombreCorto}" ({beneficioToDelete?.codigo})?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setBeneficioToDelete(null)}
              className="px-4 py-2 rounded-md mr-2 border"
            >
              Cancelar
            </button>
            <button
              onClick={handleDeleteBeneficio}
              className="bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Eliminar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Programa Confirmation Dialog */}
      <Dialog
        open={!!programaToDelete}
        onOpenChange={() => setProgramaToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación de Programa</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar el programa "
              {programaToDelete?.programaNombre}" (
              {programaToDelete?.programaCodigo}) de la ficha{" "}
              {viewingFicha?.nombre}? <br />
              Esta acción eliminará también todos sus beneficios asociados y no
              se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setProgramaToDelete(null)}
              className="px-4 py-2 rounded-md mr-2 border"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmDeletePrograma} // Call the new delete handler
              className="bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Eliminar Programa
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Ficha Confirmation Dialog */}
      <Dialog
        open={!!fichaToDelete}
        onOpenChange={() => setFichaToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación de Ficha</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar la ficha "{fichaToDelete?.nombre}"
              ? Esta acción eliminará también todos sus programas y beneficios
              asociados. Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setFichaToDelete(null)}
              className="px-4 py-2 rounded-md mr-2 border"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmDeleteFicha}
              className="bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Eliminar Ficha Permanentemente
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FichasSection;
