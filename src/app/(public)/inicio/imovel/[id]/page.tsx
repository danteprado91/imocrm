import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getSiteConfigs } from "@/app/actions/site-config";
import { PropertyMap } from "@/components/property-map";
import { ContactForm } from "./contact-form";
import type { Metadata } from "next";

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await props.params;
  const imovel = await prisma.property.findUnique({ where: { id: Number(id) } });
  if (!imovel) return { title: "Imóvel não encontrado" };
  return {
    title: imovel.title,
    description: imovel.description || `${imovel.type} - ${imovel.address}`,
    openGraph: {
      title: imovel.title,
      description: imovel.description ?? undefined,
      images: imovel.coverImage ? [{ url: imovel.coverImage }] : [],
    },
  };
}

export default async function PublicImovelDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const configs = await getSiteConfigs();

  const imovel = await prisma.property.findUnique({
    where: { id: Number(id) },
    include: { images: true },
  });
  if (!imovel) notFound();

  const whatsappLink = configs.social_whatsapp
    ? `https://wa.me/${configs.social_whatsapp}?text=${encodeURIComponent(`Olá! Tenho interesse no imóvel: ${imovel.title} (ID: ${imovel.id})`)}`
    : null;

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/inicio" className="text-xl font-bold tracking-tight">
            {configs.site_logo ? <img src={configs.site_logo} alt={configs.site_name} className="h-8" /> : configs.site_name || "ImoCRM"}
          </Link>
          <nav className="flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/inicio/imoveis" className="hover:text-primary">{configs.menu_imoveis || "Imóveis"}</Link>
            <Link href="/inicio/contato" className="hover:text-primary">{configs.menu_contato || "Contato"}</Link>
            <Link href="/login" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white">Área do Corretor</Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link href="/inicio/imoveis" className="text-sm text-slate-500 hover:text-primary">&larr; Voltar para imóveis</Link>

        <h1 className="mt-4 text-3xl font-bold text-slate-800">{imovel.title}</h1>
        <p className="mt-1 text-slate-500">{imovel.address}</p>

        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="overflow-hidden rounded-2xl lg:col-span-3">
            {imovel.coverImage ? (
              <img src={imovel.coverImage} alt={imovel.title} className="h-80 w-full object-cover lg:h-96" />
            ) : (
              <div className="flex h-80 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 lg:h-96">Sem foto principal</div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
            {imovel.images.slice(0, 3).map((img) => (
              <div key={img.id} className="overflow-hidden rounded-xl">
                <img src={img.url} alt="" className="h-28 w-full object-cover lg:h-28" />
              </div>
            ))}
            {imovel.images.length === 0 && (
              <div className="flex h-28 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-400">Sem fotos extras</div>
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {imovel.area && <InfoCard label="Área" value={`${imovel.area} m²`} />}
              {imovel.bedrooms && <InfoCard label="Quartos" value={String(imovel.bedrooms)} />}
              {imovel.bathrooms && <InfoCard label="Banheiros" value={String(imovel.bathrooms)} />}
              {imovel.garageSpots && <InfoCard label="Vagas" value={String(imovel.garageSpots)} />}
              <InfoCard label="Status" value={imovel.status} />
              <InfoCard label="Cadastro" value={imovel.createdAt.toLocaleDateString("pt-BR")} />
            </div>
            {imovel.description && (
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Descrição</h2>
                <p className="mt-2 leading-relaxed text-slate-600">{imovel.description}</p>
              </div>
            )}
            {imovel.latitude && imovel.longitude && (
              <div>
                <h2 className="mb-3 text-lg font-semibold text-slate-800">Localização</h2>
                <div className="overflow-hidden rounded-2xl">
                  <PropertyMap markers={[{ id: imovel.id, title: imovel.title, lat: imovel.latitude, lng: imovel.longitude, href: "" }]} zoom={15} />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                {imovel.salePrice ? (
                  <div>
                    <p className="text-sm text-slate-500">Valor de venda</p>
                    <p className="text-2xl font-bold text-primary">R$ {(imovel.salePrice / 1000).toFixed(0)}.{imovel.salePrice % 1000 ? String(imovel.salePrice % 1000).padStart(3, "0") : "000"}</p>
                  </div>
                ) : null}
                {imovel.rentPrice ? (
                  <div className={imovel.salePrice ? "mt-3" : ""}>
                    <p className="text-sm text-slate-500">Valor de locação</p>
                    <p className="text-2xl font-bold text-primary">R$ {imovel.rentPrice.toLocaleString("pt-BR")}/mês</p>
                  </div>
                ) : null}
              </div>

              <div className="space-y-3">
                {whatsappLink && (
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-green-700">
                    Fale pelo WhatsApp
                  </a>
                )}
                {configs.contact_phone && (
                  <a href={`tel:${configs.contact_phone}`} className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 px-6 py-3.5 font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary">
                    {configs.contact_phone}
                  </a>
                )}
              </div>

              <div className="rounded-2xl border bg-slate-50 p-6">
                <h3 className="font-semibold text-slate-800">Tenho interesse</h3>
                <p className="mt-1 text-sm text-slate-500">Deixe seus dados que entraremos em contato.</p>
                <ContactForm propertyId={imovel.id} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-16 border-t bg-slate-900 px-6 py-8 text-center text-sm text-slate-500">
        {configs.footer_text || "© 2026 Minha Imobiliária. Todos os direitos reservados."}
      </footer>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase text-slate-400">{label}</p>
      <p className="mt-0.5 text-lg font-semibold text-slate-800">{value}</p>
    </div>
  );
}
