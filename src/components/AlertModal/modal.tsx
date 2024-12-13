import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function AlertModal({ isOpen, onClose, onConfirm }: AlertModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white max-w-[400px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl font-medium">
            Atención
          </AlertDialogTitle>
          <p className="text-center text-sm text-gray-500">
            ¿Quieres eliminar esta publicación de manera definitiva?
          </p>
        </AlertDialogHeader>
        <div className="flex flex-col gap-2 pt-6">
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-[#36378C] hover:bg-[#36378C]/90"
          >
            Eliminar
          </AlertDialogAction>
          <AlertDialogCancel
            onClick={onClose}
            className="border border-[#8B94A6] text-[#36378C]"
          >
            Cancelar
          </AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
