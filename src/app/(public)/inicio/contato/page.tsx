import Link from "next/link";
import { getSiteConfigs } from "@/app/actions/site-config";
import { ContactPageForm } from "./contact-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato",
  description: "Entre em contato com nossa imobiliária. Estamos prontos para atender você.",
};

export default async function ContatoPage() {
  const configs = await getSiteConfigs();

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/inicio" className="text-xl font-bold tracking-tight">
            {configs.site_logo ? <img src={configs.site_logo} alt={configs.site_name} className="h-8" /> : configs.site_name || "ImoCRM"}
          </Link>
          <nav className="flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/inicio/imoveis" className="hover:text-primary">{configs.menu_imoveis || "Imóveis"}</Link>
            <Link href="/inicio/contato" className="text-primary">{configs.menu_contato || "Contato"}</Link>
            <Link href="/login" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white">Área do Corretor</Link>
          </nav>
        </div>
      </header>

      <section className="bg-gradient-to-br from-slate-900 to-slate-700 px-6 py-20 text-center text-white">
        <h1 className="text-4xl font-bold">Fale Conosco</h1>
        <p className="mx-auto mt-3 max-w-lg text-slate-300">Estamos prontos para atender você.</p>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Informações de Contato</h2>
            <div className="mt-6 space-y-4">
              {configs.contact_address && <ContactInfo label="Endereço" value={configs.contact_address} />}
              {configs.contact_phone && <ContactInfo label="Telefone" value={configs.contact_phone} />}
              {configs.contact_email && <ContactInfo label="E-mail" value={configs.contact_email} />}
            </div>
            <div className="mt-8 flex gap-4">
              {configs.social_instagram && <a href={configs.social_instagram} target="_blank" rel="noopener noreferrer" className="rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-slate-100">Instagram</a>}
              {configs.social_facebook && <a href={configs.social_facebook} target="_blank" rel="noopener noreferrer" className="rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-slate-100">Facebook</a>}
              {configs.social_whatsapp && <a href={`https://wa.me/${configs.social_whatsapp}`} target="_blank" rel="noopener noreferrer" className="rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-slate-100">WhatsApp</a>}
            </div>
          </div>
          <div className="rounded-2xl border bg-slate-50 p-8">
            <h2 className="text-xl font-bold text-slate-800">Envie sua mensagem</h2>
            <ContactPageForm />
          </div>
        </div>
      </div>

      <footer className="border-t bg-slate-900 px-6 py-8 text-center text-sm text-slate-500">
        {configs.footer_text || "© 2026 Minha Imobiliária. Todos os direitos reservados."}
      </footer>
    </div>
  );
}

function ContactInfo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="text-slate-800">{value}</p>
    </div>
  );
}
