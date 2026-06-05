import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Pagination } from "@/components/pagination";

const PAGE_SIZE = 10;

export default async function ClientesPage(props: { searchParams: Promise<{ q?: string; type?: string; page?: string }> }) {
  const { q, type, page } = await props.searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const where = {
    ...(q ? { name: { contains: q } } : {}),
    ...(type ? { type } : {}),
  };

  const [clientes, total] = await Promise.all([
    prisma.customer.findMany({ where, orderBy: { createdAt: "desc" }, skip: (currentPage - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.customer.count({ where }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Clientes</h1>
          <p className="mt-1 text-sm text-muted">Gerencie sua base de clientes</p>
        </div>
        <Link href="/clientes/novo" className="rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-dark">+ Novo Cliente</Link>
      </div>
      <form className="flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Buscar cliente..." className="block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light sm:w-64" />
        <select name="type" defaultValue={type ?? ""} className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light">
          <option value="">Todos</option>
          <option>Comprador</option>
          <option>Vendedor</option>
          <option>Locatário</option>
          <option>Locador</option>
        </select>
        <button type="submit" className="rounded-lg bg-slate-100 dark:bg-slate-700/50 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600/50">Filtrar</button>
      </form>
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs font-medium uppercase text-muted">
            <tr><th className="whitespace-nowrap px-4 py-4 sm:px-6">Nome</th><th className="hidden whitespace-nowrap px-4 py-4 sm:table-cell sm:px-6">E-mail</th><th className="hidden whitespace-nowrap px-4 py-4 sm:table-cell sm:px-6">Telefone</th><th className="whitespace-nowrap px-4 py-4 sm:px-6">Tipo</th><th className="whitespace-nowrap px-4 py-4 sm:px-6"></th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {clientes.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 dark:bg-slate-800/50">
                <td className="px-4 py-4 font-medium text-slate-900 dark:text-slate-100 sm:px-6">{c.name}</td>
                <td className="hidden px-4 py-4 text-muted sm:table-cell sm:px-6">{c.email ?? "-"}</td>
                <td className="hidden px-4 py-4 text-muted sm:table-cell sm:px-6">{c.phone ?? "-"}</td>
                <td className="px-4 py-4 sm:px-6"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${c.type === "Comprador" ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300" : c.type === "Vendedor" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" : "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"}`}>{c.type}</span></td>
                <td className="px-4 py-4 text-right sm:px-6"><Link href={`/clientes/${c.id}`} className="text-sm font-medium text-primary hover:text-primary-dark">Detalhes</Link></td>
              </tr>
            ))}
            {clientes.length === 0 && <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-muted">Nenhum cliente encontrado.</td></tr>}
          </tbody>
        </table>
        <Pagination page={currentPage} totalPages={Math.ceil(total / PAGE_SIZE)} basePath="/clientes" searchParams={{ q, type }} />
      </div>
    </div>
  );
}
