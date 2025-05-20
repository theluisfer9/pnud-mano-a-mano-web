import { useState, useRef, useEffect, memo } from "react";
import { toast } from "sonner";

import { Combobox } from "@/components/Combobox/combobox";
import { Button } from "@/components/ui/button";
import { guatemalaGeography } from "@/data/geography";
import { getUserFull, getUserBasic, UserBasic } from "@/services/snis";
import { isCuiValid } from "@/utils/functions";
import { useQuery } from "@tanstack/react-query";
import {
  New_Beneficio as Beneficio,
  getAllProgramasWithBeneficios,
  Programa,
} from "@/services/fichas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { addInterventions } from "@/db/queries";
import { EntregaIntervenciones } from "@/data/intervention";
import { DatePicker } from "@/components/ui/date-picker";
import LockButton from "@/components/ui/tooltip-button";

// --- Helper Components (Memoized) ---

// Helper component for masked fields (Memoized)
const MaskedField = memo(({ label }: { label: string }) => (
  <div className="col-span-1 flex flex-col gap-2">
    <label className="text-sm font-medium">{label}</label>
    <div className="rounded-md border p-2 bg-gray-100 text-gray-500">
      Se conoce
    </div>
  </div>
));
MaskedField.displayName = "MaskedField"; // Add display name for better debugging

