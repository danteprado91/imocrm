import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { deleteContract } from "@/app/actions/delete";
import { DeleteButton } from "@/components/delete-button";

export default async function ContratoDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const contrato = await prisma.contract.findUnique({
    where: { id: Number(id) },
    include: { customer: true, agent: true, property: true },
  });
  if (!contrato) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/contratos" className="text-sm text-muted hover:text-slate-900 dark:text-slate-100">&larr; Voltar</Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">Contrato #{contrato.id}</h1>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <Info label="Cliente" value={contrato.customer.name} />
          <Info label="Corretor" value={contrato.agent.name} />
          <Info label="Imóvel" value={contrato.property.title} />
          <Info label="Tipo" value={contrato.type} />
          <Info label="Valor" value={`R$ ${contrato.value.toLocaleString("pt-BR")}`} />
          <Info label="Data" value={contrato.date.toLocaleDateString("pt-BR")} />
          <Info label="Status" value={contrato.status} />
          <Info label="Criado em" value={contrato.createdAt.toLocaleDateString("pt-BR")} />
        </div>
        {contrato.notes && <div className="mt-6"><Info label="Observações" value={contrato.notes} /></div>}
      </div>

      <div className="flex items-center gap-4">
        <Link href={`/contratos/${id}/editar`} className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">Editar</Link>
        <DeleteButton action={deleteContract.bind(null, contrato.id)} label="este contrato" />
        <Link href="/contratos" className="text-sm font-medium text-muted hover:text-slate-900 dark:text-slate-100">Voltar</Link>
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
