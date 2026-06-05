import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { deleteVisit } from "@/app/actions/delete";
import { DeleteButton } from "@/components/delete-button";

export default async function VisitaDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const visita = await prisma.visit.findUnique({
    where: { id: Number(id) },
    include: { customer: true, agent: true, property: true },
  });
  if (!visita) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/visitas" className="text-sm text-muted hover:text-slate-900 dark:text-slate-100">&larr; Voltar</Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">Visita #{visita.id}</h1>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <Info label="Cliente" value={visita.customer.name} />
          <Info label="Corretor" value={visita.agent.name} />
          <Info label="Imóvel" value={visita.property.title} />
          <Info label="Data/Hora" value={visita.date.toLocaleString("pt-BR")} />
          <Info label="Status" value={visita.status} />
          <Info label="Criado em" value={visita.createdAt.toLocaleDateString("pt-BR")} />
        </div>
        {visita.notes && <div className="mt-6"><Info label="Observações" value={visita.notes} /></div>}
      </div>

      <div className="flex items-center gap-4">
        <Link href={`/visitas/${id}/editar`} className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">Editar</Link>
        <DeleteButton action={deleteVisit.bind(null, visita.id)} label="esta visita" />
        <Link href="/visitas" className="text-sm font-medium text-muted hover:text-slate-900 dark:text-slate-100">Voltar</Link>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase text-muted">{label}</p>
      <p className="mt-0.5 text-sm text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}
