import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function UsuariosPage() {
  const usuarios = await prisma.user.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Usuários</h1>
          <p className="mt-1 text-sm text-muted">Gerencie os usuários do sistema</p>
        </div>
        <Link href="/config/usuarios/novo" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">+ Novo Usuário</Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs font-medium uppercase text-muted">
            <tr>
              <th className="px-6 py-4">Nome</th>
              <th className="px-6 py-4">E-mail</th>
              <th className="px-6 py-4">Função</th>
              <th className="px-6 py-4">Ativo</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {usuarios.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 dark:bg-slate-800/50">
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{u.name}</td>
                <td className="px-6 py-4 text-muted">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${u.role === "admin" ? "bg-purple-50 dark:bg-purple-900/30 text-purple-700" : "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"}`}>
                    {u.role === "admin" ? "Admin" : "Corretor"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 text-sm ${u.active ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                    <span className={`h-2 w-2 rounded-full ${u.active ? "bg-green-500" : "bg-red-500"}`} />
                    {u.active ? "Sim" : "Não"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/config/usuarios/${u.id}/editar`} className="text-sm font-medium text-primary hover:text-primary-dark">Editar</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