// Helper component for input fields (Memoized)
const InputField = memo(
  ({
    label,
    value,
    onChange,
    type = "text",
    required = false,
    options = [],
    isCombobox = false,
    className = "",
  }: {
    label: string;
    value: any;
    onChange: (value: any) => void;
    type?: string;
    required?: boolean;
    options?: { label: string; value: string }[];
    isCombobox?: boolean;
    className?: string;
  }) => (
    <div className="col-span-1 flex flex-col gap-2">
      <label className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {isCombobox ? (
        <Combobox
          options={options}
          value={value.toString()} // Ensure value is string for Combobox
          onChange={onChange}
          width="full"
          popOverWidth="full"
        />
      ) : (
        <input
          type={type}
          className={`rounded-md border p-2 ${className}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  )
);
InputField.displayName = "InputField"; // Add display name for better debugging

// --- Main Component ---

const EntregasSection = () => {
  const user = JSON.parse(localStorage.getItem("mano-a-mano-token") || "{}");
  if (!user) {
    return <div>No se encontró el usuario</div>;
  }
  const userInstitutionAcronym = user.institution;
  const foundAcronym = getInstitutionName(userInstitutionAcronym);

  // Form state
  const [institution, setInstitution] = useState(
    foundAcronym || "NO IDENTIFICADO"
  );
  const [acronym, setAcronym] = useState(
    userInstitutionAcronym || "NO IDENTIFICADO"
  );
  const [searchCui, setSearchCui] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchGender, setSearchGender] = useState("");

  // Beneficiary data state
  const [cui, setCui] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [thirdName, setThirdName] = useState("");
  const [firstLastName, setFirstLastName] = useState("");
  const [secondLastName, setSecondLastName] = useState("");
  const [thirdLastName, setThirdLastName] = useState("");
  const [birthDepartment, setBirthDepartment] = useState(0);
  const [birthMunicipality, setBirthMunicipality] = useState(0);
  const [puebloOrigin, setPuebloOrigin] = useState(0);
  const [linguisticCommunity, setLinguisticCommunity] = useState(0);
  const [language, setLanguage] = useState(0);
  const [rshHomeId, setRshHomeId] = useState(0);
  const [residenceDepartment, setResidenceDepartment] = useState(0);
  const [residenceMunicipality, setResidenceMunicipality] = useState(0);
  const [cellphone, setCellphone] = useState("");
  const [residencePopulatedPlace, setResidencePopulatedPlace] = useState(0);
  const [residenceAddress, setResidenceAddress] = useState("");
  const [schoolLevel, setSchoolLevel] = useState(0);
  const [disability, setDisability] = useState("");
  const [works, setWorks] = useState("");
  const [reference, setReference] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // Benefit data state
  const [program, setProgram] = useState("");
  const [beneficiosPrograma, setBeneficiosPrograma] = useState<Beneficio[]>([]);
  const [benefit, setBenefit] = useState("");
  const [deliveryDepartment, setDeliveryDepartment] = useState("");
  const [deliveryMunicipality, setDeliveryMunicipality] = useState("");
  const [deliveryPopulatedPlace, setDeliveryPopulatedPlace] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryQuantity, setDeliveryQuantity] = useState("1");
  const [deliveryValue, setDeliveryValue] = useState("");

  // State to track if we are currently searching for a user by CUI
  const [isSearchingUser, setIsSearchingUser] = useState(false);
  // State to store the user data found by CUI (replace 'any' with your actual User type)
  const [foundUserData, setFoundUserData] = useState<UserBasic | null>(null);

  // --- NEW: State for locking fields ---
  const initialLockState = {
    program: false,
    benefit: false,
    deliveryDepartment: false,
    deliveryMunicipality: false,
    deliveryPopulatedPlace: false,
    deliveryDate: false,
    deliveryQuantity: false,
    deliveryValue: false,
    reference: false,
  };
  const [lockState, setLockState] = useState(initialLockState);
  // --- End NEW State ---

  // Add new state to track known fields
  const [knownFields, setKnownFields] = useState<Record<string, boolean>>({
    cui: false,
    gender: false,
    birthDate: false,
    firstName: false,
    secondName: false,
    thirdName: false,
    firstLastName: false,
    secondLastName: false,
    thirdLastName: false,
    birthDepartment: false,
    birthMunicipality: false,
    puebloOrigin: false,
    linguisticCommunity: false,
    language: false,
    rshHomeId: false,
    residenceDepartment: false,
    residenceMunicipality: false,
    cellphone: false,
    residencePopulatedPlace: false,
    residenceAddress: false,
    schoolLevel: false,
    disability: false,
    works: false,
  });

  // State for field errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

  // Reset all form data
  const resetForm = () => {
    // Reset non-lockable fields (Beneficiary search/display)
    setSearchCui("");
    setSearchName("");
    setSearchGender("");
    setFoundUserData(null); // Clear found user data

    // Reset Beneficiary identification details
    setCui("");
    setGender("");
    setBirthDate("");
    setFirstName("");
    setSecondName("");
    setThirdName("");
    setFirstLastName("");
    setSecondLastName("");
    setThirdLastName("");
    setBirthDepartment(0);
    setBirthMunicipality(0);
    setPuebloOrigin(0);
    setLinguisticCommunity(0);
    setLanguage(0);
    setRshHomeId(0);
    setResidenceDepartment(0);
    setResidenceMunicipality(0);
    setCellphone("");
    setResidencePopulatedPlace(0);
    setResidenceAddress("");
    setSchoolLevel(0);
    setDisability("");
    setWorks("");
    // Reset known fields
    setKnownFields({
      cui: false,
      gender: false,
      birthDate: false,
      firstName: false,
      secondName: false,
      thirdName: false,
      firstLastName: false,
      secondLastName: false,
      thirdLastName: false,
      birthDepartment: false,
      birthMunicipality: false,
      puebloOrigin: false,
      linguisticCommunity: false,
      language: false,
      rshHomeId: false,
      residenceDepartment: false,
      residenceMunicipality: false,
      cellphone: false,
      residencePopulatedPlace: false,
      residenceAddress: false,
      schoolLevel: false,
      disability: false,
      works: false,
    });

    // --- Reset Intervention fields based on lock state ---
    if (!lockState.program) setProgram("");
    if (!lockState.benefit) setBenefit("");
    if (!lockState.deliveryDepartment) setDeliveryDepartment("");
    if (!lockState.deliveryMunicipality) setDeliveryMunicipality("");
    if (!lockState.deliveryPopulatedPlace) setDeliveryPopulatedPlace("");
    if (!lockState.deliveryDate) setDeliveryDate("");
    if (!lockState.deliveryQuantity) setDeliveryQuantity("1");
    if (!lockState.deliveryValue) setDeliveryValue("");
    if (!lockState.reference) setReference("");
  };

  // Handle form submission
  const handleOpenSubmitDialog = (e: React.FormEvent) => {
    e.preventDefault();

    // --- VALIDATION LOGIC ---
    const errors: string[] = [];

    // Validate "Información del Beneficio Social" fields
    if (!program) errors.push("Programa");
    if (!benefit) errors.push("Beneficio Social");
    if (!deliveryDepartment) errors.push("Departamento de Entrega");
    if (!deliveryMunicipality) errors.push("Municipio de Entrega");
    if (!deliveryPopulatedPlace) errors.push("Lugar poblado de Entrega");
    if (!deliveryDate) errors.push("Fecha de Entrega");
    if (!deliveryQuantity) errors.push("Cantidad");
    if (!deliveryValue) errors.push("Valor del beneficio");

    // Validate "Beneficiario" fields if the form is confirmed for manual entry or completed from API
    if (isConfirmed) {
      if (!cui) errors.push("CUI del beneficiario");

      // Check fields that are supposed to be manually entered
      if (!knownFields.gender && !gender) errors.push("Sexo del beneficiario");
      if (!knownFields.birthDate && !birthDate)
        errors.push("Fecha de Nacimiento del beneficiario");
      if (!knownFields.firstName && !firstName)
        errors.push("Primer Nombre del beneficiario");
      if (!knownFields.firstLastName && !firstLastName)
        errors.push("Primer Apellido del beneficiario");
      if (!knownFields.birthDepartment && !birthDepartment)
        errors.push("Departamento de Nacimiento del beneficiario");
      if (!knownFields.birthMunicipality && !birthMunicipality)
        errors.push("Municipio de Nacimiento del beneficiario");
    } else {
      // If not confirmed, at least CUI (from searchCui) must be present to attempt submission
      // This case might be less common if 'Confirmar' button logic gates progression well
      if (!searchCui) errors.push("CUI (búsqueda)");
    }

    if (errors.length > 0) {
      toast.error(
        `Por favor complete los siguientes campos requeridos: ${errors.join(
          ", "
        )}.`
      );
      return;
    }
    // --- END VALIDATION LOGIC ---

    setIsDialogOpen(true);
  };

  const handleSearchUserByCui = async (cuiToSearch: string) => {
    if (!cuiToSearch || cuiToSearch.length !== 13 || !isCuiValid(cuiToSearch)) {
      // Clear previous results if CUI is no longer valid
      setFoundUserData(null);
      // Also reset beneficiary form fields if CUI becomes invalid during typing
      setCui("");
      setGender("");
      setBirthDate("");
      setFirstName("");
      setSecondName("");
      setThirdName("");
      setFirstLastName("");
      setSecondLastName("");
      setThirdLastName("");
      setBirthDepartment(0);
      setBirthMunicipality(0);
      setPuebloOrigin(0);
      setLinguisticCommunity(0);
      setLanguage(0);
      setRshHomeId(0);
      setResidenceDepartment(0);
      setResidenceMunicipality(0);
      setCellphone("");
      setResidencePopulatedPlace(0);
      setResidenceAddress("");
      setSchoolLevel(0);
      setDisability("");
      setWorks("");
      setKnownFields({
        cui: false,
        gender: false,
        birthDate: false,
        firstName: false,
        secondName: false,
        thirdName: false,
        firstLastName: false,
        secondLastName: false,
        thirdLastName: false,
        birthDepartment: false,
        birthMunicipality: false,
        puebloOrigin: false,
        linguisticCommunity: false,
        language: false,
        rshHomeId: false,
        residenceDepartment: false,
        residenceMunicipality: false,
        cellphone: false,
        residencePopulatedPlace: false,
        residenceAddress: false,
        schoolLevel: false,
        disability: false,
        works: false,
      });
      setIsConfirmed(false); // Ensure form is not in confirmed state
      setFieldErrors({}); // Clear any previous errors
      return;
    }

    setIsSearchingUser(true);
    setFoundUserData(null); // Clear previous results

    try {
      const userBasic = await getUserBasic(cuiToSearch);
      setSearchName(userBasic.nombre_completo);
      setSearchGender(userBasic.sexo === 1 ? "Hombre" : "Mujer");
      setFoundUserData(userBasic);

      if (userBasic) {
        setFoundUserData(userBasic);
      } else {
        // ... handle user not found ...
        // Clear name states when user not found
        setFirstName("");
        setSecondName("");
        setThirdName("");
        setFirstLastName("");
        setSecondLastName("");
        setThirdLastName("");
      }
    } catch (error) {
      // Debugging dpi for testing when the api returns an error
      if (cuiToSearch === "3004735750101") {
        setSearchName("Luis Fernando Ralda Estrada");
        setSearchGender("Hombre");
        setFoundUserData({
          nombre_completo: "Luis Fernando Ralda Estrada",
          sexo: 1,
          cui: "3004735750101",
        });
        return;
      }
      console.error("Error searching user by CUI:", error);
      setFoundUserData(null);
      toast.error("Error al buscar el usuario.");
    } finally {
      setIsSearchingUser(false);
    }
  };
  const handleProgramChange = (value: string) => {
    setProgram(value);
    if (programas && Array.isArray(programas)) {
      const selectedPrograma = programas.find(
        (programa: Programa) => programa.id === parseInt(value)
      );
      if (selectedPrograma) {
        setBeneficiosPrograma(selectedPrograma.beneficios || []);
      }
    }
  };
  const handleSubmitEntrega = async () => {
    const intervention: EntregaIntervenciones = {
      id: 0,
      id_hogar: rshHomeId || 0,
      cui: cui,
      apellido1: firstLastName,
      apellido2: secondLastName,
      apellido_de_casada: thirdLastName,
      nombre1: firstName,
      nombre2: secondName,
      nombre3: thirdName,
      sexo: gender === "Hombre" ? 1 : 2,
      fecha_nacimiento: new Date(birthDate) || new Date(),
      departamento_nacimiento: birthDepartment,
      municipio_nacimiento: birthMunicipality,
      pueblo_pertenencia: puebloOrigin,
      comunidad_linguistica: linguisticCommunity,
      idioma: language,
      trabaja: works === "Si" ? 1 : 2,
      telefono: cellphone,
      escolaridad: schoolLevel,
      departamento_residencia: residenceDepartment,
      municipio_residencia: residenceMunicipality,
      direccion_residencia: residenceAddress,
      institucion: getInstitutionId(institution),
      programa: parseInt(program),
      beneficio: parseInt(benefit),
      departamento_otorgamiento: parseInt(deliveryDepartment),
      municipio_otorgamiento: parseInt(deliveryMunicipality),
      fecha_otorgamiento: new Date(deliveryDate) || new Date(),
      valor: parseInt(deliveryValue),
      discapacidad: !disability ? 2 : 1,
      referencia: reference,
      estado: 1,
    };
    const response = await addInterventions([intervention]);
    if (response) {
      toast.success("Entrega registrada correctamente");
      setIsDialogOpen(false);
      resetForm();
    } else {
      toast.error("Error al registrar la entrega");
    }
  };

  const [isConfirmed, setIsConfirmed] = useState(false);

  const requiredFields = [
    "cui",
    "gender",
    "birthDate",
    "firstName",
    "firstLastName",
    "birthDepartment",
    "birthMunicipality",
  ];

  const handleConfirmar = async () => {
    if (foundUserData) {
      // Scenario 1: User was found by basic search
      try {
        const userFull = await getUserFull(foundUserData.cui);

        // --- Populate states and knownFields from userFull (Existing Logic) ---
        const newKnownFields = { ...knownFields };
        setCui(userFull.cui);
        newKnownFields.cui = true;
        if (userFull.sexo) {
          setGender(userFull.sexo.toString());
          newKnownFields.gender = true;
        }
        if (userFull.fecha_nacimiento) {
          setBirthDate(userFull.fecha_nacimiento);
          newKnownFields.birthDate = true;
        }
        if (userFull.nombre_completo) {
          const fullName = userFull.nombre_completo;
          const words = fullName.trim().split(/\s+/);
          const wordCount = words.length;
          let fn = "",
            sn = "",
            tn = "",
            fln = "",
            sln = "",
            mln = "";
          switch (wordCount) {
            case 6:
              fn = words[0];
              sn = words[1];
              tn = words[2];
              fln = words[3];
              sln = words[4];
              mln = words[5];
              break;
            case 5:
              fn = words[0];
              sn = words[1];
              tn = words[2];
              fln = words[3];
              sln = words[4];
              break;
            case 4:
              fn = words[0];
              sn = words[1];
              fln = words[2];
              sln = words[3];
              break;
            case 3:
              fn = words[0];
              fln = words[1];
              sln = words[2];
              break;
            case 2:
              fn = words[0];
              fln = words[1];
              break;
            case 1:
              fn = words[0];
              break;
            default:
              if (wordCount > 0) {
                fn = words[0];
                fln = words[wordCount - 2] || "";
                sln = words[wordCount - 1] || "";
                if (wordCount > 3) sn = words[1];
                if (wordCount > 4) tn = words[2];
              }
              break;
          }
          setFirstName(fn);
          setSecondName(sn);
          setThirdName(tn);
          setFirstLastName(fln);
          setSecondLastName(sln);
          setThirdLastName(mln);
          newKnownFields.firstName = !!fn;
          newKnownFields.secondName = !!sn;
          newKnownFields.thirdName = !!tn;
          newKnownFields.firstLastName = !!fln;
          newKnownFields.secondLastName = !!sln;
          newKnownFields.thirdLastName = !!mln;
        }
        if (userFull.id_departamento_nacimiento) {
          setBirthDepartment(userFull.id_departamento_nacimiento);
          newKnownFields.birthDepartment = true;
        }
        if (userFull.id_municipio_nacimiento) {
          setBirthMunicipality(userFull.id_municipio_nacimiento);
          newKnownFields.birthMunicipality = true;
        }
        if (userFull.id_pueblo) {
          setPuebloOrigin(userFull.id_pueblo);
          newKnownFields.puebloOrigin = true;
        }
        if (userFull.id_comunidad_linguistica) {
          setLinguisticCommunity(userFull.id_comunidad_linguistica);
          newKnownFields.linguisticCommunity = true;
        }
        if (userFull.id_idioma) {
          setLanguage(userFull.id_idioma);
          newKnownFields.language = true;
        }
        if (userFull.id_nucleo) {
          setRshHomeId(userFull.id_nucleo);
          newKnownFields.rshHomeId = true;
        }
        if (userFull.id_departamento_residencia) {
          setResidenceDepartment(userFull.id_departamento_residencia);
          newKnownFields.residenceDepartment = true;
        }
        if (userFull.id_municipio_residencia) {
          setResidenceMunicipality(userFull.id_municipio_residencia);
          newKnownFields.residenceMunicipality = true;
        }
        if (userFull.telefono) {
          setCellphone(userFull.telefono);
          newKnownFields.cellphone = true;
        }
        if (userFull.id_lugar_poblado_residencia) {
          setResidencePopulatedPlace(userFull.id_lugar_poblado_residencia);
          newKnownFields.residencePopulatedPlace = true;
        }
        if (userFull.direccion) {
          setResidenceAddress(userFull.direccion);
          newKnownFields.residenceAddress = true;
        }
        if (userFull.id_escolaridad) {
          setSchoolLevel(userFull.id_escolaridad);
          newKnownFields.schoolLevel = true;
        }
        if (userFull.discapacidad) {
          setDisability(userFull.discapacidad);
          newKnownFields.disability = true;
        }
        if (userFull.trabaja !== null) {
          setWorks(userFull.trabaja ? "Si" : "No");
          newKnownFields.works = true;
        }
        setKnownFields(newKnownFields);
        setFieldErrors((prev) => ({
          ...prev,
          ...Object.fromEntries(
            Object.keys(newKnownFields)
              .filter(
                (key) => !newKnownFields[key] && requiredFields.includes(key)
              )
              .map((key) => [key, true])
          ),
        }));
        // --- End of Populate states ---

        toast.info("Datos del usuario completados en el formulario."); // Keep existing toast
        setIsConfirmed(true); // Mark data as loaded/confirmed
        setIsDialogOpen(true); // Open the dialog directly
      } catch (error) {
        // Fallback for testing CUI (already in place)
        if (searchCui === "3004735750101") {
          setCui("3004735750101");
          setKnownFields((prev) => ({ ...prev, cui: true }));
          toast.info(
            "Datos del usuario (prueba) completados en el formulario."
          );
          setIsConfirmed(true);
          setIsDialogOpen(true);
          return;
        }
        console.error(
          "Error al obtener los datos completos del usuario:",
          error
        );
        toast.error(
          "Error al obtener los datos completos del usuario. No se puede proceder."
        );
        // Do not open dialog, do not go to manual mode.
      }
    } else if (searchCui && searchCui.length === 13 && isCuiValid(searchCui)) {
      // Scenario 2: User NOT found by basic search, CUI is valid - initiate manual entry

      // Set CUI from searchCui into the main form state
      setCui(searchCui);

      // Reset knownFields: cui is known from input, rest are not.
      const initialManualKnownFields = { ...knownFields }; // Get structure
      for (const key in initialManualKnownFields) {
        initialManualKnownFields[key] = false;
      }
      initialManualKnownFields.cui = true;
      setKnownFields(initialManualKnownFields);

      // Set field errors for required fields that are not CUI and not known
      const manualErrors: Record<string, boolean> = {};
      requiredFields.forEach((field) => {
        if (field !== "cui" && !initialManualKnownFields[field]) {
          manualErrors[field] = true;
        }
      });
      setFieldErrors(manualErrors);

      setIsConfirmed(true); // Show the form for manual entry
      setIsDialogOpen(false); // Ensure dialog is not open
      toast.info(
        "Usuario no encontrado. Por favor, ingrese los datos manualmente."
      );
    } else {
      toast.warning(
        "Por favor, ingrese un CUI válido de 13 dígitos para continuar."
      );
    }
  };

  const { data: programas, isLoading: _isLoadingProgramas } = useQuery({
    queryKey: ["programas"],
    queryFn: () => getAllProgramasWithBeneficios(),
  });

  const toggleLock = (fieldName: keyof typeof initialLockState) => {
    setLockState((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName], // Flip the boolean value
    }));
  };

  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const acceptButtonRef = useRef<HTMLButtonElement>(null);
  const cuiInputRef = useRef<HTMLInputElement>(null);

  // Mover el foco al botón de confirmar cuando se encuentre un usuario básico
  useEffect(() => {
    if (foundUserData && !isDialogOpen && confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
  }, [foundUserData, isDialogOpen]);

  // REMOVE the part of the useEffect that focused acceptButtonRef, keep the rest
  useEffect(() => {
    if (!isDialogOpen && cuiInputRef.current) {
      resetForm();
      setIsConfirmed(false);
      cuiInputRef.current.focus();
    }
  }, [isDialogOpen]);

  // Helper para clase de error
  const errorClass = (field: string) =>
    fieldErrors[field] ? "border-red-500 focus:border-red-500" : "";

  return (
    <div className="w-full px-16 h-full flex flex-col justify-center items-center gap-4">
      <h2 className="text-lg text-[#505050] font-bold">
        Digitación de Entregas
      </h2>
      <form onSubmit={handleOpenSubmitDialog} className="w-full pt-0">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2 flex flex-col gap-2">
            <label htmlFor="institution" className="text-sm font-medium">
              Institución
            </label>
            <input
              type="text"
              id="institution"
              className="rounded-md border p-2 bg-gray-100"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              readOnly
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="acronym" className="text-sm font-medium">
              Siglas
            </label>
            <input
              type="text"
              id="acronym"
              className="rounded-md border p-2 bg-gray-100"
              value={acronym}
              onChange={(e) => setAcronym(e.target.value)}
              readOnly
            />
          </div>
        </div>
        <h3 className="text-lg text-[#505050] font-bold self-start my-6">
          Información del Beneficio Social
        </h3>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label htmlFor="program" className="text-sm font-medium">
                Programa <span className="text-red-500">*</span>
              </label>
              <LockButton
                lockState={lockState.program}
                toggleLock={() => toggleLock("program")}
                field="program"
              />
            </div>
            <Combobox
              options={
                // Check if programas is actually an array before mapping
                Array.isArray(programas)
                  ? programas.map((programa) => ({
                      label: `${programa.nombreComun} (${programa.codigo})`, // Use the correct properties
                      value: programa.id.toString(), // Use ID as value
                    }))
                  : [] // Return an empty array if programas is not an array (e.g., it's the error object or undefined)
              }
              value={program}
              onChange={(value) => handleProgramChange(value)}
              width="full"
              popOverWidth="full"
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label htmlFor="benefit" className="text-sm font-medium">
                Beneficio Social <span className="text-red-500">*</span>
              </label>
              <LockButton
                lockState={lockState.benefit}
                toggleLock={() => toggleLock("benefit")}
                field="benefit"
              />
            </div>
            <Combobox
              options={beneficiosPrograma.map((beneficio) => ({
                label: `${beneficio.nombreCorto} (${beneficio.codigo})`,
                value: String(beneficio.id),
              }))}
              value={benefit}
              onChange={(value) => setBenefit(value)}
              width="full"
              popOverWidth="full"
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label
                htmlFor="deliveryDepartment"
                className="text-sm font-medium"
              >
                Departamento de Entrega <span className="text-red-500">*</span>
              </label>
              <LockButton
                lockState={lockState.deliveryDepartment}
                toggleLock={() => toggleLock("deliveryDepartment")}
                field="deliveryDepartment"
              />
            </div>
            <Combobox
              options={guatemalaGeography.map((department) => ({
                label: department.title,
                value: department.id.toString(),
              }))}
              value={deliveryDepartment}
              onChange={(value) => setDeliveryDepartment(value)}
              width="full"
              popOverWidth="full"
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label
                htmlFor="deliveryMunicipality"
                className="text-sm font-medium"
              >
                Municipio de Entrega <span className="text-red-500">*</span>
              </label>
              <LockButton
                lockState={lockState.deliveryMunicipality}
                toggleLock={() => toggleLock("deliveryMunicipality")}
                field="deliveryMunicipality"
              />
            </div>
            <Combobox
              options={
                guatemalaGeography
                  .find(
                    (department) =>
                      department.id === parseInt(deliveryDepartment)
                  )
                  ?.municipalities.map((municipality) => ({
                    label: municipality.title,
                    value: municipality.id.toString(),
                  })) || []
              }
              value={deliveryMunicipality}
              onChange={(value) => setDeliveryMunicipality(value)}
              width="full"
              popOverWidth="full"
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label
                htmlFor="deliveryPopulatedPlace"
                className="text-sm font-medium"
              >
                Lugar poblado <span className="text-red-500">*</span>
              </label>
              <LockButton
                lockState={lockState.deliveryPopulatedPlace}
                toggleLock={() => toggleLock("deliveryPopulatedPlace")}
                field="deliveryPopulatedPlace"
              />
            </div>
            <Combobox
              options={[
                { label: "Chacpantzé", value: "Chacpantzé" },
                { label: "Chajul", value: "Chajul" },
              ]}
              value={deliveryPopulatedPlace}
              onChange={(value) => setDeliveryPopulatedPlace(value)}
              width="full"
              popOverWidth="full"
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label htmlFor="deliveryDate" className="text-sm font-medium">
                Fecha de Entrega <span className="text-red-500">*</span>
              </label>
              <LockButton
                lockState={lockState.deliveryDate}
                toggleLock={() => toggleLock("deliveryDate")}
                field="deliveryDate"
              />
            </div>
            <DatePicker
              date={deliveryDate ? new Date(deliveryDate) : undefined}
              setDate={(date) =>
                setDeliveryDate(date ? date.toISOString() : "")
              }
              format="dd/MM/yyyy"
              placeholder="dd/mm/yyyy"
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label htmlFor="deliveryQuantity" className="text-sm font-medium">
                Cantidad <span className="text-red-500">*</span>
              </label>
              <LockButton
                lockState={lockState.deliveryQuantity}
                toggleLock={() => toggleLock("deliveryQuantity")}
                field="deliveryQuantity"
              />
            </div>
            <input
              type="number"
              id="deliveryQuantity"
              className="rounded-md border p-2"
              value={deliveryQuantity}
              onChange={(e) => setDeliveryQuantity(e.target.value)}
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label htmlFor="deliveryValue" className="text-sm font-medium">
                Valor del beneficio <span className="text-red-500">*</span>
              </label>
              <LockButton
                lockState={lockState.deliveryValue}
                toggleLock={() => toggleLock("deliveryValue")}
                field="deliveryValue"
              />
            </div>
            <input
              type="number"
              id="deliveryValue"
              className="rounded-md border p-2"
              value={deliveryValue}
              onChange={(e) => setDeliveryValue(e.target.value)}
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label htmlFor="reference" className="text-sm font-medium">
                Referencia
              </label>
              <LockButton
                lockState={lockState.reference}
                toggleLock={() => toggleLock("reference")}
                field="reference"
              />
            </div>
            <input
              type="text"
              id="reference"
              className="rounded-md border p-2"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>
        </div>
        <h3 className="text-lg text-[#505050] font-bold self-start mt-6">
          Beneficiario
        </h3>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="cui" className="text-sm font-medium">
              CUI{" "}
              {isSearchingUser && (
                <span className="text-xs text-gray-500">(Buscando...)</span>
              )}
            </label>
            <input
              type="text"
              id="cui"
              name="cui"
              className={`rounded-md border p-2`}
              value={searchCui}
              onChange={(e) => {
                const newValue = e.target.value.replace(/\D/g, "");
                if (newValue.length > 13) return;

                setSearchCui(newValue);
                if (newValue.length === 13) {
                  handleSearchUserByCui(newValue);
                } else {
                  // Reset all fields when CUI changes
                  setFoundUserData(null);
                  setSearchName("");
                  setSearchGender("");
                  setCui("");
                  setGender("");
                  setBirthDate("");
                  setFirstName("");
                  setSecondName("");
                  setThirdName("");
                  setFirstLastName("");
                  setSecondLastName("");
                  setThirdLastName("");
                  setBirthDepartment(0);
                  setBirthMunicipality(0);
                  setPuebloOrigin(0);
                  setLinguisticCommunity(0);
                  setLanguage(0);
                  setRshHomeId(0);
                  setResidenceDepartment(0);
                  setResidenceMunicipality(0);
                  setCellphone("");
                  setResidencePopulatedPlace(0);
                  setResidenceAddress("");
                  setSchoolLevel(0);
                  setDisability("");
                  setWorks("");
                  // Reset known fields state
                  setKnownFields({
                    cui: false,
                    gender: false,
                    birthDate: false,
                    firstName: false,
                    secondName: false,
                    thirdName: false,
                    firstLastName: false,
                    secondLastName: false,
                    thirdLastName: false,
                    birthDepartment: false,
                    birthMunicipality: false,
                    puebloOrigin: false,
                    linguisticCommunity: false,
                    language: false,
                    rshHomeId: false,
                    residenceDepartment: false,
                    residenceMunicipality: false,
                    cellphone: false,
                    residencePopulatedPlace: false,
                    residenceAddress: false,
                    schoolLevel: false,
                    disability: false,
                    works: false,
                  });
                  setIsConfirmed(false);
                }
              }}
              placeholder="Ingrese 13 dígitos del CUI"
              maxLength={13}
              disabled={isSearchingUser}
              ref={cuiInputRef}
            />
            {foundUserData && !isSearchingUser && (
              <div className="text-xs text-green-700 mt-1">
                Identificación encontrada.
              </div>
            )}
            {!foundUserData && searchCui.length === 13 && !isSearchingUser && (
              <div className="text-xs text-red-600 mt-1">
                {isCuiValid(searchCui)
                  ? "Usuario no encontrado"
                  : "CUI inválido"}
              </div>
            )}
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nombres y Apellidos
            </label>
            <input
              type="text"
              id="name"
              className="rounded-md border p-2 bg-gray-100"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              readOnly
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="gender" className="text-sm font-medium">
              Sexo *
            </label>
            <div className="flex items-center gap-2">
              <div className="w-3/5 pointer-events-none opacity-75">
                <input
                  type="text"
                  className={`rounded-md border p-2 bg-gray-100 w-full`}
                  value={searchGender}
                  onChange={(e) => setSearchGender(e.target.value)}
                  readOnly
                />
              </div>
              <div className="w-2/5 h-full">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-md border w-full h-full focus:border-black"
                  onClick={handleConfirmar}
                  disabled={
                    isSearchingUser ||
                    !(
                      foundUserData ||
                      (searchCui &&
                        searchCui.length === 13 &&
                        isCuiValid(searchCui))
                    )
                  }
                  ref={confirmButtonRef}
                >
                  {foundUserData
                    ? "Confirmar"
                    : searchCui &&
                      searchCui.length === 13 &&
                      isCuiValid(searchCui)
                    ? "Registro manual"
                    : "Confirmar"}
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* Change condition to show form only if confirmed AND dialog is NOT open */}
        {isConfirmed && !isDialogOpen && (
          <>
            <h3 className="text-lg text-[#505050] font-bold self-start mt-6">
              Identificación del beneficiario
            </h3>
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
              {knownFields.cui ? (
                <MaskedField label="CUI *" />
              ) : (
                <InputField
                  label="CUI *"
                  value={cui}
                  onChange={setCui}
                  required
                  className={errorClass("cui")}
                  key="cui"
                />
              )}

              {knownFields.gender ? (
                <MaskedField label="Sexo *" />
              ) : (
                <InputField
                  label="Sexo *"
                  value={gender}
                  onChange={setGender}
                  options={[
                    { value: "1", label: "Hombre" },
                    { value: "2", label: "Mujer" },
                  ]}
                  isCombobox
                  required
                  className={errorClass("gender")}
                  key="gender"
                />
              )}

              {knownFields.birthDate ? (
                <MaskedField label="Fecha de Nacimiento *" />
              ) : (
                <div className="col-span-1 flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    Fecha de Nacimiento <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    date={birthDate ? new Date(birthDate) : undefined}
                    setDate={(date) =>
                      setBirthDate(date ? date.toISOString() : "")
                    }
                    format="dd/MM/yyyy"
                    placeholder="dd/mm/yyyy"
                    className={errorClass("birthDate")}
                  />
                </div>
              )}

              {knownFields.firstName ? (
                <MaskedField label="Primer Nombre *" />
              ) : (
                <InputField
                  label="Primer Nombre *"
                  value={firstName}
                  onChange={setFirstName}
                  required
                  className={errorClass("firstName")}
                  key="firstName"
                />
              )}

              {knownFields.secondName ? (
                <MaskedField label="Segundo Nombre" />
              ) : (
                <InputField
                  label="Segundo Nombre"
                  value={secondName}
                  onChange={setSecondName}
                  key="secondName"
                />
              )}

              {knownFields.thirdName ? (
                <MaskedField label="Tercer Nombre" />
              ) : (
                <InputField
                  label="Tercer Nombre"
                  value={thirdName}
                  onChange={setThirdName}
                  key="thirdName"
                />
              )}

              {knownFields.firstLastName ? (
                <MaskedField label="Primer Apellido" />
              ) : (
                <InputField
                  label="Primer Apellido"
                  value={firstLastName}
                  onChange={setFirstLastName}
                  required
                  className={errorClass("firstLastName")}
                  key="firstLastName"
                />
              )}

              {knownFields.secondLastName ? (
                <MaskedField label="Segundo Apellido" />
              ) : (
                <InputField
                  label="Segundo Apellido"
                  value={secondLastName}
                  onChange={setSecondLastName}
                  key="secondLastName"
                />
              )}

              {knownFields.thirdLastName ? (
                <MaskedField label="Tercer Apellido" />
              ) : (
                <InputField
                  label="Tercer Apellido"
                  value={thirdLastName}
                  onChange={setThirdLastName}
                  key="thirdLastName"
                />
              )}

              {knownFields.birthDepartment ? (
                <MaskedField label="Departamento de Nacimiento" />
              ) : (
                <InputField
                  label="Departamento de Nacimiento"
                  value={birthDepartment.toString()}
                  onChange={(value) => setBirthDepartment(parseInt(value))}
                  options={guatemalaGeography.map((department) => ({
                    label: department.title,
                    value: department.id.toString(),
                  }))}
                  isCombobox
                  className={errorClass("birthDepartment")}
                  key="birthDepartment"
                />
              )}

              {knownFields.birthMunicipality ? (
                <MaskedField label="Municipio de Nacimiento" />
              ) : (
                <InputField
                  label="Municipio de Nacimiento"
                  value={birthMunicipality.toString()}
                  onChange={(value) => setBirthMunicipality(parseInt(value))}
                  options={
                    guatemalaGeography
                      .find((department) => department.id === birthDepartment)
                      ?.municipalities.map((municipality) => ({
                        label: municipality.title,
                        value: municipality.id.toString(),
                      })) || []
                  }
                  isCombobox
                  className={errorClass("birthMunicipality")}
                  key="birthMunicipality"
                />
              )}
            </div>
            <h3 className="text-lg text-[#505050] font-bold self-start mt-6">
              Datos de pertenencia cultural
            </h3>
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
              {knownFields.puebloOrigin ? (
                <MaskedField label="Pueblo de Origen" />
              ) : (
                <InputField
                  label="Pueblo de Origen"
                  value={puebloOrigin.toString()}
                  onChange={(value) => setPuebloOrigin(parseInt(value))}
                  options={[
                    { value: "1", label: "Maya" },
                    { value: "2", label: "Garifuna" },
                    { value: "3", label: "Xinka" },
                    {
                      value: "4",
                      label: "Afrodescendiente / Creole / Afromestizo",
                    },
                    { value: "5", label: "Ladina(o)" },
                    { value: "6", label: "Extranjera(o)" },
                    { value: "7", label: "Sin información" },
                  ]}
                  isCombobox
                  key="puebloOrigin"
                />
              )}

              {knownFields.linguisticCommunity ? (
                <MaskedField label="Comunidad Lingüística" />
              ) : (
                <InputField
                  label="Comunidad Lingüística"
                  value={linguisticCommunity.toString()}
                  onChange={(value) => setLinguisticCommunity(parseInt(value))}
                  options={[
                    { value: "1", label: "Achi" },
                    { value: "2", label: "Akateka" },
                    { value: "3", label: "Awakateka" },
                    { value: "4", label: "Ch'orti'" },
                    { value: "5", label: "Chalchiteka" },
                    { value: "6", label: "Chuj" },
                    { value: "7", label: "Itza'" },
                    { value: "8", label: "Ixil" },
                    { value: "9", label: "Jakalteka/Popti'" },
                    { value: "10", label: "K'iche'" },
                    { value: "11", label: "Kaqchikel" },
                    { value: "12", label: "Mam" },
                    { value: "13", label: "Mopan" },
                    { value: "14", label: "Poqoman" },
                    { value: "15", label: "Poqomchi'" },
                    { value: "16", label: "Q'anjob'al" },
                    { value: "17", label: "Q'eqchi'" },
                    { value: "18", label: "Sakapulteka" },
                    { value: "19", label: "Sipakapense" },
                    { value: "20", label: "Tektiteka" },
                    { value: "21", label: "Tz'utujil" },
                    { value: "22", label: "Uspanteka" },
                    { value: "23", label: "No aplica" },
                    { value: "24", label: "Sin información" },
                  ]}
                  isCombobox
                  key="linguisticCommunity"
                />
              )}

              {knownFields.language ? (
                <MaskedField label="Idioma" />
              ) : (
                <InputField
                  label="Idioma"
                  value={language.toString()}
                  onChange={(value) => setLanguage(parseInt(value))}
                  options={[
                    { value: "1", label: "Achi" },
                    { value: "2", label: "Akateka" },
                    { value: "3", label: "Awakateka" },
                    { value: "4", label: "Ch'orti'" },
                    { value: "5", label: "Chalchiteko" },
                    { value: "6", label: "Chuj" },
                    { value: "7", label: "Itza'" },
                    { value: "8", label: "Ixil" },
                    { value: "9", label: "Jakalteka/Popti'" },
                    { value: "10", label: "K'iche'" },
                    { value: "11", label: "Kaqchikel" },
                    { value: "12", label: "Mam" },
                    { value: "13", label: "Mopan" },
                    { value: "14", label: "Poqomam" },
                    { value: "15", label: "Poqomchi'" },
                    { value: "16", label: "Q'anjob'al" },
                    { value: "17", label: "Q'eqchi'" },
                    { value: "18", label: "Sakapulteko" },
                    { value: "19", label: "Sipakapense" },
                    { value: "20", label: "Tektiteko" },
                    { value: "21", label: "Tz'utujil" },
                    { value: "22", label: "Uspanteko" },
                    { value: "23", label: "Xinka" },
                    { value: "24", label: "Garifuna" },
                    { value: "25", label: "Español" },
                    { value: "26", label: "Inglés" },
                    { value: "27", label: "Señas" },
                    { value: "28", label: "Otro idioma" },
                    { value: "29", label: "No habla" },
                    { value: "30", label: "Sin Información" },
                  ]}
                  isCombobox
                  key="language"
                />
              )}
            </div>
            <h3 className="text-lg text-[#505050] font-bold self-start mt-6">
              Residencia Actual
            </h3>
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
              {knownFields.rshHomeId ? (
                <MaskedField label="ID Hogar RSH" />
              ) : (
                <InputField
                  label="ID Hogar RSH"
                  value={rshHomeId}
                  onChange={(value) => setRshHomeId(parseInt(value))}
                  type="number"
                  key="rshHomeId"
                />
              )}

              {knownFields.residenceDepartment ? (
                <MaskedField label="Departamento de Residencia" />
              ) : (
                <InputField
                  label="Departamento de Residencia"
                  value={residenceDepartment.toString()}
                  onChange={(value) => setResidenceDepartment(parseInt(value))}
                  options={guatemalaGeography.map((department) => ({
                    label: department.title,
                    value: department.id.toString(),
                  }))}
                  isCombobox
                  key="residenceDepartment"
                />
              )}

              {knownFields.residenceMunicipality ? (
                <MaskedField label="Municipio de Residencia" />
              ) : (
                <InputField
                  label="Municipio de Residencia"
                  value={residenceMunicipality.toString()}
                  onChange={(value) =>
                    setResidenceMunicipality(parseInt(value))
                  }
                  options={
                    guatemalaGeography
                      .find(
                        (department) => department.id === residenceDepartment
                      )
                      ?.municipalities.map((municipality) => ({
                        label: municipality.title,
                        value: municipality.id.toString(),
                      })) || []
                  }
                  isCombobox
                  key="residenceMunicipality"
                />
              )}

              {knownFields.cellphone ? (
                <MaskedField label="Teléfono Celular" />
              ) : (
                <InputField
                  label="Teléfono Celular"
                  value={cellphone}
                  onChange={setCellphone}
                  key="cellphone"
                />
              )}

              {knownFields.residencePopulatedPlace ? (
                <MaskedField label="Lugar poblado" />
              ) : (
                <InputField
                  label="Lugar poblado"
                  value={residencePopulatedPlace.toString()}
                  onChange={(value) =>
                    setResidencePopulatedPlace(parseInt(value))
                  }
                  options={[
                    { label: "Chacpantzé", value: "1" },
                    { label: "Chicacao", value: "2" },
                  ]}
                  isCombobox
                  key="residencePopulatedPlace"
                />
              )}

              {knownFields.residenceAddress ? (
                <MaskedField label="Dirección de Residencia" />
              ) : (
                <InputField
                  label="Dirección de Residencia"
                  value={residenceAddress}
                  onChange={setResidenceAddress}
                  key="residenceAddress"
                />
              )}
            </div>
            <h3 className="text-lg text-[#505050] font-bold self-start mt-6">
              Situación Social y Laboral
            </h3>
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
              {knownFields.schoolLevel ? (
                <MaskedField label="Nivel de Estudios" />
              ) : (
                <InputField
                  label="Nivel de Estudios"
                  value={schoolLevel.toString()}
                  onChange={(value) => setSchoolLevel(parseInt(value))}
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
                  isCombobox
                  key="schoolLevel"
                />
              )}

              {knownFields.disability ? (
                <MaskedField label="Discapacidad" />
              ) : (
                <InputField
                  label="Discapacidad"
                  value={disability ? "Sí" : "No"}
                  onChange={(value) => {
                    if (value === "Sí") {
                      setDisability("Sí");
                    } else {
                      setDisability("No");
                    }
                  }}
                  options={[
                    { label: "Sí", value: "Sí" },
                    { label: "No", value: "No" },
                  ]}
                  isCombobox
                  key="disability"
                />
              )}

              {knownFields.works ? (
                <MaskedField label="Trabaja" />
              ) : (
                <InputField
                  label="Trabaja"
                  value={works}
                  onChange={setWorks}
                  options={[
                    { label: "Sí", value: "Sí" },
                    { label: "No", value: "No" },
                  ]}
                  isCombobox
                  key="works"
                />
              )}
            </div>
            <div className="w-full flex justify-end mt-8">
              <Button
                type="submit"
                className="bg-[#1c2851] text-white hover:bg-[#1c2851]/80"
              >
                Registrar Entrega
              </Button>
            </div>
          </>
        )}
      </form>
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (open === false) {
            setIsDialogOpen(false);
          }
        }}
      >
        <DialogContent
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            // Try with a slight delay
            setTimeout(() => {
              acceptButtonRef.current?.focus();
            }, 0);
          }}
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>
              Declaración de veracidad, consentimiento y uso de información
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="mt-4 p-3 bg-gray-100 rounded-md flex flex-col gap-4">
              <p>
                Yo,{" "}
                <span className="bg-yellow-200 px-1 rounded">{user?.name}</span>
                , con CUI{" "}
                <span className="bg-yellow-200 px-1 rounded">{user?.dpi}</span>
                , declaro bajo juramento que la información registrada es veraz
                y exacta. Reconozco que soy plenamente responsable de los datos
                ingresados y que cualquier falsedad, omisión o alteración
                generará las consecuencias legales correspondientes, conforme al
                marco normativo vigente.
                <br />
                <br />
                Autorizo el uso de información complementaria proveniente del
                Sistema Nacional de Información Social (SNIS), incluyendo
                nombres, apellidos, fecha de nacimiento, sexo, lugar de
                nacimiento, pertenencia cultural (pueblo, comunidad lingüística
                e idioma), datos de residencia, teléfono, nivel educativo,
                situación laboral y discapacidad, con el fin de cumplir los
                campos requeridos por dicho sistema.
              </p>
              <div className="bg-white p-3 rounded-md border border-gray-200">
                <h4 className="font-semibold mb-2">
                  Resumen del beneficio a registrarse:
                </h4>
                Nombre del beneficiario/a:{" "}
                <span className="bg-green-200 px-1 rounded">
                  {firstName} {secondName} {thirdName} {firstLastName}{" "}
                  {secondLastName} {thirdLastName}
                </span>
                , CUI: <span className="bg-green-200 px-1 rounded">{cui}</span>,
                Sexo:{" "}
                <span className="bg-green-200 px-1 rounded">
                  {gender === "1" ? "Hombre" : "Mujer"}
                </span>
                , Programa:{" "}
                <span className="bg-green-200 px-1 rounded">
                  {Array.isArray(programas) &&
                    programas.find(
                      (foundPrograma: Programa) =>
                        foundPrograma.id === parseInt(program)
                    )?.nombreComun}
                </span>
                , Beneficio:{" "}
                <span className="bg-green-200 px-1 rounded">
                  {
                    beneficiosPrograma.find(
                      (beneficio) => beneficio.id === parseInt(benefit)
                    )?.nombreCorto
                  }
                </span>
                . Entregado por el{" "}
                <span className="bg-yellow-200 px-1 rounded">
                  {institution}
                </span>
                , en el departamento de{" "}
                <span className="bg-green-200 px-1 rounded">
                  {
                    guatemalaGeography.find(
                      (dep) => dep.id === parseInt(deliveryDepartment)
                    )?.title
                  }
                </span>
                , municipio de{" "}
                <span className="bg-green-200 px-1 rounded">
                  {
                    guatemalaGeography
                      .find((dep) => dep.id === parseInt(deliveryDepartment))
                      ?.municipalities.find(
                        (mun) => mun.id === parseInt(deliveryMunicipality)
                      )?.title
                  }
                </span>
                , lugar poblado{" "}
                <span className="bg-green-200 px-1 rounded">
                  {deliveryPopulatedPlace}
                </span>
                , el{" "}
                <span className="bg-green-200 px-1 rounded">
                  {deliveryDate
                    ? new Date(deliveryDate).toLocaleDateString("es-GT")
                    : ""}
                </span>
                . Cantidad:{" "}
                <span className="bg-green-200 px-1 rounded">
                  {deliveryQuantity}
                </span>
                . Valor total:{" "}
                <span className="bg-green-200 px-1 rounded">
                  Q{deliveryValue}
                </span>
                .
              </div>
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white"
              onClick={handleSubmitEntrega}
              ref={acceptButtonRef}
            >
              Acepto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
const getInstitutionName = (acronym: string) => {
  const institutions: Record<string, string> = {
    MIDES: "Ministerio de Desarrollo Social",
    MINTRAB: "Ministerio de Trabajo",
    SOSEP: "Secretaría de Obras Sociales de la Esposa del Presidente",
    MINEDUC: "Ministerio de Educación",
    SBS: "Secretaría de Bienestar Social",
    CIV: "Ministerio de Comunicaciones, Infraestructura y Vivienda",
    MSPAS: "Ministerio de Salud Pública y Asistencia Social",
    SEGEPLAN: "Secretaría de Planificación y Programación de la Presidencia",
    MARN: "Ministerio de Ambiente y Recursos Naturales",
    CONAMIGUA: "Consejo Nacional de Atención al Migrante de Guatemala",
    DEMI: "Defensoría de la Mujer Indígena",
    MCD: "Ministerio de Cultura y Deportes",
    MAGA: "Ministerio de Agricultura, Ganadería y Alimentación",
    MINECO: "Ministerio de Economía",
    CONJUVE: "Consejo Nacional de la Juventud",
    SEPREM: "Secretaría Presidencial de la Mujer",
    MINGOB: "Ministerio de Gobernación",
  };
  return institutions[acronym] || "NO IDENTIFICADO";
};
export const getInstitutionId = (acronym: string) => {
  const institutions: Record<string, number> = {
    MIDES: 1,
    MINTRAB: 2,
    SOSEP: 3,
    MINEDUC: 4,
    SBS: 5,
    CIV: 6,
    MSPAS: 7,
    SEGEPLAN: 8,
    MARN: 9,
    CONAMIGUA: 10,
    DEMI: 11,
    MCD: 12,
    MAGA: 13,
    MINECO: 14,
    CONJUVE: 15,
    SEPREM: 16,
    MINGOB: 17,
  };
  return institutions[acronym] || 0;
};
export default EntregasSection;
