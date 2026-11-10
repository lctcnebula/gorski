import { z } from "zod";
import { assessmentQuestions } from "./assessment";
export const submissionSchema = z.object({
  id: z.string().uuid(),
  kind: z.enum(["appointments", "assessment", "event"]),
  name: z.string().trim().min(2).max(150),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().regex(/^[+()\d .-]{7,40}$/),
  address: z.string().trim().max(500).default(""),
  occupation: z.string().trim().max(200).default(""),
  hobbies: z.string().trim().max(500).default(""),
  preferredDate: z.string().regex(/^(?:\d{4}-\d{2}-\d{2})?$/).default(""),
  message: z.string().trim().max(3000).default(""),
  answers: z.record(z.string(), z.string().max(500)).default({}),
  consent: z.literal(true),
  website: z.string().max(200).default(""),
}).superRefine((value, context) => {
  if (value.kind === "assessment") {
    for (const field of ["address", "occupation", "hobbies"] as const) {
      if (!value[field].trim()) context.addIssue({ code: "custom", path: [field], message: "This field is required." });
    }
    for (const q of assessmentQuestions) {
      if (!(q.options as readonly string[]).includes(value.answers[q.id])) context.addIssue({ code: "custom", path: ["answers", q.id], message: "Please answer this question." });
    }
  }
});
export type SubmissionPayload = z.infer<typeof submissionSchema>;
