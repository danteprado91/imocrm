import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSiteConfigs } from "@/app/actions/site-config";
import { PropertyCard } from "@/components/property-card";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const configs = await getSiteConfigs();
  return {
    title: configs.site_name || "ImoCRM",
    description: configs.hero_subtitle || "Encontre o imóvel perfeito para você",
    openGraph: {
      title: configs.site_name || "ImoCRM",
      description: configs.hero_subtitle || "",
      images: configs.hero_image ? [{ url: configs.hero_image }] : [],
    },
  };
}

export default async function LandingPage() {
  const configs = await getSiteConfigs();
  const properties = await prisma.property.findMany({
    where: { status: { not: "Alugado" } },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: { images: true },
  });

  const heroBg = configs.hero_image || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80";
  const logo = configs.site_logo || configs.site_name || "ImoCRM";

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/inicio" className="text-xl font-bold tracking-tight">
            {configs.site_logo ? (
              <img src={configs.site_logo} alt={configs.site_name} className="h-8" />
            ) : (
              configs.site_name || "ImoCRM"
            )}
          </Link>
          <nav className="flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/inicio/imoveis" className="hover:text-primary">{configs.menu_imoveis || "Imóveis"}</Link>
            <Link href="/inicio/contato" className="hover:text-primary">{configs.menu_contato || "Contato"}</Link>
            <Link href="/login" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90">
              Área do Corretor
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/50" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center text-white">
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {configs.hero_title || "Encontre o imóvel perfeito para você"}
          </h1>
          <p className="mt-4 text-lg text-slate-200 sm:text-xl">
            {configs.hero_subtitle || "Casas, apartamentos e salas comerciais nas melhores regiões"}
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/inicio/imoveis"
              className="rounded-lg bg-primary px-10 py-4 text-base font-semibold text-white transition-transform hover:scale-105"
            >
              Ver Imóveis
            </Link>
            <Link
              href="/inicio/contato"
              className="rounded-lg border border-white/30 px-10 py-4 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              Fale Conosco
            </Link>
          </div>
        </div>
      </section>

      {/* Destaques */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slate-800">Imóveis em Destaque</h2>
          <p className="mt-2 text-slate-500">Confira nossa seleção especial para você</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
          <p className="text-center text-slate-400">Nenhum imóvel disponível no momento.</p>
        )}
        <div className="mt-10 text-center">
          <Link
            href="/imoveis"
            className="inline-block rounded-lg border-2 border-primary px-10 py-3 font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            Ver Todos os Imóveis
          </Link>
        </div>
      </section>

      {/* Sobre */}
      {configs.about_title && (
        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">{configs.about_title}</h2>
                <p className="mt-4 text-lg leading-relaxed text-slate-600">{configs.about_text}</p>
                <Link
                  href="/inicio/contato"
                  className="mt-6 inline-block rounded-lg bg-primary px-8 py-3 font-semibold text-white transition-colors hover:opacity-90"
                >
                  Entre em Contato
                </Link>
              </div>
              {configs.about_image && (
                <div className="overflow-hidden rounded-2xl">
                  <img src={configs.about_image} alt="" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t bg-slate-900 px-6 py-12 text-slate-400">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <h4 className="mb-3 font-semibold text-white">{configs.site_name || "ImoCRM"}</h4>
              {configs.contact_address && <p className="text-sm">{configs.contact_address}</p>}
              {configs.contact_phone && <p className="mt-1 text-sm">{configs.contact_phone}</p>}
              {configs.contact_email && <p className="mt-1 text-sm">{configs.contact_email}</p>}
            </div>
            <div>
              <h4 className="mb-3 font-semibold text-white">Navegação</h4>
              <div className="space-y-2 text-sm">
                <Link href="/imoveis" className="block hover:text-white">{configs.menu_imoveis || "Imóveis"}</Link>
                <Link href="/contato" className="block hover:text-white">{configs.menu_contato || "Contato"}</Link>
              </div>
            </div>
            <div>
              <h4 className="mb-3 font-semibold text-white">Redes Sociais</h4>
              <div className="space-y-2 text-sm">
                {configs.social_instagram && <a href={configs.social_instagram} target="_blank" rel="noopener noreferrer" className="block hover:text-white">Instagram</a>}
                {configs.social_facebook && <a href={configs.social_facebook} target="_blank" rel="noopener noreferrer" className="block hover:text-white">Facebook</a>}
                {configs.social_whatsapp && <a href={`https://wa.me/${configs.social_whatsapp}`} target="_blank" rel="noopener noreferrer" className="block hover:text-white">WhatsApp</a>}
              </div>
            </div>
          </div>
          <div className="mt-10 border-t border-slate-700 pt-6 text-center text-sm">
            {configs.footer_text || "© 2026 Minha Imobiliária. Todos os direitos reservados."}
          </div>
        </div>
      </footer>
    </div>
  );
}

