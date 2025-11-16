import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--secondary))", "#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#a78bfa"];

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

  const last30 = rows.slice(-30).map((row, index) => ({ ...row, _index: index + 1 }));
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <div>
            <p className="text-xs mb-1 text-muted-foreground">Tipo de Gráfico</p>
            <Select value={chartType} onValueChange={(value: "line" | "bar") => setChartType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Linha</SelectItem>
                <SelectItem value="bar">Barras</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Gráfico */}
        <div>
          <p className="font-medium mb-2">Evolução de {metric}</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "line" ? (
                <LineChart data={last30}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="_index" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey={metric} 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              ) : (
                <BarChart data={last30}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="_index" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey={metric} 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {category && (
          <div>
            <p className="font-medium mb-2">Resumo por {category}</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Gráfico de Pizza */}
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(
                        rows.reduce((acc: any, r) => {
                          const key = r[category];
                          acc[key] = (acc[key] ?? 0) + (r[metric] ?? 0);
                          return acc;
                        }, {}),
                      ).map(([name, value]) => ({ name, value }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="hsl(var(--primary))"
                      dataKey="value"
                    >
                      {Object.entries(
                        rows.reduce((acc: any, r) => {
                          const key = r[category];
                          acc[key] = (acc[key] ?? 0) + (r[metric] ?? 0);
                          return acc;
                        }, {}),
                      ).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Tabela */}
              <div className="overflow-auto">
                <table className="w-full text-sm border rounded-md">
                  <thead className="bg-muted">
                    <tr>
                      <th className="border p-2 text-left">{category}</th>
                      <th className="border p-2 text-right">{metric} (total)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(
                      rows.reduce((acc: any, r) => {
                        const key = r[category];
                        acc[key] = (acc[key] ?? 0) + (r[metric] ?? 0);
                        return acc;
                      }, {}),
                    )
                      .sort(([, a], [, b]) => Number(b) - Number(a))
                      .map(([k, v], i) => (
                        <tr key={i} className="hover:bg-muted/50">
                          <td className="border p-2">{k}</td>
                          <td className="border p-2 text-right font-medium">{Number(v).toLocaleString()}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
