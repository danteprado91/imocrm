import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createVisit } from "@/app/actions/visits";

export default async function NovaVisitaPage() {
  const [clientes, corretores, imoveis] = await Promise.all([
    prisma.customer.findMany({ orderBy: { name: "asc" } }),
    prisma.agent.findMany({ where: { status: "Ativo" }, orderBy: { name: "asc" } }),
    prisma.property.findMany({ orderBy: { title: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/visitas" className="text-sm text-muted hover:text-slate-900 dark:text-slate-100">&larr; Voltar</Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">Nova Visita</h1>
        <p className="mt-1 text-sm text-muted">Agende uma visita a um imóvel</p>
      </div>

      <form action={createVisit} className="space-y-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="customerId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Cliente</label>
            <select id="customerId" name="customerId" required className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light">
              <option value="">Selecione...</option>
              {clientes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="agentId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Corretor</label>
            <select id="agentId" name="agentId" required className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light">
              <option value="">Selecione...</option>
              {corretores.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="propertyId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Imóvel</label>
            <select id="propertyId" name="propertyId" required className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light">
              <option value="">Selecione...</option>
              {imoveis.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Data e Hora</label>
            <input id="date" name="date" type="datetime-local" required className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light" />
          </div>
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Observações</label>
          <textarea id="notes" name="notes" rows={4} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light" />
        </div>
        <div className="flex items-center gap-4 pt-4">
          <button type="submit" className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">Agendar visita</button>
          <Link href="/visitas" className="text-sm font-medium text-muted hover:text-slate-900 dark:text-slate-100">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}
