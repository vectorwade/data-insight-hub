import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (content: string, fileName: string, fileSize: number) => void;
  fileName?: string;
  fileSize?: number;
  onClear: () => void;
  error?: string;
}

export const FileUpload = ({ onFileSelect, fileName, fileSize, onClear, error }: FileUploadProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onFileSelect(content, file.name, file.size);
      };
      reader.readAsText(file);
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "application/json": [".json"],
    },
    multiple: false,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Card className="overflow-hidden shadow-md">
      <div className="p-6">
        {/* Título + botões de ação */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-foreground">Upload do JSON</h2>

          {fileName && (
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" type="button" onClick={open}>
                Trocar arquivo
              </Button>
              <Button variant="ghost" size="sm" type="button" onClick={onClear}>
                Limpar
              </Button>
            </div>
          )}
        </div>

        {/* Estado sem arquivo: dropzone visível */}
        {!fileName ? (
          <div
            {...getRootProps()}
            className={cn(
              "cursor-pointer rounded-lg border-2 border-dashed border-border bg-muted/50 p-8 text-center transition-colors hover:border-primary hover:bg-muted",
              isDragActive && "border-primary bg-muted",
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-full bg-primary/10 p-3">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {isDragActive ? "Solte o arquivo aqui..." : "Arraste um JSON aqui ou clique para selecionar"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Use os arquivos do case para testar</p>
              </div>
              <Button variant="secondary" size="sm" type="button" onClick={open}>
                Selecionar arquivo
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Mantemos o input "escondido" para o botão Trocar arquivo funcionar */}
            <div className="hidden" {...getRootProps()}>
              <input {...getInputProps()} />
            </div>

            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <File className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground" title={fileName}>
                      {fileName}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(fileSize || 0)}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClear} className="h-8 w-8 shrink-0" type="button">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Botões extras logo abaixo do arquivo */}
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" type="button" onClick={open}>
                  Trocar arquivo
                </Button>
                <Button variant="ghost" size="sm" type="button" onClick={onClear}>
                  Limpar
                </Button>
              </div>
            </div>
          </>
        )}

        {error && (
          <div className="mt-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </div>
    </Card>
  );
};
