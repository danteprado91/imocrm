import { Sidebar } from "@/components/sidebar";
import { getSession } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="flex min-h-screen">
      <Sidebar
        userName={session?.name ?? "Usuário"}
        userEmail={session?.email ?? ""}
        userRole={session?.role ?? "corretor"}
      />
      <main className="flex-1 overflow-auto p-4 pt-20 lg:p-8 lg:pt-8">{children}</main>
    </div>
  );
}
