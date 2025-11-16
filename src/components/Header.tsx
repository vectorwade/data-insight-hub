import { BarChart3 } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b border-border bg-card shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Data Insight Dashboard</h1>
            <p className="text-sm text-muted-foreground">Análise inteligente de dados JSON</p>
          </div>
        </div>
      </div>
    </header>
  );
};
