export function Info({ label, value }: { label: string; value?: string | number | null }) {
  return <div className="info"><small>{label}</small><strong>{value || '-'}</strong></div>
}
