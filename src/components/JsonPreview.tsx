import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface JsonPreviewProps {
  jsonText: string;
}

export const JsonPreview = ({ jsonText }: JsonPreviewProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const previewLines = jsonText.split("\n").slice(0, 10);
  const totalLines = jsonText.split("\n").length;
  const hasMore = totalLines > 10;

  return (
    <Card className="shadow-md">
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">Preview do JSON</h3>
          {hasMore && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="gap-1"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Recolher
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Expandir ({totalLines} linhas)
                </>
              )}
            </Button>
          )}
        </div>
      </div>
      <div className="p-4">
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
          <code className="text-foreground">
            {isExpanded ? jsonText : previewLines.join("\n")}
            {!isExpanded && hasMore && "\n..."}
          </code>
        </pre>
      </div>
    </Card>
  );
};
