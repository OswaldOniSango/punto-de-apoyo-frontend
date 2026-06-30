import { useState } from 'react'
import type { FormEvent } from 'react'
import { publicCasesApi } from '../../api'
import { CaseSummaryCard } from '../../components/CaseSummaryCard'
import { NoticeBox } from '../../components/NoticeBox'
import { getErrorMessage } from '../../shared/errors'
import { normalizePhone } from '../../shared/formUtils'
import type { Notice } from '../../shared/viewTypes'
import type { InspectionCase } from '../../types'

export function PublicStatusPanel() {
  const [trackingCode, setTrackingCode] = useState('')
  const [phone, setPhone] = useState('')
  const [result, setResult] = useState<InspectionCase | null>(null)
  const [notice, setNotice] = useState<Notice>(null)
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setNotice(null)
    setResult(null)
    try {
      const data = await publicCasesApi.status(trackingCode, normalizePhone(phone))
      setResult(data)
    } catch (error) {
      setNotice({ type: 'error', text: getErrorMessage(error) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="panel compact-panel">
      <span className="section-kicker">Seguimiento</span>
      <h3>Consulta de reportes</h3>
      <form onSubmit={submit} className="search-row">
        <input value={trackingCode} onChange={(event) => setTrackingCode(event.target.value)} placeholder="Codigo VZ-2026-00000001" required />
        <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Telefono" required />
        <button disabled={loading}>{loading ? 'Buscando...' : 'Buscar'}</button>
      </form>
      <NoticeBox notice={notice} />
      {result && <CaseSummaryCard item={result} />}
    </section>
  )
}
