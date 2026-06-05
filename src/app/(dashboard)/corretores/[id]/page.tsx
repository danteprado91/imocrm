import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { deleteAgent } from "@/app/actions/delete";
import { DeleteButton } from "@/components/delete-button";

export default async function CorretorDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const corretor = await prisma.agent.findUnique({ where: { id: Number(id) } });
  if (!corretor) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/corretores" className="text-sm text-muted hover:text-slate-900 dark:text-slate-100">&larr; Voltar</Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{corretor.name}</h1>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <Info label="Nome" value={corretor.name} />
          <Info label="E-mail" value={corretor.email ?? "-"} />
          <Info label="Telefone" value={corretor.phone ?? "-"} />
          <Info label="CPF" value={corretor.document ?? "-"} />
          <Info label="CRECI" value={corretor.creci ?? "-"} />
          <Info label="Comissão" value={`${corretor.commission}%`} />
          <Info label="Status" value={corretor.status} />
          <Info label="Data de cadastro" value={corretor.createdAt.toLocaleDateString("pt-BR")} />
        </div>
        {corretor.notes && <div className="mt-6"><Info label="Observações" value={corretor.notes} /></div>}
      </div>

      <div className="flex items-center gap-4">
        <Link href={`/corretores/${id}/editar`} className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">Editar</Link>
        <DeleteButton action={deleteAgent.bind(null, corretor.id)} label="este corretor" />
        <Link href="/corretores" className="text-sm font-medium text-muted hover:text-slate-900 dark:text-slate-100">Voltar</Link>
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
