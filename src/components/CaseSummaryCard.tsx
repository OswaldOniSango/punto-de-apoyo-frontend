import { assetUrl } from '../api'
import { formatDateOnly, priorityLabel, statusLabel } from '../shared/formatters'
import type { InspectionCase } from '../types'

export function CaseSummaryCard({ item }: { item: InspectionCase }) {
  const location = [item.city, item.stateRegion].filter(Boolean).join(', ') || 'Ubicacion no registrada'
  const photos = item.photos ?? []

  return (
    <article className="summary-card">
      <div className="summary-card-header">
        <div>
          <span className="summary-eyebrow">Codigo de seguimiento</span>
          <strong>{item.trackingCode}</strong>
        </div>
        <div className="summary-badges">
          <span className="summary-badge-group">
            <span>Prioridad</span>
            <span className={`priority ${item.priority.toLowerCase()}`}>{priorityLabel(item.priority)}</span>
          </span>
          <span className="summary-badge-group">
            <span>Estado</span>
            <span className={`status-chip ${item.status.toLowerCase()}`}>{statusLabel(item.status)}</span>
          </span>
        </div>
      </div>

      <div className="summary-content">
        <section className="summary-main">
          <h4>{item.address}</h4>
          <p>{item.description}</p>
        </section>

        <dl className="summary-details">
          <div><dt>Solicitante</dt><dd>{item.applicantName}</dd></div>
          <div><dt>Telefono</dt><dd>{item.applicantPhone}</dd></div>
          <div><dt>Zona</dt><dd>{location}</dd></div>
          <div><dt>Actualizado</dt><dd>{formatDateOnly(item.updatedAt)}</dd></div>
        </dl>
      </div>

      <div className="summary-footer">
        <div>
          <span className="summary-eyebrow">Evidencias</span>
          <strong>{photos.length} foto{photos.length === 1 ? '' : 's'}</strong>
        </div>
        {photos.length ? (
          <div className="summary-photos">
            {photos.slice(0, 4).map((photo) => (
              <a key={photo.id} href={assetUrl(photo.fileUrl)} target="_blank">
                <img src={assetUrl(photo.fileUrl)} alt={photo.fileName} />
              </a>
            ))}
          </div>
        ) : <span className="summary-empty">Sin fotos registradas</span>}
      </div>
    </article>
  )
}
