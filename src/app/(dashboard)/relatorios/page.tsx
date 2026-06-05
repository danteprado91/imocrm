import { prisma } from "@/lib/prisma";
import { ReportsCharts } from "@/components/reports-charts";
import { ExportPdfButton } from "@/components/export-pdf";

export default async function RelatoriosPage() {
  const [totalProperties, soldProperties, rentedProperties, availableProperties, totalCustomers, totalAgents, contractsByMonth, propertiesByType] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { status: "Vendido" } }),
    prisma.property.count({ where: { status: "Alugado" } }),
    prisma.property.count({ where: { status: "Disponível" } }),
    prisma.customer.count(),
    prisma.agent.count({ where: { status: "Ativo" } }),
    prisma.$queryRaw<Array<{ month: string; total: number; count: number }>>`
      SELECT strftime('%Y-%m', date) as month, COALESCE(SUM(value), 0) as total, COUNT(*) as count
      FROM Contract GROUP BY month ORDER BY month ASC LIMIT 12
    `,
    prisma.property.groupBy({ by: ["type"], _count: { id: true } }),
  ]);

  const topAgents = await prisma.agent.findMany({
    include: { _count: { select: { contracts: true } } },
    orderBy: { contracts: { _count: "desc" } },
    take: 5,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Relatórios</h1>
        <p className="mt-1 text-sm text-muted">Indicadores do seu negócio imobiliário</p>
      </div>
      <div className="flex justify-end"><ExportPdfButton /></div>

      <div className="grid gap-6 sm:grid-cols-3">
        <StatCard value={String(totalProperties)} label="Total de imóveis" />
        <StatCard value={String(soldProperties)} label="Vendidos" color="text-blue-600" />
        <StatCard value={String(rentedProperties)} label="Alugados" color="text-amber-600" />
        <StatCard value={String(availableProperties)} label="Disponíveis" color="text-green-600 dark:text-green-400" />
        <StatCard value={String(totalCustomers)} label="Clientes" color="text-purple-600" />
        <StatCard value={String(totalAgents)} label="Corretores ativos" color="text-rose-600" />
      </div>

      <ReportsCharts
        contractsByMonth={contractsByMonth.map((r: { month: string; total: number; count: number }) => ({ month: r.month, total: Number(r.total), count: r.count }))}
        propertiesByType={propertiesByType.map((p) => ({ type: p.type, count: p._count.id }))}
      />

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Top Corretores</h2>
        <div className="space-y-4">
          {topAgents.map((a, i) => (
            <div key={a.id} className="flex items-center gap-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700/50 text-sm font-bold text-slate-600 dark:text-slate-400">{i + 1}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{a.name}</p>
                <p className="text-xs text-muted">{a._count.contracts} contratos • {a.commission}% comissão</p>
              </div>
              <span className={`text-sm font-medium ${a.status === "Ativo" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{a.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label, color }: { value: string; label: string; color?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
      <p className={`text-3xl font-bold ${color ?? "text-slate-900 dark:text-slate-100"}`}>{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}
