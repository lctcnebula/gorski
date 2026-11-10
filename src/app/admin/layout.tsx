import type { Metadata } from "next";
export const metadata: Metadata = {
  title: { absolute: "Doctor Dashboard | Gorski Chiropractic" },
  robots: { index: false, follow: false },
  manifest: "/admin/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Gorski Admin" },
};
export default function AdminLayout({children}:{children:React.ReactNode}) {
  return <div className="min-h-svh bg-paper text-ink">{children}</div>;
}
