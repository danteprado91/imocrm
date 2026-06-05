import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateAgent } from "@/app/actions/agents";

export default async function EditarCorretorPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const corretor = await prisma.agent.findUnique({ where: { id: Number(id) } });
  if (!corretor) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href={`/corretores/${id}`} className="text-sm text-muted hover:text-slate-900 dark:text-slate-100">&larr; Voltar</Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">Editar Corretor</h1>
      </div>

      <form action={updateAgent.bind(null, corretor.id)} className="space-y-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Nome completo" name="name" value={corretor.name} required />
          <Field label="E-mail" name="email" value={corretor.email ?? ""} />
          <Field label="Telefone" name="phone" value={corretor.phone ?? ""} />
          <Field label="CPF" name="document" value={corretor.document ?? ""} />
          <Field label="CRECI" name="creci" value={corretor.creci ?? ""} />
          <Field label="Comissão (%)" name="commission" value={String(corretor.commission)} />
        </div>
        <Field label="Observações" name="notes" value={corretor.notes ?? ""} as="textarea" />
        <div className="flex items-center gap-4 pt-4">
          <button type="submit" className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">Salvar alterações</button>
          <Link href={`/corretores/${id}`} className="text-sm font-medium text-muted hover:text-slate-900 dark:text-slate-100">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}

function Field({ label, name, value, as, className, required }: { label: string; name: string; value?: string; as?: "textarea"; className?: string; required?: boolean }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      {as === "textarea" ? (
        <textarea id={name} name={name} rows={4} defaultValue={value} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light" />
      ) : (
        <input id={name} name={name} type="text" defaultValue={value} required={required} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light" />
      )}
    </div>
  );
}
