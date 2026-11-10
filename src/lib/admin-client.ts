import type { SubmissionPayload } from "./submission-schema";

export type AdminSubmission = SubmissionPayload & { createdAt: string; status: string };
export const submissionLabels = { appointments: "Appointment", assessment: "Migraine assessment", event: "Event registration" };
export const formCatalog = [
  { kind: "appointments", title: "Appointments", description: "Appointment requests and preferred dates.", href: "/appointments", action: "View appointment requests" },
  { kind: "assessment", title: "Migraine assessments", description: "Completed assessments and questionnaire answers.", href: "/migraine-severity-assessment-tool", action: "View assessments" },
  { kind: "event", title: "Event registrations", description: "Event and workshop registration enquiries.", href: "/register-for-event", action: "View registrations" },
] as const;
export const statusLabels: Record<string, string> = { new: "New", reviewed: "Reviewed", completed: "Completed" };
export async function adminApi(path: string, body?: unknown, signal?: AbortSignal) {
  const response = await fetch(`/api/admin/${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store", signal,
  });
  const data = await response.json();
  if (response.status === 401) throw new Error("Session expired. Please sign in again.");
  if (!response.ok) throw new Error(data.error || "Request failed.");
  return data;
}
export const adminInput = "min-h-11 w-full rounded-lg border border-line bg-white px-3 py-2 text-base text-ink";
