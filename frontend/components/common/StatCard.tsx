export default function StatCard({
  label,
  value,
  hint,
  valueClassName = "",
}: {
  label: string;
  value: string | number;
  hint?: string;
  valueClassName?: string;
}) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[10px] px-5 py-4">
      <div className="text-[13px] text-[var(--text-muted)] mb-1.5">{label}</div>
      <div className={`text-[26px] font-bold text-[var(--navy)] ${valueClassName}`}>
        {value}
      </div>
      {hint && <div className="text-xs text-[var(--text-muted)] mt-1">{hint}</div>}
    </div>
  );
}
