import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import EditIcon from "@/assets/admin/edit.svg";
import DeleteIcon from "@/assets/admin/delete.svg";
import { useState } from "react";
import { AlertModal } from "@/components/AlertModal/modal";
import { useNavigate } from "react-router-dom";
import {
  deleteNews,
  deleteLifeStories,
  deletePressReleases,
} from "@/db/queries";
type DashboardTableData = {
  type: string;
  title: string;
  date: string;
  time: string;
  publisher: string;
  edit: string;
  delete: string;
};
export const columns: ColumnDef<DashboardTableData>[] = [
  {
    header: "Tipo",
    accessorKey: "type",
    cell: ({ row }) => (
      <div className="text-sm whitespace-normal">{row.getValue("type")}</div>
    ),
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Titulo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "title",
    cell: ({ row }) => (
      <div className="text-sm whitespace-normal">{row.getValue("title")}</div>
    ),
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full justify-start"
        >
          Fecha
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "date",
    cell: ({ row }) => (
      <div className="text-sm whitespace-normal">{row.getValue("date")}</div>
    ),
  },
  {
    header: "Hora",
    accessorKey: "time",
    cell: ({ row }) => (
      <div className="text-sm whitespace-normal">{row.getValue("time")}</div>
    ),
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Usuario
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "publisher",
    cell: ({ row }) => (
      <div className="text-sm whitespace-normal">
        {row.getValue("publisher")}
      </div>
    ),
  },
  {
    header: "Panel de edición",
    accessorKey: "edit",
    cell: ({ row }) => {
      const navigate = useNavigate();
      const type = row.original.type;
      const { id, timesedited } = JSON.parse(row.original.edit);
      return (
        <div className="text-sm whitespace-normal flex items-center gap-2">
          <svg
            className="cursor-pointer"
            onClick={() => {
              if (timesedited < 2) {
                if (type === "Noticia") {
                  navigate(`/nueva-noticia?id=${id}`);
                } else if (type === "Historia de vida") {
                  navigate(`/nueva-historia-de-vida?id=${id}`);
                } else if (type === "Comunicado de prensa") {
                  navigate(`/nuevo-comunicado-de-prensa?id=${id}`);
                } else {
                  alert("Boletines todavía no disponibles");
                }
              }
            }}
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <EditIcon />
          </svg>
          <span className="text-sm">{timesedited}/2</span>
        </div>
      );
    },
  },
  {
    header: "Eliminar",
    accessorKey: "delete",
    cell: ({ row }) => {
      const [showDeleteModal, setShowDeleteModal] = useState(false);
      const type = row.original.type;
      const id = row.original.delete;
      const parsedUser = JSON.parse(
        localStorage.getItem("mano-a-mano-token") || "{}"
      );

      const handleDelete = async () => {
        if (type === "Noticia") {
          await deleteNews(Number(id));
          window.location.reload();
        } else if (type === "Historia de vida") {
          await deleteLifeStories(Number(id));
          window.location.reload();
        } else if (type === "Comunicado de prensa") {
          await deletePressReleases(Number(id));
          window.location.reload();
        } else {
          alert("Boletines todavía no disponibles");
        }
        setShowDeleteModal(false);
      };

      return (
        <>
          <div className="text-sm whitespace-normal">
            <svg
              className="cursor-pointer"
              onClick={() => {
                if (
                  !parsedUser.name.toLowerCase().includes("diana") ||
                  parsedUser.role !== "super-admin"
                ) {
                  setShowDeleteModal(true);
                }
              }}
              width={20}
              height={20}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <DeleteIcon />
            </svg>
          </div>
          <AlertModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={async () => {
              await handleDelete();
            }}
          />
        </>
      );
    },
  },
];
