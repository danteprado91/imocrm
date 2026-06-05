import { getSiteConfigs } from "@/app/actions/site-config";
import { ConfigForm } from "./config-form";

export default async function ConfigPage() {
  const configs = await getSiteConfigs();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Configurações do Site</h1>
        <p className="mt-1 text-sm text-muted">Personalize a aparência e o conteúdo do site público</p>
      </div>

      <ConfigForm configs={configs} />
    </div>
  );
}
