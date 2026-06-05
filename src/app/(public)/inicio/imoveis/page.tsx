import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSiteConfigs } from "@/app/actions/site-config";
import { PropertyCard } from "@/components/property-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Imóveis",
  description: "Confira nossa lista completa de imóveis disponíveis para venda e locação.",
};

export default async function PublicImoveisPage(props: {
  searchParams: Promise<{
    tipo?: string; quartos?: string; status?: string; busca?: string;
    preco_min?: string; preco_max?: string; area_min?: string; area_max?: string;
    bairro?: string; ordenar?: string;
  }>;
}) {
  const sp = await props.searchParams;
  const configs = await getSiteConfigs();

  const where: Record<string, unknown> = {};

  if (sp.tipo) where.type = sp.tipo;
  if (sp.status) where.status = sp.status;
  if (sp.quartos) where.bedrooms = { gte: Number(sp.quartos) };

  const AND: Record<string, unknown>[] = [];

  if (sp.preco_min) {
    const v = Number(sp.preco_min);
    AND.push({ OR: [{ salePrice: { gte: v } }, { rentPrice: { gte: v } }] });
  }
  if (sp.preco_max) {
    const v = Number(sp.preco_max);
    AND.push({ OR: [{ salePrice: { lte: v } }, { rentPrice: { lte: v } }] });
  }
  if (sp.area_min) AND.push({ area: { gte: Number(sp.area_min) } });
  if (sp.area_max) AND.push({ area: { lte: Number(sp.area_max) } });

  if (sp.bairro) {
    AND.push({
      OR: [
        { address: { contains: sp.bairro } },
        ...(sp.busca ? [] : [{ title: { contains: sp.bairro } }]),
      ],
    });
  }

  if (sp.busca) {
    AND.push({
      OR: [
        { title: { contains: sp.busca } },
        { address: { contains: sp.busca } },
        ...(sp.bairro ? [] : [{ address: { contains: sp.busca } }]),
      ],
    });
  }

  if (AND.length > 0) where.AND = AND;

  const orderBy: Record<string, string> =
    sp.ordenar === "preco_asc" ? { salePrice: "asc" } :
    sp.ordenar === "preco_desc" ? { salePrice: "desc" } :
    sp.ordenar === "area_asc" ? { area: "asc" } :
    sp.ordenar === "area_desc" ? { area: "desc" } :
    sp.ordenar === "data_asc" ? { createdAt: "asc" } :
    { createdAt: "desc" };

  const properties = await prisma.property.findMany({
    where: where as any,
    orderBy,
    include: { images: true },
  });

  const tipos = [...new Set(
    (await prisma.property.findMany({ select: { type: true }, distinct: ["type"] })).map((p) => p.type)
  )];

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/inicio" className="text-xl font-bold tracking-tight">
            {configs.site_logo ? <img src={configs.site_logo} alt={configs.site_name} className="h-8" /> : configs.site_name || "ImoCRM"}
          </Link>
          <nav className="flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/inicio/imoveis" className="text-primary">{configs.menu_imoveis || "Imóveis"}</Link>
            <Link href="/inicio/contato" className="hover:text-primary">{configs.menu_contato || "Contato"}</Link>
            <Link href="/login" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90">Área do Corretor</Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-800">Imóveis</h1>

        <form method="GET" className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          {/* Primeira linha: busca + bairro + ordenar */}
          <div className="flex flex-wrap gap-3">
            <input name="busca" defaultValue={sp.busca ?? ""} placeholder="Palavra-chave..." className="min-w-[180px] flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light" />
            <input name="bairro" defaultValue={sp.bairro ?? ""} placeholder="Bairro ou cidade..." className="min-w-[160px] flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light" />
            <select name="ordenar" defaultValue={sp.ordenar ?? ""} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-primary">
              <option value="">Mais recentes</option>
              <option value="preco_asc">Menor preço</option>
              <option value="preco_desc">Maior preço</option>
              <option value="area_desc">Maior área</option>
              <option value="area_asc">Menor área</option>
              <option value="data_asc">Mais antigos</option>
            </select>
          </div>

          {/* Segunda linha: filtros específicos */}
          <div className="flex flex-wrap items-end gap-3">
            <select name="tipo" defaultValue={sp.tipo ?? ""} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-primary">
              <option value="">Todos os tipos</option>
              {tipos.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select name="quartos" defaultValue={sp.quartos ?? ""} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-primary">
              <option value="">Qualquer quarto</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
            <select name="status" defaultValue={sp.status ?? ""} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-primary">
              <option value="">Todos os status</option>
              <option value="Disponível">Disponível</option>
              <option value="Vendido">Vendido</option>
              <option value="Alugado">Alugado</option>
            </select>
            <div className="flex items-center gap-2">
              <input name="preco_min" defaultValue={sp.preco_min ?? ""} placeholder="Preço mín." type="number" className="w-28 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-primary" />
              <span className="text-slate-400">—</span>
              <input name="preco_max" defaultValue={sp.preco_max ?? ""} placeholder="Preço máx." type="number" className="w-28 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-primary" />
            </div>
            <div className="flex items-center gap-2">
              <input name="area_min" defaultValue={sp.area_min ?? ""} placeholder="Área mín." type="number" className="w-24 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-primary" />
              <span className="text-slate-400">—</span>
              <input name="area_max" defaultValue={sp.area_max ?? ""} placeholder="Área máx." type="number" className="w-24 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-primary" />
            </div>
            <button className="rounded-lg bg-primary px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90">
              Buscar
            </button>
          </div>
        </form>

        <p className="mt-4 text-sm text-slate-400">
          {properties.length} imóvel{properties.length !== 1 ? "is" : ""} encontrado{properties.length !== 1 ? "s" : ""}
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard
              key={p.id}
              href={`/inicio/imovel/${p.id}`}
              title={p.title}
              address={p.address}
              coverImage={p.coverImage}
              images={p.images}
              area={p.area}
              bedrooms={p.bedrooms}
              bathrooms={p.bathrooms}
              salePrice={p.salePrice ?? undefined}
              rentPrice={p.rentPrice ?? undefined}
            />
          ))}
        </div>
        {properties.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-lg text-slate-400">Nenhum imóvel encontrado com esses filtros.</p>
            <Link href="/inicio/imoveis" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">Limpar filtros</Link>
          </div>
        )}
      </div>

      <footer className="border-t bg-slate-900 px-6 py-8 text-center text-sm text-slate-500">
        {configs.footer_text || "© 2026 Minha Imobiliária. Todos os direitos reservados."}
      </footer>
    </div>
  );
}
