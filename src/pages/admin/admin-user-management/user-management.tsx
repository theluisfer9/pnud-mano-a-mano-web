import { useState, useCallback, useRef } from "react";
import { User, UserRole } from "@/data/users";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ComboBox } from "../admin-bulk-uploads/bulk-uploads";
import { AutocompleteInput } from "@/components/Autocomplete/autocomplete";
import { createUser, updateUser, deleteUser, getAllUsers } from "@/db/queries";
import { useQuery } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import handleUploadFile from "@/services/uploadfile";
import getFile from "@/services/getfile";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import EditIcon from "@/assets/admin/edit.svg";
import DeleteIcon from "@/assets/admin/delete.svg";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import { DownloadIcon } from "@radix-ui/react-icons";
import { isCuiValid } from "@/utils/functions";

interface UserManagementSectionProps {
  activeSubViewId: string | null;
}

const UserManagementSection = ({
  activeSubViewId,
}: UserManagementSectionProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    dpi: "",
    email: "",
    role: "",
    institution: "",
    accessFrom: "",
    accessTo: "",
    creationApprovalDocument: "",
    jobTitle: "",
    hasChangedPassword: false,
  });

  // Mock data for job titles
  const [jobTitles, setJobTitles] = useState<
    { value: string; label: string }[]
  >([
    { value: "director", label: "Director" },
    { value: "coordinador", label: "Coordinador" },
    { value: "analista", label: "Analista" },
    { value: "tecnico", label: "Técnico" },
    { value: "especialista", label: "Especialista" },
    { value: "asistente", label: "Asistente" },
    { value: "secretario", label: "Secretario" },
  ]);

  const fileRef = useRef<File | null>(null);
  const { toast } = useToast();
  const [isDpiValid, setIsDpiValid] = useState(false);

  const {
    data: usersData = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
    staleTime: 3 * 60 * 1000, // Data will be considered fresh for 3 minutes
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log("Files dropped:", acceptedFiles);
    fileRef.current = acceptedFiles[0];
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  const institutionOptions = [
    { value: "MIDES", label: "MIDES" },
    { value: "MINTRAB", label: "MINTRAB" },
    { value: "SOSEP", label: "SOSEP" },
    { value: "MINEDUC", label: "MINEDUC" },
    { value: "SBS", label: "SBS" },
    { value: "CIV", label: "CIV" },
    { value: "MSPAS", label: "MSPAS" },
    { value: "SEGEPLAN", label: "SEGEPLAN" },
    { value: "MARN", label: "MARN" },
    { value: "CONAMIGUA", label: "CONAMIGUA" },
    { value: "DEMI", label: "DEMI" },
    { value: "MCD", label: "MCD" },
    { value: "MAGA", label: "MAGA" },
    { value: "MINECO", label: "MINECO" },
    { value: "CONJUVE", label: "CONJUVE" },
    { value: "SEPREM", label: "SEPREM" },
    { value: "MINGOB", label: "MINGOB" },
  ];

  const getRoleValueByLabel = (label: string) => {
    switch (label) {
      case UserRole.SUPER_ADMIN:
        return "super-admin";
      case UserRole.ADMIN:
        return "admin";
      case UserRole.NEWS_EDITOR:
        return "news-editor";
      default:
        return "news-editor";
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if a user with the same DPI already exists
    const dpiExists = usersData.some((user) => user.dpi === newUser.dpi);
    if (dpiExists) {
      toast({
        title: "Error",
        description:
          "Ya existe un usuario con este DPI. El DPI debe ser único.",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    // Show loading toast
    toast({
      title: "Procesando",
      description: "Creando usuario, por favor espere...",
      duration: 5000,
    });

    try {
      // First upload the document if a file is selected
      let documentUrl = "";
      if (fileRef.current) {
        documentUrl = await handleUploadFile(fileRef.current, "user-documents");
      }

      const newUserData: User = {
        id: 0,
        name: newUser.name,
        dpi: newUser.dpi,
        email: newUser.email,
        role: getRoleValueByLabel(newUser.role),
        institution: newUser.institution,
        accessFrom: newUser.accessFrom,
        accessTo: newUser.accessTo,
        creationApprovalDocument: documentUrl,
        jobTitle: newUser.jobTitle,
        hasChangedPassword: newUser.hasChangedPassword,
        password: "", // This should be handled by backend
        profile_picture: "",
      };

      const success = await createUser(newUserData);
      if (success) {
        setUsers([...users, newUserData]);
        setNewUser({
          name: "",
          dpi: "",
          email: "",
          role: "",
          institution: "",
          accessFrom: "",
          accessTo: "",
          creationApprovalDocument: "",
          jobTitle: "",
          hasChangedPassword: false,
        });
        fileRef.current = null; // Reset file ref
        toast({
          title: "Usuario creado",
          description: "El usuario ha sido creado exitosamente.",
          className: "bg-green-50 border-green-200 text-green-800",
          duration: 3000,
        });
      } else {
        throw new Error("Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el usuario.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleEditUser = async (updatedUser: User) => {
    const success = await updateUser(updatedUser.id, updatedUser);
    if (success) {
      setUsers(
        users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      setEditingUser(null);
    } else {
      console.error("Failed to update user");
    }
  };

  const handleDeleteUser = async (user: User) => {
    const success = await deleteUser(user.id);
    if (success) {
      setUsers(users.filter((u) => u.id !== user.id));
      setUserToDelete(null);
    } else {
      console.error("Failed to delete user");
    }
  };

  const isFormComplete = () => {
    return (
      newUser.name &&
      newUser.dpi &&
      isDpiValid &&
      newUser.email &&
      newUser.role &&
      newUser.institution &&
      newUser.accessFrom &&
      newUser.accessTo &&
      fileRef.current !== null && // Check if a file is selected instead of document URL
      newUser.jobTitle
    );
  };

  // Document download handler function
  const handleDownloadDocument = async (documentPath: string) => {
    try {
      // Show loading message
      toast({
        title: "Procesando",
        description: "Descargando documento, por favor espere...",
        duration: 3000,
      });
      const fileName = documentPath.replace(/\"/g, "");
      const fileObjectUrl = await getFile(fileName);
      if (!fileObjectUrl) {
        throw new Error("Failed to get file");
      }

      // Open the file in a new tab instead of trying to force download
      window.open(fileObjectUrl, "_blank");

      toast({
        title: "Éxito",
        description: "El documento se ha abierto en una nueva pestaña",
        className: "bg-green-50 border-green-200 text-green-800",
        duration: 3000,
      });

      // Revoke the object URL to free memory after a delay
      setTimeout(() => URL.revokeObjectURL(fileObjectUrl), 5000);
    } catch (error) {
      console.error("Error downloading document:", error);
      toast({
        title: "Error",
        description:
          "No se pudo descargar el documento. Por favor, intente nuevamente.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (isError) {
    return <div>Error al cargar los usuarios</div>;
  }

  // Render different content based on activeSubViewId
  const renderContent = () => {
    switch (activeSubViewId) {
      case "create-user":
        return (
          <div className="w-full h-full flex flex-col justify-start items-start gap-4 p-4">
            <h1 className="text-2xl font-bold">Crear Nuevo Usuario</h1>
            <form onSubmit={handleCreateUser} className="space-y-4 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="dpi" className="text-sm font-medium">
                    DPI <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="dpi"
                    value={newUser.dpi}
                    onChange={(e) => {
                      const dpiValue = e.target.value.replace(/\s/g, "");
                      // Only allow numbers
                      if (!/^\d*$/.test(dpiValue)) {
                        return;
                      }

                      // Always update the input value to show what the user is typing
                      setNewUser({ ...newUser, dpi: dpiValue });

                      // Only validate when we have the expected 13 digits
                      if (dpiValue.length === 13) {
                        const isValid = isCuiValid(dpiValue);
                        setIsDpiValid(isValid);

                        if (!isValid) {
                          toast({
                            title: "DPI inválido",
                            description:
                              "El DPI ingresado no es válido. Por favor, verifique el número.",
                            variant: "destructive",
                            duration: 3000,
                          });
                        }
                      } else {
                        setIsDpiValid(false);
                      }
                    }}
                    className={`rounded-md border p-2 ${
                      newUser.dpi.length > 0
                        ? isDpiValid
                          ? "border-green-500 bg-green-50"
                          : "border-red-500 bg-red-50"
                        : ""
                    }`}
                    maxLength={13}
                    required
                  />
                  {newUser.dpi.length > 0 && (
                    <p
                      className={`text-xs mt-1 ${
                        isDpiValid ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {newUser.dpi.length < 13
                        ? `Se requieren 13 dígitos (${newUser.dpi.length}/13)`
                        : isDpiValid
                        ? "DPI válido"
                        : "DPI inválido"}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nombre completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="rounded-md border p-2"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Correo electrónico <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="rounded-md border p-2"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="institution" className="text-sm font-medium">
                    Institución <span className="text-red-500">*</span>
                  </label>
                  <ComboBox
                    options={institutionOptions}
                    value={newUser.institution}
                    onChange={(value) =>
                      setNewUser({ ...newUser, institution: value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="jobTitle" className="text-sm font-medium">
                    Cargo <span className="text-red-500">*</span>
                  </label>
                  <AutocompleteInput
                    options={jobTitles}
                    value={newUser.jobTitle}
                    onChange={(value) =>
                      setNewUser({ ...newUser, jobTitle: value })
                    }
                    placeholder="Selecciona o crea un cargo"
                    emptyMessage="No se encontraron cargos"
                    createOptionLabel="Crear nuevo cargo"
                    onCreateOption={(value) => {
                      // Add the new job title to the list
                      const newJobTitle = {
                        value: value.toLowerCase().replace(/\s+/g, "-"),
                        label: value,
                      };
                      setJobTitles([...jobTitles, newJobTitle]);
                    }}
                    className="w-full"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="role" className="text-sm font-medium">
                    Rol <span className="text-red-500">*</span>
                  </label>
                  <ComboBox
                    options={Object.values(UserRole).map((role) => ({
                      value: role,
                      label: role,
                    }))}
                    value={newUser.role}
                    onChange={(value) =>
                      setNewUser({
                        ...newUser,
                        role: value as UserRole,
                      })
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="accessFrom" className="text-sm font-medium">
                    Acceso desde <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="accessFrom"
                    value={newUser.accessFrom}
                    onChange={(e) =>
                      setNewUser({ ...newUser, accessFrom: e.target.value })
                    }
                    className="rounded-md border p-2"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="accessTo" className="text-sm font-medium">
                    Acceso hasta <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="accessTo"
                    value={newUser.accessTo}
                    onChange={(e) => {
                      // Only update if the date is valid (not before accessFrom)
                      const newDate = e.target.value;
                      if (
                        !newUser.accessFrom ||
                        newDate >= newUser.accessFrom
                      ) {
                        setNewUser({ ...newUser, accessTo: newDate });
                      } else {
                        // If invalid date, show error toast
                        toast({
                          title: "Fecha inválida",
                          description:
                            "La fecha de fin de acceso no puede ser anterior a la fecha de inicio.",
                          variant: "destructive",
                          duration: 3000,
                        });
                        // Reset to the last valid value or empty
                        e.target.value = newUser.accessTo;
                      }
                    }}
                    className="rounded-md border p-2"
                    required
                    min={newUser.accessFrom}
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label
                    htmlFor="creationApprovalDocument"
                    className="text-sm font-medium"
                  >
                    Documento de soporte <span className="text-red-500">*</span>
                  </label>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
                      ${
                        isDragActive
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      }
                      ${fileRef.current ? "bg-green-50" : ""}`}
                  >
                    <input {...getInputProps()} />
                    {fileRef.current ? (
                      <p className="text-green-600">
                        Archivo seleccionado: {fileRef.current.name}
                      </p>
                    ) : (
                      <p>
                        {isDragActive
                          ? "Suelta el archivo aquí"
                          : "Arrastra un archivo PDF o haz clic para seleccionar"}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    El archivo será cargado automáticamente al crear el usuario.
                  </p>
                </div>
              </div>
              <button
                type="submit"
                className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 ${
                  !isFormComplete() ? "opacity-50" : ""
                }`}
                disabled={!isFormComplete()}
              >
                Crear usuario
              </button>
            </form>
          </div>
        );
      case "manage-users":
        return (
          <div className="w-full h-full flex flex-col justify-start items-start gap-4 p-4">
            <h1 className="text-2xl font-bold">Administrar Usuarios</h1>
            <div className="w-full overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      DPI
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Institución
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Creado el
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usersData.map((user: User) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.dpi}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.institution}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.accessFrom).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(() => {
                          const today = new Date();
                          const accessTo = new Date(user.accessTo);
                          const accessFrom = new Date(user.accessFrom);

                          if (accessTo < today) return "Sin Acceso";
                          if (accessFrom > today) return "Acceso Pendiente";
                          return user.hasChangedPassword
                            ? "Activo"
                            : "Inactivo";
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setViewingUser(user)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          title="Ver detalles"
                        >
                          <EyeOpenIcon className="h-4 w-4" color="gray" />
                        </button>
                        <button
                          onClick={() => setEditingUser(user)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                          title="Editar"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => setUserToDelete(user)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar"
                        >
                          <DeleteIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            Seleccione una opción del menú
          </div>
        );
    }
  };

  return (
    <>
      {renderContent()}

      {/* View User Dialog */}
      <Dialog open={!!viewingUser} onOpenChange={() => setViewingUser(null)}>
        <DialogContent className="sm:max-w-3xl p-6">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl text-[#2f4489]">
              Detalles del Usuario
            </DialogTitle>
          </DialogHeader>
          {viewingUser && (
            <div className="space-y-8 py-4">
              {/* User Information Section */}
              <div>
                <h3 className="text-md font-semibold text-[#2f4489] mb-4">
                  Información Personal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Nombre
                    </h4>
                    <p className="text-base font-medium">{viewingUser.name}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      DPI
                    </h4>
                    <p className="text-base font-medium">{viewingUser.dpi}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Email
                    </h4>
                    <p className="text-base font-medium">{viewingUser.email}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Cargo
                    </h4>
                    <p className="text-base font-medium">
                      {viewingUser.jobTitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Institutional Information */}
              <div>
                <h3 className="text-md font-semibold text-[#2f4489] mb-4">
                  Información Institucional
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Institución
                    </h4>
                    <p className="text-base font-medium">
                      {viewingUser.institution}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Rol
                    </h4>
                    <p className="text-base font-medium">{viewingUser.role}</p>
                  </div>
                </div>
              </div>

              {/* Access Information */}
              <div>
                <h3 className="text-md font-semibold text-[#2f4489] mb-4">
                  Información de Acceso
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Acceso desde
                    </h4>
                    <p className="text-base font-medium">
                      {new Date(viewingUser.accessFrom).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Acceso hasta
                    </h4>
                    <p className="text-base font-medium">
                      {new Date(viewingUser.accessTo).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Estado
                    </h4>
                    <p
                      className={`text-base font-medium ${(() => {
                        const today = new Date();
                        const accessTo = new Date(viewingUser.accessTo);
                        const accessFrom = new Date(viewingUser.accessFrom);

                        if (accessTo < today) return "text-red-600";
                        if (accessFrom > today) return "text-yellow-600";
                        return viewingUser.hasChangedPassword
                          ? "text-green-600"
                          : "text-orange-600";
                      })()}`}
                    >
                      {(() => {
                        const today = new Date();
                        const accessTo = new Date(viewingUser.accessTo);
                        const accessFrom = new Date(viewingUser.accessFrom);

                        if (accessTo < today) return "Sin Acceso";
                        if (accessFrom > today) return "Acceso Pendiente";
                        return viewingUser.hasChangedPassword
                          ? "Activo"
                          : "Inactivo";
                      })()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Document Section */}
              <div>
                <h3 className="text-md font-semibold text-[#2f4489] mb-4">
                  Documentación
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  {viewingUser.creationApprovalDocument ? (
                    <div className="flex items-center">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          Documento de soporte
                        </h4>
                        <p className="text-base font-medium truncate">
                          {viewingUser.creationApprovalDocument
                            .split("/")
                            .pop()}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleDownloadDocument(
                            viewingUser.creationApprovalDocument
                          )
                        }
                        className="flex items-center bg-[#2f4489] text-white px-4 py-2 rounded-md hover:bg-[#3a5bb8] transition-colors"
                      >
                        <DownloadIcon className="w-4 h-4 mr-2" />
                        Descargar Documento
                      </button>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Documento de soporte
                      </h4>
                      <p className="text-base text-gray-500 italic">
                        No hay documento disponible
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditUser(editingUser);
              }}
              className="space-y-4"
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="edit-name">Nombre</label>
                <input
                  id="edit-name"
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                  className="rounded-md border p-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="edit-dpi">DPI</label>
                <input
                  id="edit-dpi"
                  value={editingUser.dpi}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, dpi: e.target.value })
                  }
                  className="rounded-md border p-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="edit-role">Rol</label>
                <select
                  id="edit-role"
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      role: e.target.value as UserRole,
                    })
                  }
                  className="rounded-md border p-2"
                >
                  {Object.values(UserRole).map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="edit-jobTitle">Cargo</label>
                <AutocompleteInput
                  options={jobTitles}
                  value={editingUser.jobTitle}
                  onChange={(value) =>
                    setEditingUser({ ...editingUser, jobTitle: value })
                  }
                  placeholder="Selecciona o crea un cargo"
                  emptyMessage="No se encontraron cargos"
                  createOptionLabel="Crear nuevo cargo"
                  onCreateOption={(value) => {
                    // Add the new job title to the list
                    const newJobTitle = {
                      value: value.toLowerCase().replace(/\s+/g, "-"),
                      label: value,
                    };
                    setJobTitles([...jobTitles, newJobTitle]);
                  }}
                  className="w-full"
                />
              </div>
              {/*Edit access To*/}
              <div className="flex flex-col gap-2">
                <label htmlFor="edit-accessTo">Acceso hasta</label>
                <input
                  type="date"
                  id="edit-accessTo"
                  value={editingUser.accessTo}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, accessTo: e.target.value })
                  }
                  className="rounded-md border p-2"
                />
              </div>
              <DialogFooter>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Save Changes
                </button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmación de Eliminación</DialogTitle>
          </DialogHeader>
          <p>¿Estás seguro de querer eliminar a {userToDelete?.name}?</p>
          <DialogFooter>
            <button
              onClick={() => setUserToDelete(null)}
              className="px-4 py-2 rounded-md mr-2 border"
            >
              Cancelar
            </button>
            <button
              onClick={() => userToDelete && handleDeleteUser(userToDelete)}
              className="bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Eliminar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  );
};

export default UserManagementSection;
