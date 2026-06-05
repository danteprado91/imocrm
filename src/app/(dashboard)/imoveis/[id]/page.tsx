import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { deleteProperty } from "@/app/actions/delete";
import { DeleteButton } from "@/components/delete-button";
import { PropertyMap } from "@/components/property-map";

export default async function ImovelDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const imovel = await prisma.property.findUnique({
    where: { id: Number(id) },
    include: { images: true },
  });
  if (!imovel) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/imoveis" className="text-sm text-muted hover:text-slate-900 dark:text-slate-100">&larr; Voltar</Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{imovel.title}</h1>
      </div>

      {imovel.coverImage && (
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
          <img src={imovel.coverImage} alt={imovel.title} className="h-64 w-full object-cover" />
        </div>
      )}

      {imovel.images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {imovel.images.map((img) => (
            <div key={img.id} className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
              <img src={img.url} alt={imovel.title} className="h-32 w-full object-cover" />
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <Info label="Título" value={imovel.title} />
          <Info label="Tipo" value={imovel.type} />
          {imovel.area && <Info label="Área" value={`${imovel.area} m²`} />}
          {imovel.bedrooms && <Info label="Quartos" value={String(imovel.bedrooms)} />}
          {imovel.bathrooms && <Info label="Banheiros" value={String(imovel.bathrooms)} />}
          {imovel.garageSpots && <Info label="Vagas" value={String(imovel.garageSpots)} />}
          {imovel.salePrice && <Info label="Valor venda" value={`R$ ${(imovel.salePrice / 1000).toFixed(0)}.000`} />}
          {imovel.rentPrice && <Info label="Valor aluguel" value={`R$ ${imovel.rentPrice.toLocaleString("pt-BR")}/mês`} />}
          <Info label="Status" value={imovel.status} />
          <Info label="Data de cadastro" value={imovel.createdAt.toLocaleDateString("pt-BR")} />
        </div>
        <div className="mt-6"><Info label="Endereço" value={imovel.address} /></div>
        {imovel.description && <div className="mt-6"><Info label="Descrição" value={imovel.description} /></div>}
      </div>

      {imovel.latitude && imovel.longitude && (
        <PropertyMap markers={[{ id: imovel.id, title: imovel.title, lat: imovel.latitude, lng: imovel.longitude, href: "" }]} zoom={15} />
      )}

      <div className="flex items-center gap-4">
        <Link href={`/imoveis/${id}/editar`} className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">Editar imóvel</Link>
        <DeleteButton action={deleteProperty.bind(null, imovel.id)} label="este imóvel" />
        <Link href="/imoveis" className="text-sm font-medium text-muted hover:text-slate-900 dark:text-slate-100">Voltar</Link>
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
