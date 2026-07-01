import L from 'leaflet'
import { useEffect, useState } from 'react'
import type { FormEvent, InputHTMLAttributes, ReactNode } from 'react'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { publicCasesApi } from '../../api'
import { NoticeBox } from '../../components/NoticeBox'
import { priorities } from '../../shared/constants'
import { getErrorMessage } from '../../shared/errors'
import { emptyToNull, normalizePhone } from '../../shared/formUtils'
import { priorityLabel } from '../../shared/formatters'
import type { Notice } from '../../shared/viewTypes'

const initialPosition = { latitude: 10.5001234, longitude: -66.9012345 }

export function PublicCaseForm() {
  const [notice, setNotice] = useState<Notice>(null)
  const [loading, setLoading] = useState(false)
  const [photos, setPhotos] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const [position, setPosition] = useState(initialPosition)

  useEffect(() => {
    const urls = photos.map((photo) => URL.createObjectURL(photo))
    setPhotoPreviews(urls)
    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [photos])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    const payload = {
      applicantName: String(form.get('applicantName') || ''),
      applicantPhone: normalizePhone(String(form.get('applicantPhone') || '')),
      applicantEmail: emptyToNull(form.get('applicantEmail')),
      address: String(form.get('address') || ''),
      city: String(form.get('city') || ''),
      stateRegion: String(form.get('stateRegion') || ''),
      description: String(form.get('description') || ''),
      latitude: position.latitude,
      longitude: position.longitude,
      priority: String(form.get('priority') || 'MEDIUM'),
    }
    setLoading(true)
    setNotice(null)
    try {
      const created = await publicCasesApi.create(payload, photos)
      setNotice({ type: 'success', text: created?.trackingCode ? `Caso creado: ${created.trackingCode}` : 'Caso creado correctamente' })
      formElement.reset()
      setPhotos([])
      setPosition(initialPosition)
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
        <Field label="Nombre completo" name="applicantName" required maxLength={150} />
        <Field label="Telefono" name="applicantPhone" required placeholder="+58 412 555-1212" />
        <Field label="Email" name="applicantEmail" type="email" maxLength={180} />
        <Field className="span-2" label="Direccion" name="address" required maxLength={255} />
        <TextareaField className="span-2" label="Descripcion del daño" name="description" />
        <LocationPicker position={position} onChange={setPosition} onError={(text) => setNotice({ type: 'error', text })} />
        <SelectField label="Prioridad" name="priority">{priorities.map((priority) => <option key={priority} value={priority}>{priorityLabel(priority)}</option>)}</SelectField>
        <Field label="Ciudad" name="city" defaultValue="Caracas" maxLength={120} />
        <Field label="Estado / region" name="stateRegion" defaultValue="Distrito Capital" maxLength={120} />
        <PhotoField photos={photos} previews={photoPreviews} onChange={(event) => setPhotos(event.currentTarget.files?.[0] ? [event.currentTarget.files[0]] : [])} />
        <button className="submit-case-button" disabled={loading}>{loading ? 'Enviando...' : 'Enviar caso'}</button>
      </form>
      <NoticeBox notice={notice} />
    </section>
  )
}

function LocationPicker({ position, onChange, onError }: { position: typeof initialPosition; onChange: (position: typeof initialPosition) => void; onError: (error: string) => void }) {
  function useCurrentLocation() {
    if (!navigator.geolocation) {
      onError('Tu navegador no permite obtener la ubicacion')
      return
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => onChange({ latitude: Number(coords.latitude.toFixed(7)), longitude: Number(coords.longitude.toFixed(7)) }),
      () => onError('No se pudo obtener tu ubicacion'),
    )
  }

  return (
    <div className="location-picker span-2">
      <div className="location-map">
        <MapContainer center={[position.latitude, position.longitude]} zoom={15} scrollWheelZoom className="leaflet-frame">
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker position={position} onChange={onChange} />
        </MapContainer>
      </div>
      <div className="location-actions">
        <button type="button" className="location-button" onClick={useCurrentLocation}><span aria-hidden="true" />Usar mi ubicacion</button>
        <div className="location-coordinates">
          <span className="info-chip">Latitud: {position.latitude.toFixed(7)}</span>
          <span className="info-chip">Longitud: {position.longitude.toFixed(7)}</span>
        </div>
      </div>
    </div>
  )
}

function LocationMarker({ position, onChange }: { position: typeof initialPosition; onChange: (position: typeof initialPosition) => void }) {
  const map = useMap()
  const icon = L.divIcon({
    className: 'pa-marker',
    html: '<span></span>',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  })

  useMapEvents({
    click: ({ latlng }) => onChange({ latitude: Number(latlng.lat.toFixed(7)), longitude: Number(latlng.lng.toFixed(7)) }),
  })

  useEffect(() => {
    map.setView([position.latitude, position.longitude], map.getZoom(), { animate: true })
  }, [map, position.latitude, position.longitude])

  return <Marker position={[position.latitude, position.longitude]} icon={icon} />
}

function Field({ className = '', label, name, type = 'text', ...props }: { className?: string; label: string; name: string; type?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <fieldset className={`form-field ${className}`}>
      <legend>{label}</legend>
      <input className="form-control" name={name} type={type} {...props} />
    </fieldset>
  )
}

function SelectField({ className = '', label, name, children }: { className?: string; label: string; name: string; children: ReactNode }) {
  return (
    <fieldset className={`form-field ${className}`}>
      <legend>{label}</legend>
      <select className="form-control" name={name} required>{children}</select>
    </fieldset>
  )
}

function TextareaField({ className = '', label, name }: { className?: string; label: string; name: string }) {
  return (
    <fieldset className={`form-field ${className}`}>
      <legend>{label}</legend>
      <textarea className="form-control" name={name} required rows={4} />
    </fieldset>
  )
}

function PhotoField({ photos, previews, onChange }: { photos: File[]; previews: string[]; onChange: InputHTMLAttributes<HTMLInputElement>['onChange'] }) {
  return (
    <>
      <label className="photo-upload span-2">
        <input type="file" accept="image/*" onChange={onChange} />
        <span className="photo-upload-icon" aria-hidden="true" />
        Agregar foto
      </label>
      {previews.length ? (
        <div className="photo-preview-strip span-2" aria-label="Fotos seleccionadas">
          {previews.map((src, index) => <img key={src} src={src} alt={photos[index]?.name || `Foto ${index + 1}`} />)}
        </div>
      ) : null}
    </>
  )
}
