import { getLeads } from "@/app/actions/lead";

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Leads</h1>
        <p className="mt-1 text-sm text-muted">Contatos recebidos pelo site público</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Nome</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">E-mail</th>
              <th className="hidden px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300 sm:table-cell">Telefone</th>
              <th className="hidden px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300 lg:table-cell">Mensagem</th>
              <th className="hidden px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300 md:table-cell">Data</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-slate-100 dark:border-slate-700 last:border-0">
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{lead.name}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{lead.email}</td>
                <td className="hidden px-4 py-3 text-slate-600 dark:text-slate-300 sm:table-cell">{lead.phone || "-"}</td>
                <td className="hidden max-w-xs truncate px-4 py-3 text-slate-600 dark:text-slate-300 lg:table-cell">{lead.message || "-"}</td>
                <td className="hidden px-4 py-3 text-slate-500 dark:text-slate-400 md:table-cell">{lead.createdAt.toLocaleDateString("pt-BR")}</td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">Nenhum lead recebido ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
