import { useState, useCallback, useRef } from "react";
import { User, UserRole } from "@/data/users";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { createUser, updateUser, deleteUser, getAllUsers } from "@/db/queries";
import { useQuery } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import handleUploadFile from "@/services/uploadfile";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import EditIcon from "@/assets/admin/edit.svg";
import DeleteIcon from "@/assets/admin/delete.svg";

const UserManagementSection = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
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
  const fileRef = useRef<File | null>(null);
  const { toast } = useToast();

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

  const handleFileUpload = async () => {
    if (!fileRef.current) return;

    try {
      console.log("Uploading file:", fileRef.current);
      const fileUrl = await handleUploadFile(fileRef.current, "user-documents");
      setNewUser({
        ...newUser,
        creationApprovalDocument: fileUrl,
      });
      toast({
        title: "Carga exitosa",
        description: `El archivo ${fileRef.current.name} ha sido cargado correctamente.`,
        className: "bg-green-50 border-green-200 text-green-800",
        duration: 3000,
      });
      fileRef.current = null; // Reset fileRef after upload
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar el archivo.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

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

    const newUserData: User = {
      id: 0,
      name: newUser.name,
      dpi: newUser.dpi,
      email: newUser.email,
      role: getRoleValueByLabel(newUser.role),
      institution: newUser.institution,
      accessFrom: newUser.accessFrom,
      accessTo: newUser.accessTo,
      creationApprovalDocument: newUser.creationApprovalDocument,
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
      }); // Reset form
      toast({
        title: "Usuario creado",
        description: "El usuario ha sido creado exitosamente.",
        className: "bg-green-50 border-green-200 text-green-800",
        duration: 3000,
      });
    } else {
      console.error("Failed to create user");
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
      newUser.email &&
      newUser.role &&
      newUser.institution &&
      newUser.accessFrom &&
      newUser.accessTo &&
      newUser.creationApprovalDocument &&
      newUser.jobTitle
    );
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (isError) {
    return <div>Error al cargar los usuarios</div>;
  }

  return (
    <div className="w-full h-full flex flex-col justify-start items-start gap-4 p-4">
      <h1 className="text-2xl font-bold">Manejo de Usuarios</h1>

      <Accordion type="multiple" className="w-full space-y-4">
        <AccordionItem value="create-user" className="border-2 rounded-lg px-4">
          <AccordionTrigger className="text-lg">
            Crear Nuevo Usuario
          </AccordionTrigger>
          <AccordionContent>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nombre completo
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
                  <label htmlFor="dpi" className="text-sm font-medium">
                    DPI
                  </label>
                  <input
                    type="text"
                    id="dpi"
                    value={newUser.dpi}
                    onChange={(e) =>
                      setNewUser({ ...newUser, dpi: e.target.value })
                    }
                    className="rounded-md border p-2"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Correo electrónico
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
                  <label htmlFor="role" className="text-sm font-medium">
                    Rol
                  </label>
                  <select
                    id="role"
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        role: e.target.value as UserRole,
                      })
                    }
                    className="rounded-md border p-2"
                    required
                  >
                    {Object.values(UserRole).map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="accessFrom" className="text-sm font-medium">
                    Acceso desde
                  </label>
                  <input
                    type="date"
                    id="accessFrom"
                    value={newUser.accessFrom}
                    onChange={(e) =>
                      setNewUser({ ...newUser, accessFrom: e.target.value })
                    }
                    className="rounded-md border p-2"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="accessTo" className="text-sm font-medium">
                    Acceso hasta
                  </label>
                  <input
                    type="date"
                    id="accessTo"
                    value={newUser.accessTo}
                    onChange={(e) =>
                      setNewUser({ ...newUser, accessTo: e.target.value })
                    }
                    className="rounded-md border p-2"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="institution" className="text-sm font-medium">
                    Institución
                  </label>
                  <input
                    type="text"
                    id="institution"
                    value={newUser.institution}
                    onChange={(e) =>
                      setNewUser({ ...newUser, institution: e.target.value })
                    }
                    className="rounded-md border p-2"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="jobTitle" className="text-sm font-medium">
                    Cargo
                  </label>
                  <input
                    type="text"
                    id="jobTitle"
                    value={newUser.jobTitle}
                    onChange={(e) =>
                      setNewUser({ ...newUser, jobTitle: e.target.value })
                    }
                    className="rounded-md border p-2"
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label
                    htmlFor="creationApprovalDocument"
                    className="text-sm font-medium"
                  >
                    Documento de soporte
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
                          : "Arrastra un archivo o haz clic para seleccionar"}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleFileUpload}
                    disabled={!fileRef.current}
                    className={`bg-blue-600 text-white px-4 py-2 rounded-md mt-2 hover:bg-blue-700 ${
                      !fileRef.current ? "opacity-50" : ""
                    }`}
                  >
                    Subir documento
                  </button>
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
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="manage-users"
          className="border-2 rounded-lg px-4"
        >
          <AccordionTrigger className="text-lg">
            Administrar Usuarios
          </AccordionTrigger>
          <AccordionContent>
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
                  {usersData.map((user) => (
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
                          onClick={() => setEditingUser(user)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => setUserToDelete(user)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <DeleteIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

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
    </div>
  );
};

export default UserManagementSection;
