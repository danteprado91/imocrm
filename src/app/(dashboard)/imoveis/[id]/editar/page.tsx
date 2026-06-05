import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateProperty } from "@/app/actions/properties";
import { ImageUpload } from "@/components/image-upload";

export default async function EditarImovelPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const imovel = await prisma.property.findUnique({
    where: { id: Number(id) },
    include: { images: true },
  });
  if (!imovel) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href={`/imoveis/${id}`} className="text-sm text-muted hover:text-slate-900 dark:text-slate-100">&larr; Voltar</Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">Editar Imóvel</h1>
      </div>

      <form action={updateProperty.bind(null, imovel.id)} className="space-y-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Título" name="title" value={imovel.title} required />
          <Field label="Tipo" name="type" value={imovel.type} required />
          <Field label="Área (m²)" name="area" value={imovel.area ? String(imovel.area) : ""} />
          <Field label="Quartos" name="bedrooms" value={imovel.bedrooms ? String(imovel.bedrooms) : ""} />
          <Field label="Banheiros" name="bathrooms" value={imovel.bathrooms ? String(imovel.bathrooms) : ""} />
          <Field label="Vagas" name="garageSpots" value={imovel.garageSpots ? String(imovel.garageSpots) : ""} />
        </div>
        <Field label="Endereço" name="address" value={imovel.address} className="w-full" required />
        <Field label="Descrição" name="description" value={imovel.description ?? ""} as="textarea" />
        <ImageUpload coverImage={imovel.coverImage ?? ""} extraImages={imovel.images.map((i) => i.url)} />
        <div className="grid gap-6 sm:grid-cols-3">
          <Field label="Valor venda (R$)" name="salePrice" value={imovel.salePrice ? String(imovel.salePrice) : ""} />
          <Field label="Valor aluguel (R$)" name="rentPrice" value={imovel.rentPrice ? String(imovel.rentPrice) : ""} />
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
            <select id="status" name="status" defaultValue={imovel.status} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light">
              <option>Disponível</option>
              <option>Vendido</option>
              <option>Alugado</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-4 pt-4">
          <button type="submit" className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">Salvar alterações</button>
          <Link href={`/imoveis/${id}`} className="text-sm font-medium text-muted hover:text-slate-900 dark:text-slate-100">Cancelar</Link>
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
