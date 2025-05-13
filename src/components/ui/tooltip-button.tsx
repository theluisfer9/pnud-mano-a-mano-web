import { Lock, Unlock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface LockButtonProps {
  lockState: boolean;
  toggleLock: (field: string) => void;
  field: string;
}

export default function LockButton({
  lockState,
  toggleLock,
  field,
}: LockButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => toggleLock(field)}
            aria-label={
              lockState
                ? "Desbloquear campo Beneficio Social"
                : "Bloquear campo Beneficio Social"
            }
            className="p-1 h-auto"
          >
            {lockState ? (
              <Lock className="h-4 w-4 text-blue-600" />
            ) : (
              <Unlock className="h-4 w-4 text-gray-500" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {lockState
              ? "Campo bloqueado, no se limpiará luego de cada registro realizado"
              : "El campo se limpiará luego de cada registro realizado"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
