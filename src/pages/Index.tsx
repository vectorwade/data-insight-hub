import { useState } from "react";

import { Header } from "@/components/Header";
import { FileUpload } from "@/components/FileUpload";
import { JsonPreview } from "@/components/JsonPreview";
import { JsonXRay } from "@/components/JsonXRay";
import { MetricsCards } from "@/components/MetricsCards";
import { InsightsCard } from "@/components/InsightsCard";
import { AnalysisHistory, AnalysisHistoryItem } from "@/components/AnalysisHistory";
import { DashboardCharts } from "@/components/DashboardCharts";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, AlertCircle } from "lucide-react";

import { analyzeJson } from "@/lib/analyzeJson";
import { analyzeJsonLocally, JsonStats } from "@/lib/jsonStats";
import { toast } from "sonner";

const Index = () => {
  const [rawJsonText, setRawJsonText] = useState("");
  const [parsedJson, setParsedJson] = useState<any>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [localStats, setLocalStats] = useState<JsonStats | null>(null);
  const [insights, setInsights] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [analysisTimestamp, setAnalysisTimestamp] = useState<Date>();
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);

  const handleFileSelect = (content: string, name: string, size: number) => {
    setRawJsonText(content);
    setFileName(name);
    setFileSize(size);
    setAnalysisError("");
    setInsights(null);

    try {
      const parsed = JSON.parse(content);
      setParsedJson(parsed);

      const stats = analyzeJsonLocally(parsed);
      setLocalStats(stats);

      toast.success("JSON carregado!");
    } catch {
      setParsedJson(null);
      setLocalStats(null);
      setAnalysisError("JSON inválido.");
      toast.error("Erro ao fazer parse.");
    }
  };

  const handleClear = () => {
    setRawJsonText("");
    setParsedJson(null);
    setLocalStats(null);
    setInsights(null);
    setAnalysisError("");
    setFileName("");
    setFileSize(0);
  };

  const handleGenerateInsights = async () => {
    if (!parsedJson) return;

    setIsLoading(true);
    setAnalysisError("");
    setInsights(null);

    try {
      const resp: any = await analyzeJson(parsedJson);

      let insightText = resp?.insights || resp?.output || resp?.message?.content || JSON.stringify(resp, null, 2);

      if (Array.isArray(insightText)) {
        insightText = insightText.map((c) => c.text?.value ?? c.text ?? "").join("\n");
      }

      setInsights(insightText);
      setAnalysisTimestamp(new Date());

      setHistory((prev) => [
        {
          id: crypto.randomUUID(),
          fileName,
          timestamp: new Date(),
          insights: insightText,
        },
        ...prev,
      ]);

      toast.success("Insights gerados!");
    } catch (err: any) {
      setAnalysisError(err?.message ?? "Erro inesperado.");
      toast.error("Falha ao gerar insights.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* LADO ESQUERDO */}
          <div className="space-y-6">
            <FileUpload
              fileName={fileName}
              fileSize={fileSize}
              error={analysisError}
              onFileSelect={handleFileSelect}
              onClear={handleClear}
            />

            {rawJsonText && parsedJson && (
              <>
                <JsonPreview jsonText={rawJsonText} />
                <JsonXRay stats={localStats} />
              </>
            )}
          </div>

          {/* LADO DIREITO */}
          <div className="space-y-6">
            {localStats && (
              <MetricsCards totalRecords={localStats.totalRecords} avgFieldsPerRecord={localStats.fields.length} />
            )}

            {parsedJson && <DashboardCharts data={parsedJson} />}

            <Card>
              <div className="p-6">
                <Button
                  className="w-full gap-2 bg-gradient-primary"
                  disabled={!parsedJson || isLoading}
                  size="lg"
                  onClick={handleGenerateInsights}
                >
                  <Sparkles className="h-5 w-5" />
                  {isLoading ? "Gerando insights..." : "Gerar insights"}
                </Button>
              </div>
            </Card>

            {analysisError && (
              <Card className="border-destructive/50 bg-destructive/10">
                <div className="p-6 flex gap-3">
                  <AlertCircle className="text-destructive h-5 w-5" />
                  <p className="text-destructive text-sm">{analysisError}</p>
                </div>
              </Card>
            )}

            <InsightsCard insights={insights} isLoading={isLoading} timestamp={analysisTimestamp} />

            <AnalysisHistory history={history} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
