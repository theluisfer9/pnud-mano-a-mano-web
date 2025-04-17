import { useState } from "react";
import { toast } from "sonner";
import { Lock, Unlock } from "lucide-react";

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
  };
  const [lockState, setLockState] = useState(initialLockState);
  // --- End NEW State ---

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
    setBirthDate(""); // Adjust if using Date object
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
    setResidencePopulatedPlace(0); // Or "" if it's a string state
    setResidenceAddress("");
    setSchoolLevel(0);
    setDisability("");
    setWorks("");

    // --- Reset Intervention fields based on lock state ---
    if (!lockState.program) setProgram("");
    if (!lockState.benefit) setBenefit("");
    if (!lockState.deliveryDepartment) setDeliveryDepartment("");
    if (!lockState.deliveryMunicipality) setDeliveryMunicipality("");
    if (!lockState.deliveryPopulatedPlace) setDeliveryPopulatedPlace("");
    if (!lockState.deliveryDate) setDeliveryDate(""); // Reset Date object
    if (!lockState.deliveryQuantity) setDeliveryQuantity("1"); // Reset to default '1'
    if (!lockState.deliveryValue) setDeliveryValue("");
    // --- End Intervention fields reset ---

    // Optionally reset lock states themselves if needed, otherwise they persist
    // setLockState(initialLockState);
  };

  // Handle form submission
  const handleOpenSubmitDialog = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form
    if (!cui || !program || !benefit || !deliveryDate) {
      toast.error("Por favor complete todos los campos requeridos.");
      return;
    }
    // TODO: VALIDATIONS
    setIsDialogOpen(true);
  };

  const handleSearchUserByCui = async (cui: string) => {
    if (!cui || cui.length !== 13 || !isCuiValid(cui)) {
      // Clear previous results if CUI is no longer valid
      setFoundUserData(null);
      return;
    }

    setIsSearchingUser(true);
    setFoundUserData(null); // Clear previous results

    try {
      const userBasic = await getUserBasic(cui);
      setSearchName(userBasic.nombre_completo);
      setSearchGender(userBasic.sexo === 1 ? "Masculino" : "Femenino");
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
      sexo: gender === "Masculino" ? 1 : 2,
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

  const handleConfirmar = async () => {
    // Check if a user was successfully found
    if (!foundUserData) {
      toast.warning("Primero busque y encuentre un usuario válido por CUI.");
      return;
    }
    const userFull = await getUserFull(foundUserData.cui);
    setCui(userFull.cui);
    setGender(userFull.sexo === 1 ? "Masculino" : "Femenino");
    setBirthDate(userFull.fecha_nacimiento);
    // --- Name Parsing Logic ---
    const fullName = userFull.nombre_completo || "";
    const words = fullName.trim().split(/\s+/); // Split by whitespace, trim edges, handle multiple spaces
    const wordCount = words.length;

    let fn = ""; // first name
    let sn = ""; // second name
    let tn = ""; // third name
    let fln = ""; // first last name
    let sln = ""; // second last name
    let mln = ""; // married last name / third last name

    switch (wordCount) {
      case 6:
        // N N N L L L
        fn = words[0];
        sn = words[1];
        tn = words[2];
        fln = words[3];
        sln = words[4];
        mln = words[5];
        break;
      case 5:
        // N N N L L
        fn = words[0];
        sn = words[1];
        tn = words[2];
        fln = words[3];
        sln = words[4];
        mln = ""; // No third last name
        break;
      case 4:
        // N N L L
        console.log(words);
        fn = words[0];
        sn = words[1];
        tn = ""; // No third name
        fln = words[2];
        sln = words[3];
        mln = ""; // No third last name
        break;
      case 3:
        // N L L
        fn = words[0];
        sn = ""; // No second name
        tn = ""; // No third name
        fln = words[1];
        sln = words[2];
        mln = ""; // No third last name
        break;
      case 2:
        // N L
        fn = words[0];
        sn = "";
        tn = "";
        fln = words[1];
        sln = "";
        mln = "";
        break;
      case 1:
        // N
        fn = words[0];
        sn = "";
        tn = "";
        fln = "";
        sln = "";
        mln = "";
        break;
      default:
        // Handle unexpected counts (e.g., more than 6, or 0)
        // Option 1: Assign first N, first L, rest to second L?
        if (wordCount > 0) {
          fn = words[0];
          fln = words[wordCount - 2] || ""; // Second to last word as first last name
          sln = words[wordCount - 1] || ""; // Last word as second last name
          // You could try assigning middle words to sn/tn if desired
          if (wordCount > 3) sn = words[1];
          if (wordCount > 4) tn = words[2]; // Adjust as needed
        }
        // Ensure all are at least empty strings otherwise
        fn = fn || "";
        sn = sn || "";
        tn = tn || "";
        fln = fln || "";
        sln = sln || "";
        mln = mln || "";
        console.warn(
          `Unhandled name word count: ${wordCount} for name: "${fullName}"`
        );
        break;
    }

    // --- Update State ---
    // Update the individual name states
    console.log(fn, sn, tn, fln, sln, mln);
    setFirstName(fn);
    setSecondName(sn);
    setThirdName(tn);
    setFirstLastName(fln);
    setSecondLastName(sln);
    setThirdLastName(mln); // Or setThirdLastName
    // ... rest of the success logic ...
    setBirthDepartment(userFull.id_departamento_nacimiento);
    setBirthMunicipality(userFull.id_municipio_nacimiento);
    setPuebloOrigin(userFull.id_pueblo);
    setLinguisticCommunity(userFull.id_comunidad_linguistica);
    setLanguage(userFull.id_idioma);
    setRshHomeId(userFull.id_nucleo);
    setResidenceDepartment(userFull.id_departamento_residencia);
    setResidenceMunicipality(userFull.id_municipio_residencia);
    setCellphone(userFull.telefono);
    setResidencePopulatedPlace(userFull.id_lugar_poblado_residencia);
    setResidenceAddress(userFull.direccion);
    setSchoolLevel(userFull.id_escolaridad);
    setDisability(userFull.discapacidad || "");
    setWorks(userFull.trabaja ? "Si" : "No");

    toast.info("Datos del usuario completados en el formulario.");

    // Optionally clear foundUserData after confirming?
    // setFoundUserData(null);
    // setSearchCui(""); // Clear CUI input?
  };

  const { data: programas, isLoading: isLoadingProgramas } = useQuery({
    queryKey: ["programas"],
    queryFn: () => getAllProgramasWithBeneficios(),
  });

  const toggleLock = (fieldName: keyof typeof initialLockState) => {
    setLockState((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName], // Flip the boolean value
    }));
  };

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
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => toggleLock("program")}
                aria-label={
                  lockState.program
                    ? "Desbloquear campo Programa"
                    : "Bloquear campo Programa"
                }
                className="p-1 h-auto"
              >
                {lockState.program ? (
                  <Lock className="h-4 w-4 text-blue-600" />
                ) : (
                  <Unlock className="h-4 w-4 text-gray-500" />
                )}
              </Button>
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
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => toggleLock("benefit")}
                aria-label={
                  lockState.benefit
                    ? "Desbloquear campo Beneficio Social"
                    : "Bloquear campo Beneficio Social"
                }
                className="p-1 h-auto"
              >
                {lockState.benefit ? (
                  <Lock className="h-4 w-4 text-blue-600" />
                ) : (
                  <Unlock className="h-4 w-4 text-gray-500" />
                )}
              </Button>
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
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => toggleLock("deliveryDepartment")}
                aria-label={
                  lockState.deliveryDepartment
                    ? "Desbloquear campo Departamento de Entrega"
                    : "Bloquear campo Departamento de Entrega"
                }
                className="p-1 h-auto"
              >
                {lockState.deliveryDepartment ? (
                  <Lock className="h-4 w-4 text-blue-600" />
                ) : (
                  <Unlock className="h-4 w-4 text-gray-500" />
                )}
              </Button>
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
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => toggleLock("deliveryMunicipality")}
                aria-label={
                  lockState.deliveryMunicipality
                    ? "Desbloquear campo Municipio de Entrega"
                    : "Bloquear campo Municipio de Entrega"
                }
                className="p-1 h-auto"
              >
                {lockState.deliveryMunicipality ? (
                  <Lock className="h-4 w-4 text-blue-600" />
                ) : (
                  <Unlock className="h-4 w-4 text-gray-500" />
                )}
              </Button>
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
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => toggleLock("deliveryPopulatedPlace")}
                aria-label={
                  lockState.deliveryPopulatedPlace
                    ? "Desbloquear campo Lugar poblado"
                    : "Bloquear campo Lugar poblado"
                }
                className="p-1 h-auto"
              >
                {lockState.deliveryPopulatedPlace ? (
                  <Lock className="h-4 w-4 text-blue-600" />
                ) : (
                  <Unlock className="h-4 w-4 text-gray-500" />
                )}
              </Button>
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
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => toggleLock("deliveryDate")}
                aria-label={
                  lockState.deliveryDate
                    ? "Desbloquear campo Fecha de Entrega"
                    : "Bloquear campo Fecha de Entrega"
                }
                className="p-1 h-auto"
              >
                {lockState.deliveryDate ? (
                  <Lock className="h-4 w-4 text-blue-600" />
                ) : (
                  <Unlock className="h-4 w-4 text-gray-500" />
                )}
              </Button>
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
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => toggleLock("deliveryQuantity")}
                aria-label={
                  lockState.deliveryQuantity
                    ? "Desbloquear campo Cantidad"
                    : "Bloquear campo Cantidad"
                }
                className="p-1 h-auto"
              >
                {lockState.deliveryQuantity ? (
                  <Lock className="h-4 w-4 text-blue-600" />
                ) : (
                  <Unlock className="h-4 w-4 text-gray-500" />
                )}
              </Button>
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
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => toggleLock("deliveryValue")}
                aria-label={
                  lockState.deliveryValue
                    ? "Desbloquear campo Valor del beneficio"
                    : "Bloquear campo Valor del beneficio"
                }
                className="p-1 h-auto"
              >
                {lockState.deliveryValue ? (
                  <Lock className="h-4 w-4 text-blue-600" />
                ) : (
                  <Unlock className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
            <input
              type="number"
              id="deliveryValue"
              className="rounded-md border p-2"
              value={deliveryValue}
              onChange={(e) => setDeliveryValue(e.target.value)}
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
              className="rounded-md border p-2"
              value={searchCui}
              onChange={(e) => {
                const newValue = e.target.value.replace(/\D/g, "");
                if (newValue.length > 13) return;

                setSearchCui(newValue);
                if (newValue.length === 13) {
                  handleSearchUserByCui(newValue);
                } else if (foundUserData) {
                  setFoundUserData(null);
                }
              }}
              placeholder="Ingrese 13 dígitos del CUI"
              maxLength={13}
              disabled={isSearchingUser}
            />
            {foundUserData && !isSearchingUser && (
              <div className="text-xs text-green-700 mt-1">
                Identificación encontrada.
              </div>
            )}
            {!foundUserData && searchCui.length === 13 && !isSearchingUser && (
              <div className="text-xs text-red-600 mt-1">
                Usuario no encontrado.
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
              <div className="w-3/4 pointer-events-none opacity-75">
                <input
                  type="text"
                  className="rounded-md border p-2 bg-gray-100 w-full"
                  value={searchGender}
                  onChange={(e) => setSearchGender(e.target.value)}
                  readOnly
                />
              </div>
              <div className="w-1/4">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-md border w-full"
                  onClick={handleConfirmar}
                  disabled={!foundUserData || isSearchingUser}
                >
                  Confirmar
                </Button>
              </div>
            </div>
          </div>
        </div>
        <h3 className="text-lg text-[#505050] font-bold self-start mt-6">
          Identificación del beneficiario
        </h3>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="identification" className="text-sm font-medium">
              CUI *
            </label>
            <input
              type="text"
              id="identification"
              className="rounded-md border p-2 bg-gray-100"
              value={cui}
              onChange={(e) => setCui(e.target.value)}
              readOnly
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="gender" className="text-sm font-medium">
              Sexo *
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="rounded-md border p-2 bg-gray-100 w-full"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                readOnly
              />
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="birthDate" className="text-sm font-medium">
              Fecha de Nacimiento *
            </label>
            <input
              type="text"
              id="birthDate"
              className="rounded-md border p-2 bg-gray-100"
              value={new Date(birthDate).toLocaleDateString("es-GT", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
              onChange={(e) => setBirthDate(e.target.value)}
              placeholder="dd/mm/yyyy"
              readOnly
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="firstName" className="text-sm font-medium">
              Primer Nombre *
            </label>
            <input
              type="text"
              id="firstName"
              className="rounded-md border p-2 bg-gray-100"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              readOnly
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="secondName" className="text-sm font-medium">
              Segundo Nombre
            </label>
            <input
              type="text"
              id="secondName"
              className="rounded-md border p-2 bg-gray-100"
              value={secondName}
              onChange={(e) => setSecondName(e.target.value)}
              readOnly
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="thirdName" className="text-sm font-medium">
              Tercer Nombre
            </label>
            <input
              type="text"
              id="thirdName"
              className="rounded-md border p-2 bg-gray-100"
              value={thirdName}
              onChange={(e) => setThirdName(e.target.value)}
              readOnly
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="firstLastName" className="text-sm font-medium">
              Primer Apellido
            </label>
            <input
              type="text"
              id="firstLastName"
              className="rounded-md border p-2 bg-gray-100"
              value={firstLastName}
              onChange={(e) => setFirstLastName(e.target.value)}
              readOnly
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="secondLastName" className="text-sm font-medium">
              Segundo Apellido
            </label>
            <input
              type="text"
              id="secondLastName"
              className="rounded-md border p-2 bg-gray-100"
              value={secondLastName}
              onChange={(e) => setSecondLastName(e.target.value)}
              readOnly
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="thirdLastName" className="text-sm font-medium">
              Tercer Apellido
            </label>
            <input
              type="text"
              id="thirdLastName"
              className="rounded-md border p-2 bg-gray-100"
              value={thirdLastName}
              onChange={(e) => setThirdLastName(e.target.value)}
              readOnly
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="birthDepartment" className="text-sm font-medium">
              Departamento de Nacimiento
            </label>
            <div className="pointer-events-none opacity-75">
              <Combobox
                options={guatemalaGeography.map((department) => ({
                  label: department.title,
                  value: department.id.toString(),
                }))}
                value={birthDepartment.toString()}
                onChange={(value) => setBirthDepartment(parseInt(value))}
                width="full"
                popOverWidth="full"
              />
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="birthMunicipality" className="text-sm font-medium">
              Municipio de Nacimiento
            </label>
            <div className="pointer-events-none opacity-75">
              <Combobox
                options={
                  guatemalaGeography
                    .find((department) =>
                      department.municipalities.find(
                        (municipality) => municipality.id === birthMunicipality
                      )
                    )
                    ?.municipalities.map((municipality) => ({
                      label: municipality.title,
                      value: municipality.id.toString(),
                    })) || []
                }
                value={birthMunicipality.toString()}
                onChange={(value) => setBirthMunicipality(parseInt(value))}
                width="full"
                popOverWidth="full"
              />
            </div>
          </div>
        </div>
        <h3 className="text-lg text-[#505050] font-bold self-start mt-6">
          Datos de pertenencia cultural
        </h3>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="puebloOrigin" className="text-sm font-medium">
              Pueblo de Origen
            </label>
            <div className="pointer-events-none opacity-75">
              <Combobox
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
                value={puebloOrigin.toString()}
                onChange={(value) => setPuebloOrigin(parseInt(value))}
                width="full"
                popOverWidth="full"
              />
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label
              htmlFor="linguisticCommunity"
              className="text-sm font-medium"
            >
              Comunidad Lingüística
            </label>
            <div className="pointer-events-none opacity-75">
              <Combobox
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
                value={linguisticCommunity.toString()}
                onChange={(value) => setLinguisticCommunity(parseInt(value))}
                width="full"
                popOverWidth="full"
              />
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="language" className="text-sm font-medium">
              Idioma
            </label>
            <div className="pointer-events-none opacity-75">
              <Combobox
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
                value={language.toString()}
                onChange={(value) => setLanguage(parseInt(value))}
                width="full"
                popOverWidth="full"
              />
            </div>
          </div>
        </div>
        <h3 className="text-lg text-[#505050] font-bold self-start mt-6">
          Residencia Actual
        </h3>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="rshHomeId" className="text-sm font-medium">
              ID Hogar RSH
            </label>
            <input
              type="text"
              id="rshHomeId"
              className="rounded-md border p-2 bg-gray-100"
              value={rshHomeId}
              readOnly
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label
              htmlFor="residenceDepartment"
              className="text-sm font-medium"
            >
              Departamento de Residencia
            </label>
            <div className="pointer-events-none opacity-75">
              <Combobox
                options={guatemalaGeography.map((department) => ({
                  label: department.title,
                  value: department.id.toString(),
                }))}
                value={residenceDepartment.toString()}
                onChange={(value) => setResidenceDepartment(parseInt(value))}
                width="full"
                popOverWidth="full"
              />
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label
              htmlFor="residenceMunicipality"
              className="text-sm font-medium"
            >
              Municipio de Residencia
            </label>
            <div className="pointer-events-none opacity-75">
              <Combobox
                options={
                  guatemalaGeography
                    .find((department) =>
                      department.municipalities.find(
                        (municipality) =>
                          municipality.id === residenceMunicipality
                      )
                    )
                    ?.municipalities.map((municipality) => ({
                      label: municipality.title,
                      value: municipality.id.toString(),
                    })) || []
                }
                value={residenceMunicipality.toString()}
                onChange={(value) => setResidenceMunicipality(parseInt(value))}
                width="full"
                popOverWidth="full"
              />
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="cellphone" className="text-sm font-medium">
              Teléfono Celular
            </label>
            <input
              type="text"
              id="cellphone"
              className="rounded-md border p-2 bg-gray-100"
              value={cellphone}
              onChange={(e) => setCellphone(e.target.value)}
              readOnly
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label
              htmlFor="residencePopulatedPlace"
              className="text-sm font-medium"
            >
              Lugar poblado
            </label>
            <input
              type="text"
              id="residencePopulatedPlace"
              className="rounded-md border p-2 bg-gray-100"
              value={residencePopulatedPlace}
              readOnly
            />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="residenceAddress" className="text-sm font-medium">
              Dirección de Residencia
            </label>
            <input
              type="text"
              id="residenceAddress"
              className="rounded-md border p-2 bg-gray-100"
              value={residenceAddress}
              onChange={(e) => setResidenceAddress(e.target.value)}
              readOnly
            />
          </div>
        </div>
        <h3 className="text-lg text-[#505050] font-bold self-start mt-6">
          Situación Social y Laboral
        </h3>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="schoolLevel" className="text-sm font-medium">
              Nivel de Estudios
            </label>
            <div className="pointer-events-none opacity-75">
              <Combobox
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
                value={schoolLevel.toString()}
                onChange={(value) => setSchoolLevel(parseInt(value))}
                width="full"
                popOverWidth="full"
              />
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="disability" className="text-sm font-medium">
              Discapacidad
            </label>
            <div className="pointer-events-none opacity-75">
              <Combobox
                options={[
                  { label: "Sí", value: "Sí" },
                  { label: "No", value: "No" },
                ]}
                value={disability ? "Sí" : "No"}
                onChange={(value) => {
                  if (value === "Sí") {
                    setDisability("Sí");
                  } else {
                    setDisability("No");
                  }
                }}
                width="full"
                popOverWidth="full"
              />
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="works" className="text-sm font-medium">
              Trabaja
            </label>
            <div className="pointer-events-none opacity-75">
              <Combobox
                options={[
                  { label: "Sí", value: "Sí" },
                  { label: "No", value: "No" },
                ]}
                value={works}
                onChange={(value) => setWorks(value)}
                width="full"
                popOverWidth="full"
              />
            </div>
          </div>
        </div>
        <div className="w-full flex justify-end mt-8">
          <Button
            type="submit"
            className="bg-[#1c2851] text-white hover:bg-[#1c2851]/80"
          >
            Registrar Entrega
          </Button>
        </div>
      </form>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmación de registro</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="mt-4 p-3 bg-gray-100 rounded-md grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-2">
                <h4 className="font-semibold mb-2">Resumen del beneficio:</h4>
                <strong>Beneficiado:</strong> {foundUserData?.nombre_completo},
                <strong>CUI:</strong> {foundUserData?.cui},
                <strong>Genero:</strong>{" "}
                {foundUserData?.sexo === 1 ? "Masculino" : "Femenino"}
                <strong>Programa:</strong>{" "}
                {Array.isArray(programas) &&
                  programas.find(
                    (foundPrograma: Programa) =>
                      foundPrograma.id === parseInt(program)
                  )?.nombreComun}
                <strong>Beneficio:</strong>{" "}
                {
                  beneficiosPrograma.find(
                    (beneficio) => beneficio.id === parseInt(benefit)
                  )?.nombreCorto
                }
              </div>
              <div className="flex flex-col gap-2">
                <p>
                  Yo, {user?.name}, con CUI {user?.dpi}, declaro que la
                  información que se encuentra en esta ficha es correcta. Y soy
                  responsable de las consecuencias que se deriven de la misma.
                </p>
              </div>
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitEntrega}>Confirmar</Button>
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
