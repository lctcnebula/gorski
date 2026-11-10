import { redirect } from "next/navigation";
import { authenticated } from "@/lib/server/security";
import { AdminDashboard } from "@/components/AdminDashboard";
export const dynamic = "force-dynamic";
export default async function AdminPage({searchParams}:{searchParams:Promise<{id?:string}>}) {
  if (!await authenticated()) redirect("/admin/login");
  return <AdminDashboard initialSelectedId={(await searchParams).id} />;
}
