import { useEffect, useState } from 'react'
import { assetUrl, casesApi, usersApi } from '../../api'
import { Info } from '../../components/Info'
import { NoticeBox } from '../../components/NoticeBox'
import { editableStatuses, risks } from '../../shared/constants'
import { getErrorMessage } from '../../shared/errors'
import { priorityLabel, statusLabel } from '../../shared/formatters'
import { canAssign, canDownloadReport, canWorkCase } from '../../shared/permissions'
import type { Notice } from '../../shared/viewTypes'
import type { AuthenticatedUser, CaseStatus, InspectionCase, InternalUser, StructuralRisk } from '../../types'

export function CaseDetailPanel({ token, user, selected, onUpdated, onRefresh }: { token: string; user: AuthenticatedUser | null; selected: InspectionCase | null; onUpdated: (item: InspectionCase) => void; onRefresh: () => void }) {
  const [engineers, setEngineers] = useState<InternalUser[]>([])
  const [engineerIds, setEngineerIds] = useState<number[]>([])
  const [status, setStatus] = useState<CaseStatus>('EN_PROCESO')
  const [notice, setNotice] = useState<Notice>(null)
  const [photos, setPhotos] = useState<File[]>([])
  const [observationPhotos, setObservationPhotos] = useState<File[]>([])

  useEffect(() => {
    if (!canAssign(user)) return
    usersApi.engineers(token).then(setEngineers).catch(() => undefined)
  }, [token, user])

  useEffect(() => {
    setEngineerIds([])
    setNotice(null)
  }, [selected?.id])

  if (!selected) {
    return <section className="panel detail-panel"><p className="empty">Selecciona un caso para ver direccion, fotos, asignaciones y acciones disponibles.</p></section>
  }

  async function run(action: () => Promise<InspectionCase | unknown>, success: string) {
    setNotice(null)
    try {
      const result = await action()
      if (result && typeof result === 'object' && 'trackingCode' in result) onUpdated(result as InspectionCase)
      setNotice({ type: 'success', text: success })
      onRefresh()
    } catch (error) {
      setNotice({ type: 'error', text: getErrorMessage(error) })
    }
  }

  return (
    <section className="panel detail-panel">
      <div className="panel-head">
        <div><h3>{selected.trackingCode}</h3><p>{selected.address}</p></div>
        <span className={`priority ${selected.priority.toLowerCase()}`}>{priorityLabel(selected.priority)}</span>
      </div>
      <div className="detail-grid">
        <Info label="Solicitante" value={selected.applicantName} />
        <Info label="Telefono" value={selected.applicantPhone} />
        <Info label="Ubicacion" value={`${selected.city || '-'}, ${selected.stateRegion || '-'}`} />
        <Info label="Estado" value={statusLabel(selected.status)} />
      </div>
      <p className="description">{selected.description}</p>

      <div className="photo-strip">
        {(selected.photos ?? []).slice(0, 6).map((photo) => <a key={photo.id} href={assetUrl(photo.fileUrl)} target="_blank"><img src={assetUrl(photo.fileUrl)} alt={photo.fileName} /></a>)}
        {!selected.photos?.length && <span className="empty">Sin fotos registradas</span>}
      </div>

      {canAssign(user) && (
        <div className="action-block">
          <h4>Asignar ingenieros</h4>
          <select multiple value={engineerIds.map(String)} onChange={(event) => setEngineerIds(Array.from(event.currentTarget.selectedOptions).map((option) => Number(option.value)))}>
            {engineers.map((engineer) => <option key={engineer.id} value={engineer.id}>{engineer.firstName} {engineer.lastName} · {engineer.email}</option>)}
          </select>
          <button onClick={() => run(() => casesApi.assign(token, selected.id, engineerIds), 'Ingenieros asignados')} disabled={!engineerIds.length}>Asignar seleccionados</button>
          <div className="assignments">
            {selected.assignments?.map((assignment) => <span key={assignment.id}>{assignment.engineerFirstName} {assignment.engineerLastName}<button onClick={() => run(() => casesApi.unassign(token, selected.id, assignment.engineerId), 'Asignacion eliminada')}>Quitar</button></span>)}
          </div>
        </div>
      )}

      {canDownloadReport(user) && (
        <div className="action-block report-actions">
          <h4>Reporte de inspeccion</h4>
          <p className="action-hint">Genera el PDF con datos de vivienda, ubicacion, fotos, observaciones y responsable.</p>
          <button className="secondary" onClick={() => casesApi.downloadReport(token, selected.id)}>Descargar PDF</button>
        </div>
      )}

      {canWorkCase(user) && (
        <div className="action-block compact-actions">
          <h4>Gestion tecnica</h4>
          <select value={status} onChange={(event) => setStatus(event.target.value as CaseStatus)}>{editableStatuses.map((item) => <option key={item} value={item}>{statusLabel(item)}</option>)}</select>
          <button onClick={() => run(() => casesApi.updateStatus(token, selected.id, status), 'Estado actualizado')}>Actualizar estado</button>
        </div>
      )}

      {canWorkCase(user) && (
        <form className="action-block" onSubmit={(event) => {
          event.preventDefault()
          const data = new FormData(event.currentTarget)
          run(() => casesApi.createObservation(token, selected.id, {
            observations: String(data.get('observations') || ''),
            recommendations: String(data.get('recommendations') || ''),
            structuralRisk: String(data.get('structuralRisk') || 'MEDIUM') as StructuralRisk,
          }, observationPhotos), 'Observacion registrada')
          event.currentTarget.reset()
          setObservationPhotos([])
        }}>
          <h4>Observacion tecnica</h4>
          <textarea name="observations" placeholder="Observaciones" required />
          <textarea name="recommendations" placeholder="Recomendaciones" required />
          <select name="structuralRisk" required>{risks.map((risk) => <option key={risk} value={risk}>{risk}</option>)}</select>
          <input type="file" accept="image/*" multiple onChange={(event) => setObservationPhotos(Array.from(event.target.files ?? []).slice(0, 10))} />
          <button>Registrar observacion</button>
        </form>
      )}

      {canWorkCase(user) && (
        <div className="action-block compact-actions">
          <h4>Agregar fotos</h4>
          <input type="file" accept="image/*" multiple onChange={(event) => setPhotos(Array.from(event.target.files ?? []).slice(0, 10))} />
          <button disabled={!photos.length} onClick={() => run(() => casesApi.addPhotos(token, selected.id, photos), 'Fotos agregadas')}>Subir fotos</button>
        </div>
      )}
      <NoticeBox notice={notice} />
    </section>
  )
}
