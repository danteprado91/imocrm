import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { deleteCustomer } from "@/app/actions/delete";
import { DeleteButton } from "@/components/delete-button";

export default async function ClienteDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const cliente = await prisma.customer.findUnique({ where: { id: Number(id) } });
  if (!cliente) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/clientes" className="text-sm text-muted hover:text-slate-900 dark:text-slate-100">&larr; Voltar</Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{cliente.name}</h1>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <Info label="Nome" value={cliente.name} />
          <Info label="E-mail" value={cliente.email ?? "-"} />
          <Info label="Telefone" value={cliente.phone ?? "-"} />
          <Info label="CPF/CNPJ" value={cliente.document ?? "-"} />
          <Info label="Tipo" value={cliente.type} />
          <Info label="Data de nascimento" value={cliente.birthDate ?? "-"} />
          <Info label="Data de cadastro" value={cliente.createdAt.toLocaleDateString("pt-BR")} />
        </div>
        {cliente.address && <div className="mt-6"><Info label="Endereço" value={cliente.address} /></div>}
        {cliente.notes && <div className="mt-6"><Info label="Observações" value={cliente.notes} /></div>}
      </div>

      <div className="flex items-center gap-4">
        <Link href={`/clientes/${id}/editar`} className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">Editar</Link>
        <DeleteButton action={deleteCustomer.bind(null, cliente.id)} label="este cliente" />
        <Link href="/clientes" className="text-sm font-medium text-muted hover:text-slate-900 dark:text-slate-100">Voltar</Link>
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
