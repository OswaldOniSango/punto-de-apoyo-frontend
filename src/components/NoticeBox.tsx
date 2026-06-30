import type { Notice } from '../shared/viewTypes'

export function NoticeBox({ notice }: { notice: Notice }) {
  if (!notice) return null
  return <div className={`notice ${notice.type}`}>{notice.text}</div>
}
