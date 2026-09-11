const DB_URL = 'https://sweet-cake-2519e-default-rtdb.firebaseio.com'

export async function dbGet(path: string): Promise<any> {
  const res = await fetch(`${DB_URL}/${path}.json`)
  if (!res.ok) return null
  return res.json()
}

export async function dbSet(path: string, data: any): Promise<void> {
  await fetch(`${DB_URL}/${path}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function dbUpdate(path: string, data: Record<string, any>): Promise<void> {
  await fetch(`${DB_URL}/${path}.json`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function dbRemove(path: string): Promise<void> {
  await fetch(`${DB_URL}/${path}.json`, { method: 'DELETE' })
}

export async function dbPush(path: string, data: any): Promise<string> {
  const res = await fetch(`${DB_URL}/${path}.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  return json.name as string
}

export { DB_URL }
