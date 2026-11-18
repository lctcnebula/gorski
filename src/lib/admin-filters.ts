import { z } from "zod";

export const submissionFilters = z.object({
  page: z.coerce.number().int().min(1).max(10000).default(1),
  kind: z.enum(["all", "appointments", "assessment", "event", "contact"]).default("all"),
  status: z.enum(["all", "new", "reviewed", "completed"]).default("all"),
  from: z.string().datetime({ offset: true }).optional(),
  to: z.string().datetime({ offset: true }).optional(),
}).refine(value => !value.from || !value.to || new Date(value.from) < new Date(value.to), {
  message: "The end date must be on or after the start date.",
});

// Date inputs describe days in the office user's local timezone. The API uses an exclusive end.
export function dateBounds(from: string, to: string) {
  const start = from ? new Date(`${from}T00:00:00`) : undefined;
  const end = to ? new Date(`${to}T00:00:00`) : undefined;
  if (end) end.setDate(end.getDate() + 1);
  return { from: start?.toISOString(), to: end?.toISOString() };
}
