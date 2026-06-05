import { prisma } from "@/lib/prisma";
import { PropertyMap } from "@/components/property-map";

export default async function MapaPage() {
  const properties = await prisma.property.findMany({
    where: { latitude: { not: null }, longitude: { not: null } },
    orderBy: { title: "asc" },
  });

  const markers = properties.map((p) => ({
    id: p.id,
    title: p.title,
    lat: p.latitude!,
    lng: p.longitude!,
    href: `/imoveis/${p.id}`,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Mapa de Imóveis</h1>
        <p className="mt-1 text-sm text-muted">{markers.length} imóveis com localização definida</p>
      </div>

      {markers.length > 0 ? (
        <PropertyMap markers={markers} />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm text-muted">Nenhum imóvel com localização cadastrada. Edite um imóvel para adicionar latitude/longitude.</p>
        </div>
      )}
    </div>
  );
}
