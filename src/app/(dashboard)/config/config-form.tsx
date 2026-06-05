"use client";

import { useState } from "react";
import { updateSiteConfigs } from "@/app/actions/site-config";

export function ConfigForm({ configs }: { configs: Record<string, string> }) {
  const [uploading, setUploading] = useState<string | null>(null);

  async function uploadImage(field: string, file: File) {
    setUploading(field);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) {
      const hidden = document.querySelector<HTMLInputElement>(`input[name="${field}"]`);
      if (hidden) hidden.value = data.url;
      const preview = document.querySelector<HTMLImageElement>(`[data-preview="${field}"]`);
      if (preview) preview.src = data.url;
    }
    setUploading(null);
  }

  return (
    <form action={updateSiteConfigs} className="space-y-8">
      {/* Dados da Imobiliária */}
      <Section title="Dados da Imobiliária">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Nome do site" name="site_name" value={configs.site_name} />
          <Field label="E-mail de contato" name="contact_email" value={configs.contact_email} />
          <Field label="Telefone" name="contact_phone" value={configs.contact_phone} />
          <Field label="Endereço" name="contact_address" value={configs.contact_address} />
        </div>
      </Section>

      {/* Logo e Favicon */}
      <Section title="Logo e Favicon">
        <div className="grid gap-6 sm:grid-cols-2">
          <ImageField label="Logo" field="site_logo" value={configs.site_logo} uploading={uploading} onUpload={uploadImage} />
          <ImageField label="Favicon" field="site_favicon" value={configs.site_favicon} uploading={uploading} onUpload={uploadImage} />
        </div>
      </Section>

      {/* Hero */}
      <Section title="Banner Principal (Hero)">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Título" name="hero_title" value={configs.hero_title} />
          <Field label="Subtítulo" name="hero_subtitle" value={configs.hero_subtitle} />
        </div>
        <ImageField label="Imagem de fundo" field="hero_image" value={configs.hero_image} uploading={uploading} onUpload={uploadImage} />
      </Section>

      {/* Seção Sobre */}
      <Section title="Seção Sobre Nós">
        <Field label="Título" name="about_title" value={configs.about_title} />
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Texto</label>
          <textarea
            name="about_text"
            defaultValue={configs.about_text}
            rows={4}
            className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
          />
        </div>
        <ImageField label="Imagem" field="about_image" value={configs.about_image} uploading={uploading} onUpload={uploadImage} />
      </Section>

      {/* Redes Sociais */}
      <Section title="Redes Sociais">
        <div className="grid gap-6 sm:grid-cols-3">
          <Field label="Instagram" name="social_instagram" value={configs.social_instagram} />
          <Field label="Facebook" name="social_facebook" value={configs.social_facebook} />
          <Field label="WhatsApp" name="social_whatsapp" value={configs.social_whatsapp} />
        </div>
      </Section>

      {/* Menu */}
      <Section title="Menu de Navegação">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Link Imóveis" name="menu_imoveis" value={configs.menu_imoveis} />
          <Field label="Link Contato" name="menu_contato" value={configs.menu_contato} />
        </div>
      </Section>

      {/* Footer */}
      <Section title="Rodapé">
        <Field label="Texto do rodapé" name="footer_text" value={configs.footer_text} />
      </Section>

      <div className="pb-8">
        <button
          type="submit"
          className="rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Salvar configurações
        </button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, name, value }: { label: string; name: string; value?: string }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <input
        id={name}
        name={name}
        type="text"
        defaultValue={value ?? ""}
        className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
      />
    </div>
  );
}

function ImageField({ label, field, value, uploading, onUpload }: { label: string; field: string; value?: string; uploading: string | null; onUpload: (field: string, file: File) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <input type="hidden" name={field} defaultValue={value ?? ""} />
      {value && (
        <img data-preview={field} src={value} alt="" className="mt-2 h-24 rounded-lg border object-cover" />
      )}
      <input
        type="file"
        accept="image/*"
        disabled={uploading === field}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(field, file);
        }}
        className="mt-2 block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
      />
      {uploading === field && <p className="mt-1 text-xs text-primary">Enviando...</p>}
    </div>
  );
}
