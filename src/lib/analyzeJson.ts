const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || "https://edt.digital-ai.tech/webhook-test/analise-json";

export interface AnalysisResponse {
  insights: string;
}

export async function analyzeJson(jsonData: any): Promise<AnalysisResponse> {
  console.log("Chamando n8n em:", WEBHOOK_URL);

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    });

    if (!response.ok) {
      throw new Error(`Erro ao analisar JSON: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Erro de rede ao chamar n8n:", error);
    const msg = error instanceof Error ? error.message : String(error ?? "Erro desconhecido");
    throw new Error(`Erro de rede ao chamar n8n: ${msg}`);
  }
}
