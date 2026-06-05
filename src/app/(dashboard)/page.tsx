import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DashboardCharts } from "@/components/dashboard-charts";

export default async function DashboardPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [propertyCount, customerCount, agentCount, contractCount, propertiesByType, recentProperties, upcomingVisits, todayVisits, expiringContracts] = await Promise.all([
    prisma.property.count(),
    prisma.customer.count(),
    prisma.agent.count({ where: { status: "Ativo" } }),
    prisma.contract.count({ where: { status: "Ativo" } }),
    prisma.property.groupBy({ by: ["type"], _count: { id: true } }),
    prisma.property.findMany({ take: 4, orderBy: { createdAt: "desc" } }),
    prisma.visit.findMany({
      take: 5, orderBy: { date: "asc" }, where: { date: { gte: new Date() } }, include: { customer: true, property: true },
    }),
    prisma.visit.findMany({
      where: { date: { gte: today, lt: tomorrow } }, include: { customer: true, property: true, agent: true }, orderBy: { date: "asc" },
    }),
    prisma.contract.findMany({
      where: { status: "Ativo" }, orderBy: { date: "asc" }, take: 3, include: { customer: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">Visão geral do seu negócio imobiliário</p>
      </div>

      {todayVisits.length > 0 && (
        <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/30 p-4">
          <h2 className="text-sm font-semibold text-amber-800 dark:text-amber-300">📅 Visitas de hoje ({todayVisits.length})</h2>
          <div className="mt-2 space-y-1">
            {todayVisits.map((v) => (
              <p key={v.id} className="text-sm text-amber-700 dark:text-amber-300">
                {v.date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} — {v.customer.name} com {v.agent.name} em {v.property.title}
              </p>
            ))}
          </div>
        </div>
      )}

      {expiringContracts.length > 0 && (
        <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 p-4">
          <h2 className="text-sm font-semibold text-blue-800 dark:text-blue-300">📄 Contratos ativos mais antigos</h2>
          <div className="mt-2 space-y-1">
            {expiringContracts.map((c) => (
              <p key={c.id} className="text-sm text-blue-700 dark:text-blue-300">{c.customer.name} — {c.type} — desde {c.date.toLocaleDateString("pt-BR")}</p>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card value={String(propertyCount)} label="Imóveis" color="text-blue-600" bg="bg-blue-50 dark:bg-blue-900/30" />
        <Card value={String(customerCount)} label="Clientes" color="text-green-600" bg="bg-green-50 dark:bg-green-900/30" />
        <Card value={String(agentCount)} label="Corretores ativos" color="text-amber-600" bg="bg-amber-50 dark:bg-amber-900/30" />
        <Card value={String(contractCount)} label="Contratos ativos" color="text-purple-600" bg="bg-purple-50 dark:bg-purple-900/30" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DashboardCharts propertiesByType={propertiesByType.map((p) => ({ type: p.type, count: p._count.id }))} />
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Próximas visitas</h2>
          <div className="space-y-3">
            {upcomingVisits.map((v) => (
              <div key={v.id} className="flex items-center justify-between rounded-lg border border-slate-100 dark:border-slate-700 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{v.customer.name}</p>
                  <p className="text-xs text-muted">{v.date.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                <span className="text-xs text-muted">{v.status}</span>
              </div>
            ))}
            {upcomingVisits.length === 0 && <p className="text-sm text-muted">Nenhuma visita agendada.</p>}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Últimos imóveis</h2>
            <Link href="/imoveis" className="text-sm font-medium text-primary hover:text-primary-dark">Ver todos</Link>
          </div>
          <div className="space-y-3">
            {recentProperties.map((p) => (
              <Link key={p.id} href={`/imoveis/${p.id}`} className="flex items-center justify-between rounded-lg border border-slate-100 dark:border-slate-700 px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{p.title}</p>
                  <p className="text-xs text-muted">{p.address.split(",")[0]}</p>
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{p.salePrice ? `R$ ${(p.salePrice / 1000).toFixed(0)}.000` : ""}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Acesso rápido</h2>
          <div className="grid grid-cols-2 gap-4">
            <QuickLink href="/imoveis/novo" label="Novo Imóvel" icon="🏠" />
            <QuickLink href="/clientes/novo" label="Novo Cliente" icon="👤" />
            <QuickLink href="/contratos/novo" label="Novo Contrato" icon="📄" />
            <QuickLink href="/relatorios" label="Relatórios" icon="📊" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ value, label, color, bg }: { value: string; label: string; color: string; bg: string }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}

function QuickLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 p-4 text-center transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50">
      <span className="text-2xl">{icon}</span>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
    </Link>
  );
}
