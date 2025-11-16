import { BarChart3, Layers } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MetricsCardsProps {
  totalRecords: number;
  avgFieldsPerRecord: number;
}

export const MetricsCards = ({
  totalRecords,
  avgFieldsPerRecord,
}: MetricsCardsProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-help overflow-hidden shadow-md transition-shadow hover:shadow-lg">
              <div className="bg-gradient-to-br from-primary/10 to-transparent p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total de Registros
                    </p>
                    <p className="mt-2 text-3xl font-bold text-foreground">
                      {totalRecords.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-primary/20 p-3">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </div>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Número de objetos no array JSON</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-help overflow-hidden shadow-md transition-shadow hover:shadow-lg">
              <div className="bg-gradient-to-br from-accent/10 to-transparent p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Campos por Registro
                    </p>
                    <p className="mt-2 text-3xl font-bold text-foreground">
                      {avgFieldsPerRecord.toFixed(1)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/20 p-3">
                    <Layers className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </div>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Média de propriedades por objeto</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
