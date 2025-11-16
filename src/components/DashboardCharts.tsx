import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

interface DashboardChartsProps {
  data: any;
}

export function DashboardCharts({ data }: DashboardChartsProps) {
  const rows: Record<string, any>[] = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.rows)) return data.rows;
    return [];
  }, [data]);

  if (!rows.length || typeof rows[0] !== "object") {
    return (
      <Card className="shadow-md p-6">
        <h3 className="text-base font-semibold">Dashboard do arquivo</h3>
        <p className="text-sm text-muted-foreground mt-2">O JSON enviado não contém registros tabulares válidos.</p>
      </Card>
    );
  }

  const sample = rows[0];
  const numericFields = Object.keys(sample).filter((k) => typeof sample[k] === "number");

  const stringFields = Object.keys(sample).filter((k) => typeof sample[k] === "string");

  const [metric, setMetric] = useState(numericFields[0]);
  const [category, setCategory] = useState<string | null>(stringFields[0] ?? null);

  function exportCSV() {
    const headers = Object.keys(sample);
    const csv = headers.join(";") + "\n" + rows.map((row) => headers.map((h) => row[h]).join(";")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "dashboard.csv";
    a.click();
  }

  function exportPDF() {
    window.print();
  }

  const last30 = rows.slice(-30);
  const maxVal = Math.max(...last30.map((r) => r[metric] ?? 0), 1);

  return (
    <Card className="shadow-md">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Dashboard do arquivo</h3>

          <div className="flex gap-2">
            <Button onClick={exportCSV} size="sm" variant="outline">
              Exportar CSV
            </Button>
            <Button onClick={exportPDF} size="sm" variant="outline">
              Exportar PDF
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs mb-1 text-muted-foreground">Métrica</p>
            <Select value={metric} onValueChange={(value) => setMetric(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a métrica" />
              </SelectTrigger>
              <SelectContent>
                {numericFields.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {stringFields.length > 0 && (
            <div>
              <p className="text-xs mb-1 text-muted-foreground">Categoria</p>
              <Select value={category ?? ""} onValueChange={(value) => setCategory(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {stringFields.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Gráfico */}
        <div>
          <p className="font-medium mb-2">Evolução de {metric}</p>
          <div className="flex h-40 bg-muted rounded-md border px-2 py-2 items-end gap-[2px]">
            {last30.map((row, i) => {
              const v = row[metric] ?? 0;
              const h = (v / maxVal) * 100;
              return (
                <div
                  key={i}
                  className="bg-primary/70 hover:bg-primary transition-all rounded-t flex-1"
                  style={{ height: `${h}%` }}
                ></div>
              );
            })}
          </div>
        </div>

        {category && (
          <div>
            <p className="font-medium mb-2">Resumo por {category}</p>
            <table className="w-full text-sm border rounded-md">
              <thead className="bg-muted">
                <tr>
                  <th className="border p-2">{category}</th>
                  <th className="border p-2">{metric} (total)</th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(
                  rows.reduce((acc: any, r) => {
                    const key = r[category];
                    acc[key] = (acc[key] ?? 0) + (r[metric] ?? 0);
                    return acc;
                  }, {}),
                ).map(([k, v], i) => (
                  <tr key={i}>
                    <td className="border p-2">{k}</td>
                    <td className="border p-2">{Number(v).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
}
