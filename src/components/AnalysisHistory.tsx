import { History, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ReactMarkdown from "react-markdown";

export interface AnalysisHistoryItem {
  id: string;
  fileName: string;
  timestamp: Date;
  insights: string;
}

interface AnalysisHistoryProps {
  history: AnalysisHistoryItem[];
}

export const AnalysisHistory = ({ history }: AnalysisHistoryProps) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-md">
      <div className="border-b border-border p-6">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Histórico de análises
          </h2>
          <Badge variant="secondary" className="ml-auto">
            {history.length}
          </Badge>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/50 p-3 transition-colors hover:bg-muted"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {item.fileName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(item.timestamp, "dd/MM/yyyy 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 gap-2 shrink-0">
                    <Eye className="h-4 w-4" />
                    Ver insights
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Insights - {item.fileName}</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="max-h-[600px] pr-4">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>{item.insights}</ReactMarkdown>
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
