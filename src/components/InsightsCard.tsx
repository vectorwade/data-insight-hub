import { Card } from "@/components/ui/card";
import { Loader2, Lightbulb } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ReactMarkdown from "react-markdown";

interface InsightsCardProps {
  insights: string | null;
  isLoading: boolean;
  timestamp?: Date;
}

export const InsightsCard = ({ insights, isLoading, timestamp }: InsightsCardProps) => {
  if (!insights && !isLoading) return null;

  return (
    <Card className="shadow-md">
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Insights Gerados</h3>
          </div>
          {timestamp && (
            <p className="text-xs text-muted-foreground">
              {format(timestamp, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </p>
          )}
        </div>
      </div>
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-8">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Gerando insights...</p>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{insights || ""}</ReactMarkdown>
          </div>
        )}
      </div>
    </Card>
  );
};
