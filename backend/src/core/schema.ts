import { z } from "zod";

export const DataMappingSchema = z.object({
  seriesPath: z.array(z.string()),
  dataStructure: z.object({
    type: z.enum(["array", "object", "nested"]),
    seriesCount: z.number(),
    fields: z.object({
      xField: z.string().optional(),
      yField: z.string().optional(),
      nameField: z.string().optional(),
      categoryField: z.string().optional(),
    }),
  }),
  fieldMappings: z.array(
    z.object({
      configPath: z.array(z.string().or(z.number())),
      dataPath: z.array(z.string()),
      transformType: z.enum([
        "direct",
        "array",
        "extract-field",
        "object-to-array",
        "nested",
      ]),
    }),
  ),
});

export const TemplateSchema = z.object({
  config: z.record(z.string(), z.unknown()),
  dataMapping: DataMappingSchema,
});
