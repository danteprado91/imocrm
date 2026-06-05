import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Pagination } from "@/components/pagination";

const PAGE_SIZE = 10;

export default async function ContratosPage(props: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await props.searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const [contratos, total] = await Promise.all([
    prisma.contract.findMany({
      orderBy: { date: "desc" }, include: { customer: true, property: true }, skip: (currentPage - 1) * PAGE_SIZE, take: PAGE_SIZE,
    }),
    prisma.contract.count(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Contratos</h1>
          <p className="mt-1 text-sm text-muted">Gerencie os contratos da imobiliária</p>
        </div>
        <Link href="/contratos/novo" className="rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-dark">+ Novo Contrato</Link>
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs font-medium uppercase text-muted">
            <tr><th className="whitespace-nowrap px-4 py-4 sm:px-6">Cliente</th><th className="hidden whitespace-nowrap px-4 py-4 sm:table-cell sm:px-6">Imóvel</th><th className="whitespace-nowrap px-4 py-4 sm:px-6">Valor</th><th className="hidden whitespace-nowrap px-4 py-4 sm:table-cell sm:px-6">Data</th><th className="whitespace-nowrap px-4 py-4 sm:px-6">Status</th><th className="whitespace-nowrap px-4 py-4 sm:px-6"></th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {contratos.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 dark:bg-slate-800/50">
                <td className="px-4 py-4 font-medium text-slate-900 dark:text-slate-100 sm:px-6">{c.customer.name}</td>
                <td className="hidden px-4 py-4 text-muted sm:table-cell sm:px-6">{c.property.title}</td>
                <td className="whitespace-nowrap px-4 py-4 text-slate-900 dark:text-slate-100 sm:px-6">R$ {c.value >= 1000 ? `${(c.value / 1000).toFixed(0).replace(".", ",")}.000` : c.value.toLocaleString("pt-BR")}</td>
                <td className="hidden px-4 py-4 text-muted sm:table-cell sm:px-6">{c.date.toLocaleDateString("pt-BR")}</td>
                <td className="px-4 py-4 sm:px-6"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${c.status === "Ativo" ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300" : c.status === "Cancelado" ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300" : "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"}`}>{c.status}</span></td>
                <td className="px-4 py-4 text-right sm:px-6"><Link href={`/contratos/${c.id}`} className="text-sm font-medium text-primary hover:text-primary-dark">Detalhes</Link></td>
              </tr>
            ))}
            {contratos.length === 0 && <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-muted">Nenhum contrato registrado.</td></tr>}
          </tbody>
        </table>
        <Pagination page={currentPage} totalPages={Math.ceil(total / PAGE_SIZE)} basePath="/contratos" />
      </div>
    </div>
  );
}
