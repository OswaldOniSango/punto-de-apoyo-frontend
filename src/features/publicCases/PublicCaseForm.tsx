import { useState } from 'react'
import type { FormEvent } from 'react'
import { publicCasesApi } from '../../api'
import { NoticeBox } from '../../components/NoticeBox'
import { priorities } from '../../shared/constants'
import { getErrorMessage } from '../../shared/errors'
import { emptyToNull, normalizePhone, optionalNumber } from '../../shared/formUtils'
import { priorityLabel } from '../../shared/formatters'
import type { Notice } from '../../shared/viewTypes'

export function PublicCaseForm() {
  const [notice, setNotice] = useState<Notice>(null)
  const [loading, setLoading] = useState(false)
  const [photos, setPhotos] = useState<File[]>([])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const payload = {
      applicantName: String(form.get('applicantName') || ''),
      applicantPhone: normalizePhone(String(form.get('applicantPhone') || '')),
      applicantEmail: emptyToNull(form.get('applicantEmail')),
      address: String(form.get('address') || ''),
      city: String(form.get('city') || ''),
      stateRegion: String(form.get('stateRegion') || ''),
      description: String(form.get('description') || ''),
      latitude: optionalNumber(form.get('latitude')),
      longitude: optionalNumber(form.get('longitude')),
      priority: String(form.get('priority') || 'MEDIUM'),
    }
    setLoading(true)
    setNotice(null)
    try {
      const created = await publicCasesApi.create(payload, photos)
      setNotice({ type: 'success', text: `Caso creado: ${created.trackingCode}` })
      event.currentTarget.reset()
      setPhotos([])
    } catch (error) {
      setNotice({ type: 'error', text: getErrorMessage(error) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="panel public-form">
      <span className="section-kicker">Reporte ciudadano</span>
      <h3>Nuevo caso de vivienda afectada</h3>
      <form onSubmit={submit} className="case-form">
        <label>Nombre completo<input name="applicantName" required maxLength={150} /></label>
        <label>Telefono<input name="applicantPhone" required placeholder="+58 412 555-1212" /></label>
        <label>Email<input name="applicantEmail" type="email" maxLength={180} /></label>
        <label>Prioridad<select name="priority" required>{priorities.map((priority) => <option key={priority} value={priority}>{priorityLabel(priority)}</option>)}</select></label>
        <label className="span-2">Direccion<input name="address" required maxLength={255} /></label>
        <label>Ciudad<input name="city" defaultValue="Caracas" maxLength={120} /></label>
        <label>Estado / region<input name="stateRegion" defaultValue="Distrito Capital" maxLength={120} /></label>
        <label>Latitud<input name="latitude" type="number" step="0.0000001" /></label>
        <label>Longitud<input name="longitude" type="number" step="0.0000001" /></label>
        <label className="span-2">Descripcion del dano<textarea name="description" required rows={4} /></label>
        <label className="span-2">Fotos<input type="file" accept="image/*" multiple onChange={(event) => setPhotos(Array.from(event.target.files ?? []).slice(0, 10))} /></label>
        <button disabled={loading}>{loading ? 'Enviando...' : 'Enviar reporte'}</button>
      </form>
      <NoticeBox notice={notice} />
    </section>
  )
}
