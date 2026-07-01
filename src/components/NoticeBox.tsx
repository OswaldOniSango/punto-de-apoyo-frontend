import { useEffect, useState } from 'react'
import type { Notice } from '../shared/viewTypes'

export function NoticeBox({ notice }: { notice: Notice }) {
  const [visible, setVisible] = useState(Boolean(notice))

  useEffect(() => {
    setVisible(Boolean(notice))
    if (!notice) return
    const timer = window.setTimeout(() => setVisible(false), 4200)
    return () => window.clearTimeout(timer)
  }, [notice])

  if (!notice || !visible) return null

  return (
    <div className={`notice ${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}>
      <span aria-hidden="true">{notice.type === 'error' ? '!' : '✓'}</span>
      {briefNotice(notice)}
    </div>
  )
}

function briefNotice(notice: Exclude<Notice, null>) {
  const text = notice.text.trim()
  if (notice.type === 'success') return text
  if (/http\s*500/i.test(text)) return 'No se pudo completar la solicitud.'
  if (/http\s*404/i.test(text)) return 'No se encontro informacion.'
  if (/http\s*40[13]/i.test(text)) return 'Acceso no autorizado.'
  return text.split(/[.\n]/)[0].slice(0, 90)
}
