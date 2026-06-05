import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Pagination } from "@/components/pagination";

const PAGE_SIZE = 10;

export default async function CorretoresPage(props: { searchParams: Promise<{ q?: string; status?: string; page?: string }> }) {
  const { q, status, page } = await props.searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const where = {
    ...(q ? { name: { contains: q } } : {}),
    ...(status ? { status } : {}),
  };

  const [corretores, total] = await Promise.all([
    prisma.agent.findMany({ where, orderBy: { createdAt: "desc" }, skip: (currentPage - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.agent.count({ where }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Corretores</h1>
          <p className="mt-1 text-sm text-muted">Gerencie sua equipe</p>
        </div>
        <Link href="/corretores/novo" className="rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-dark">+ Novo Corretor</Link>
      </div>
      <form className="flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Buscar corretor..." className="block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light sm:w-64" />
        <select name="status" defaultValue={status ?? ""} className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light">
          <option value="">Todos</option>
          <option>Ativo</option>
          <option>Inativo</option>
        </select>
        <button type="submit" className="rounded-lg bg-slate-100 dark:bg-slate-700/50 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600/50">Filtrar</button>
      </form>
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs font-medium uppercase text-muted">
            <tr><th className="whitespace-nowrap px-4 py-4 sm:px-6">Nome</th><th className="hidden whitespace-nowrap px-4 py-4 sm:table-cell sm:px-6">E-mail</th><th className="hidden whitespace-nowrap px-4 py-4 sm:table-cell sm:px-6">Telefone</th><th className="hidden whitespace-nowrap px-4 py-4 sm:table-cell sm:px-6">Comissão</th><th className="whitespace-nowrap px-4 py-4 sm:px-6">Status</th><th className="whitespace-nowrap px-4 py-4 sm:px-6"></th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {corretores.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 dark:bg-slate-800/50">
                <td className="px-4 py-4 font-medium text-slate-900 dark:text-slate-100 sm:px-6">{a.name}</td>
                <td className="hidden px-4 py-4 text-muted sm:table-cell sm:px-6">{a.email ?? "-"}</td>
                <td className="hidden px-4 py-4 text-muted sm:table-cell sm:px-6">{a.phone ?? "-"}</td>
                <td className="hidden px-4 py-4 text-slate-900 dark:text-slate-100 sm:table-cell sm:px-6">{a.commission}%</td>
                <td className="px-4 py-4 sm:px-6"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${a.status === "Ativo" ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300" : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300"}`}>{a.status}</span></td>
                <td className="px-4 py-4 text-right sm:px-6"><Link href={`/corretores/${a.id}`} className="text-sm font-medium text-primary hover:text-primary-dark">Detalhes</Link></td>
              </tr>
            ))}
            {corretores.length === 0 && <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-muted">Nenhum corretor encontrado.</td></tr>}
          </tbody>
        </table>
        <Pagination page={currentPage} totalPages={Math.ceil(total / PAGE_SIZE)} basePath="/corretores" searchParams={{ q, status }} />
      </div>
    </div>
  );
}
