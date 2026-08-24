const STYLES = {
  "Em uso": "bg-[#e7f5ff] text-[var(--blue)]",
  "Em estoque": "bg-[#ebfbee] text-[var(--success)]",
  "Em manutenção": "bg-[#fff9db] text-[var(--warning)]",
  Baixado: "bg-[#fff5f5] text-[var(--danger)]",
};

export default function StatusBadge({ status }) {
  const style = STYLES[status] || "bg-gray-100 text-gray-600";
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${style}`}
    >
      {status}
    </span>
  );
}
