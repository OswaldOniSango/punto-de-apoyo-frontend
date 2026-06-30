export function normalizePhone(value: string) {
  const trimmed = value.trim()
  const prefix = trimmed.startsWith('+') ? '+' : ''
  return prefix + trimmed.replace(/\D/g, '')
}

export function emptyToNull(value: FormDataEntryValue | null) {
  const text = String(value || '').trim()
  return text ? text : null
}

export function optionalNumber(value: FormDataEntryValue | null) {
  const text = String(value || '').trim()
  return text ? Number(text) : null
}
