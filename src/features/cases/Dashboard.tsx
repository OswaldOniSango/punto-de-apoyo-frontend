import { useEffect, useMemo, useState } from 'react'
import { casesApi } from '../../api'
import { Metric } from '../../components/Metric'
import { NoticeBox } from '../../components/NoticeBox'
import { priorities, statuses } from '../../shared/constants'
import { getErrorMessage } from '../../shared/errors'
import { formatDate, priorityLabel, statusLabel } from '../../shared/formatters'
import type { Notice, View } from '../../shared/viewTypes'
import type { AuthenticatedUser, InspectionCase } from '../../types'
import { CaseDetailPanel } from './CaseDetailPanel'
import { OperationalMap } from './OperationalMap'

export function Dashboard({ token, user, setView }: { token: string; user: AuthenticatedUser | null; setView: (view: View) => void }) {
  const [cases, setCases] = useState<InspectionCase[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [filters, setFilters] = useState({ trackingCode: '', status: '', city: '', priority: '', createdDate: '' })
  const [notice, setNotice] = useState<Notice>(null)
  const [loading, setLoading] = useState(false)

  const selected = cases.find((item) => item.id === selectedId) ?? cases[0] ?? null
  const metrics = useMemo(() => buildMetrics(cases), [cases])

  async function load() {
    setLoading(true)
    setNotice(null)
    try {
      const data = await casesApi.search(token, filters as any)
      setCases(data)
      if (!selectedId && data[0]) setSelectedId(data[0].id)
    } catch (error) {
      setNotice({ type: 'error', text: getErrorMessage(error) })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function replaceCase(updated: InspectionCase) {
    setCases((items) => items.map((item) => item.id === updated.id ? updated : item))
    setSelectedId(updated.id)
  }

  return (
    <div className="dashboard-grid">
      <section className="metrics-row">
        <Metric title="Pendientes" value={metrics.PENDIENTE} tone="orange" />
        <Metric title="Asignados" value={metrics.ASIGNADO} tone="blue" />
        <Metric title="En proceso" value={metrics.EN_PROCESO} tone="teal" />
        <Metric title="Inspeccionados" value={metrics.INSPECCIONADO} tone="green" />
        <Metric title="Cerrados" value={metrics.CERRADO} tone="gray" />
        <Metric title="Criticos" value={cases.filter((item) => item.priority === 'URGENT').length} tone="red" />
      </section>

      <section className="panel map-panel">
        <div className="panel-head">
          <h3>Mapa de casos por zona</h3>
          <button className="secondary" onClick={load}>{loading ? 'Actualizando...' : 'Actualizar'}</button>
        </div>
        <form className="filters" onSubmit={(event) => { event.preventDefault(); load() }}>
          <input placeholder="Codigo" value={filters.trackingCode} onChange={(event) => setFilters({ ...filters, trackingCode: event.target.value })} />
          <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
            <option value="">Todos los estados</option>{statuses.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}
          </select>
          <input placeholder="Ciudad" value={filters.city} onChange={(event) => setFilters({ ...filters, city: event.target.value })} />
          <select value={filters.priority} onChange={(event) => setFilters({ ...filters, priority: event.target.value })}>
            <option value="">Todas las prioridades</option>{priorities.map((priority) => <option key={priority} value={priority}>{priorityLabel(priority)}</option>)}
          </select>
          <input type="date" value={filters.createdDate} onChange={(event) => setFilters({ ...filters, createdDate: event.target.value })} />
          <button>Filtrar</button>
        </form>
        <OperationalMap cases={cases} selectedId={selected?.id ?? null} onSelect={setSelectedId} />
        <NoticeBox notice={notice} />
      </section>

      <section className="panel cases-panel">
        <div className="panel-head">
          <h3>Casos</h3>
          <button onClick={() => setView('public-create')}>Nuevo</button>
        </div>
        <div className="case-list">
          {cases.map((item) => (
            <button key={item.id} className={selected?.id === item.id ? 'case-row active' : 'case-row'} onClick={() => setSelectedId(item.id)}>
              <span><strong>{item.trackingCode}</strong><small>{item.city || 'Sin ciudad'} · {formatDate(item.createdAt)}</small></span>
              <span className={`status-chip ${item.status.toLowerCase()}`}>{statusLabel(item.status)}</span>
            </button>
          ))}
          {!cases.length && <p className="empty">No hay casos para estos filtros.</p>}
        </div>
      </section>

      <CaseDetailPanel token={token} user={user} selected={selected} onUpdated={replaceCase} onRefresh={load} />
    </div>
  )
}

function buildMetrics(cases: InspectionCase[]) {
  return statuses.reduce((acc, status) => {
    acc[status] = cases.filter((item) => item.status === status).length
    return acc
  }, {} as Record<string, number>)
}
