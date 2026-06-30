import type { InspectionCase } from '../types'
import { formatDate, statusLabel } from '../shared/formatters'

export function CaseSummaryCard({ item }: { item: InspectionCase }) {
  return (
    <article className="summary-card">
      <div><strong>{item.trackingCode}</strong><span className={`status-chip ${item.status.toLowerCase()}`}>{statusLabel(item.status)}</span></div>
      <p>{item.address}</p>
      <small>{item.city}, {item.stateRegion} · {formatDate(item.createdAt)}</small>
      <p>{item.description}</p>
    </article>
  )
}
