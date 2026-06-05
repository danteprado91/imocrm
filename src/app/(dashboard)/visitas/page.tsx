import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Pagination } from "@/components/pagination";

const PAGE_SIZE = 10;

export default async function VisitasPage(props: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await props.searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const [visitas, total] = await Promise.all([
    prisma.visit.findMany({
      orderBy: { date: "asc" }, include: { customer: true, property: true, agent: true }, skip: (currentPage - 1) * PAGE_SIZE, take: PAGE_SIZE,
    }),
    prisma.visit.count(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Visitas</h1>
          <p className="mt-1 text-sm text-muted">Agende e acompanhe as visitas aos imóveis</p>
        </div>
        <Link href="/visitas/novo" className="rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-dark">+ Nova Visita</Link>
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs font-medium uppercase text-muted">
            <tr><th className="whitespace-nowrap px-4 py-4 sm:px-6">Cliente</th><th className="hidden whitespace-nowrap px-4 py-4 sm:table-cell sm:px-6">Imóvel</th><th className="hidden whitespace-nowrap px-4 py-4 sm:table-cell sm:px-6">Corretor</th><th className="whitespace-nowrap px-4 py-4 sm:px-6">Data/Hora</th><th className="whitespace-nowrap px-4 py-4 sm:px-6">Status</th><th className="whitespace-nowrap px-4 py-4 sm:px-6"></th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {visitas.map((v) => (
              <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 dark:bg-slate-800/50">
                <td className="px-4 py-4 font-medium text-slate-900 dark:text-slate-100 sm:px-6">{v.customer.name}</td>
                <td className="hidden px-4 py-4 text-muted sm:table-cell sm:px-6">{v.property.title}</td>
                <td className="hidden px-4 py-4 text-muted sm:table-cell sm:px-6">{v.agent.name}</td>
                <td className="whitespace-nowrap px-4 py-4 text-slate-900 dark:text-slate-100 sm:px-6">{v.date.toLocaleString("pt-BR")}</td>
                <td className="px-4 py-4 sm:px-6"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${v.status === "Confirmada" ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300" : v.status === "Pendente" ? "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300"}`}>{v.status}</span></td>
                <td className="px-4 py-4 text-right sm:px-6"><Link href={`/visitas/${v.id}`} className="text-sm font-medium text-primary hover:text-primary-dark">Detalhes</Link></td>
              </tr>
            ))}
            {visitas.length === 0 && <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-muted">Nenhuma visita agendada.</td></tr>}
          </tbody>
        </table>
        <Pagination page={currentPage} totalPages={Math.ceil(total / PAGE_SIZE)} basePath="/visitas" />
      </div>
    </div>
  );
}
