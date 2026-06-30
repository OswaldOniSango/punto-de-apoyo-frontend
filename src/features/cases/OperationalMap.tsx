import type { InspectionCase } from '../../types'

export function OperationalMap({ cases, selectedId, onSelect }: { cases: InspectionCase[]; selectedId: number | null; onSelect: (id: number) => void }) {
  return (
    <div className="map-canvas" aria-label="Mapa de casos por zona">
      <div className="zone zone-a">23 de Enero</div>
      <div className="zone zone-b">La Guaira</div>
      <div className="zone zone-c">El Valle</div>
      <div className="zone zone-d">San Agustin</div>
      {cases.slice(0, 40).map((item, index) => {
        const left = item.longitude ? Math.min(88, Math.max(8, ((Number(item.longitude) + 67.08) / 0.38) * 100)) : 10 + ((index * 17) % 78)
        const top = item.latitude ? Math.min(82, Math.max(12, (1 - ((Number(item.latitude) - 10.36) / 0.28)) * 100)) : 18 + ((index * 23) % 64)
        return <button key={item.id} className={`map-pin ${item.status.toLowerCase()} ${selectedId === item.id ? 'selected' : ''}`} style={{ left: `${left}%`, top: `${top}%` }} onClick={() => onSelect(item.id)} title={item.trackingCode}>{index + 1}</button>
      })}
    </div>
  )
}
