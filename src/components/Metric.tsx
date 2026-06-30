export function Metric({ title, value, tone }: { title: string; value: number; tone: string }) {
  return <article className={`metric ${tone}`}><span>{title}</span><strong>{value}</strong></article>
}
