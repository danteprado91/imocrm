import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateContract } from "@/app/actions/contracts";

export default async function EditarContratoPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const [contrato, clientes, corretores, imoveis] = await Promise.all([
    prisma.contract.findUnique({ where: { id: Number(id) } }),
    prisma.customer.findMany({ orderBy: { name: "asc" } }),
    prisma.agent.findMany({ orderBy: { name: "asc" } }),
    prisma.property.findMany({ orderBy: { title: "asc" } }),
  ]);
  if (!contrato) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href={`/contratos/${id}`} className="text-sm text-muted hover:text-slate-900 dark:text-slate-100">&larr; Voltar</Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">Editar Contrato</h1>
      </div>

      <form action={updateContract.bind(null, contrato.id)} className="space-y-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="customerId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Cliente</label>
            <select id="customerId" name="customerId" required defaultValue={contrato.customerId} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light">
              {clientes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="agentId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Corretor</label>
            <select id="agentId" name="agentId" required defaultValue={contrato.agentId} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light">
              {corretores.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="propertyId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Imóvel</label>
            <select id="propertyId" name="propertyId" required defaultValue={contrato.propertyId} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light">
              {imoveis.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tipo de contrato</label>
            <select id="type" name="type" required defaultValue={contrato.type} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light">
              <option>Venda</option>
              <option>Aluguel</option>
            </select>
          </div>
          <Field label="Valor (R$)" name="value" value={String(contrato.value)} />
          <Field label="Data de assinatura" name="date" value={contrato.date.toISOString().split("T")[0]} />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
          <select id="status" name="status" defaultValue={contrato.status} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light">
            <option>Ativo</option>
            <option>Concluído</option>
            <option>Cancelado</option>
          </select>
        </div>
        <Field label="Observações" name="notes" value={contrato.notes ?? ""} as="textarea" />
        <div className="flex items-center gap-4 pt-4">
          <button type="submit" className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">Salvar alterações</button>
          <Link href={`/contratos/${id}`} className="text-sm font-medium text-muted hover:text-slate-900 dark:text-slate-100">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}

function Field({ label, name, value, as }: { label: string; name: string; value?: string; as?: "textarea" }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      {as === "textarea" ? (
        <textarea id={name} name={name} rows={4} defaultValue={value} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light" />
      ) : (
        <input id={name} name={name} type="text" defaultValue={value} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light" />
      )}
    </div>
  );
}
