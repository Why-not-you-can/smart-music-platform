import { useState, useEffect } from 'react'
export const useRankSelect = () => {
  const [selectedRank, setSelectedRank] = useState<any>(null)

  useEffect(() => {
    const handleRankSelect = (e: Event) => {
      const rankData = (e as CustomEvent).detail
      setSelectedRank(rankData)
    }
    window.addEventListener('rankSelect', handleRankSelect)
    return () => {
      window.removeEventListener('rankSelect', handleRankSelect)
    }
  }, [])

  return selectedRank
}
