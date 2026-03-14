import { useState, useEffect } from 'react'

export function useApi(fetchFn) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const result = await fetchFn()
        if (!cancelled) setData(result)
      } catch (err) {
        console.error('API Error:', err)
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return { data, setData, loading, error }
}