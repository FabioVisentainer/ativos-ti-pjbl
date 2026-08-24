export default function StatCard({ label, value }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[10px] px-5 py-4">
      <div className="text-[13px] text-[var(--text-muted)] mb-1.5">{label}</div>
      <div className="text-[26px] font-bold text-[var(--navy)]">{value}</div>
    </div>
  );
}
