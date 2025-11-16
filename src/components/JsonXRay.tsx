import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import type { JsonStats } from "@/lib/jsonStats";

interface JsonXRayProps {
  stats: JsonStats | null;
}

export const JsonXRay = ({ stats }: JsonXRayProps) => {
  if (!stats) return null;

  return (
    <Card className="shadow-md">
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold text-foreground">JSON X-Ray</h3>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <p className="text-sm font-medium text-foreground mb-2">Estrutura</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Tipo: {stats.type}</Badge>
            <Badge variant="secondary">{stats.totalRecords} registros</Badge>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground mb-2">
            Campos detectados ({stats.fields.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {stats.fields.slice(0, 10).map((field) => (
              <Badge key={field} variant="outline" className="text-xs">
                {field}
              </Badge>
            ))}
            {stats.fields.length > 10 && (
              <Badge variant="outline" className="text-xs">
                +{stats.fields.length - 10} mais
              </Badge>
            )}
          </div>
        </div>

        {stats.sample && (
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Amostra</p>
            <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">
              <code className="text-foreground">
                {JSON.stringify(stats.sample, null, 2)}
              </code>
            </pre>
          </div>
        )}
      </div>
    </Card>
  );
};
