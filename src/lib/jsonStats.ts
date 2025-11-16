export interface JsonStats {
  type: "array" | "object" | "primitive";
  totalRecords: number;
  fields: string[];
  sample: any;
}

export function analyzeJsonLocally(data: any): JsonStats {
  if (Array.isArray(data)) {
    const allFields = new Set<string>();
    data.forEach((item) => {
      if (typeof item === "object" && item !== null) {
        Object.keys(item).forEach((k) => allFields.add(k));
      }
    });

    return {
      type: "array",
      totalRecords: data.length,
      fields: Array.from(allFields),
      sample: data[0],
    };
  }

  if (typeof data === "object" && data !== null) {
    const fields = Object.keys(data);
    return {
      type: "object",
      totalRecords: 1,
      fields,
      sample: data,
    };
  }

  return {
    type: "primitive",
    totalRecords: 1,
    fields: [],
    sample: data,
  };
}
