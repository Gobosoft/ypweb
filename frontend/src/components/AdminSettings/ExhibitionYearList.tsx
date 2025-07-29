import React, { useEffect, useState } from 'react'
import { ExhibitionYear } from 'src/lib/types'
import { Button } from '../ui/button'
import { RefreshCcw } from 'lucide-react'
import exhibitionYearService from 'src/services/AdminSettings/exhibitionYear'

const ExhibitionYearList: React.FC = () => {
  const [years, setYears] = useState<ExhibitionYear[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const loadYears = async () => {
    try {
      const data = await exhibitionYearService.fetchExhibitionYears()
      setYears(data)
    } catch (error) {
      console.error('Failed to fetch exhibition years:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleActivate = async (id: number) => {
    try {
      await exhibitionYearService.activateExhibitionYear(id)
      await loadYears() // refresh after activation
    } catch (error) {
      console.error('Failed to activate exhibition year:', error)
    }
  }

  useEffect(() => {
    loadYears()
  }, [])

  if (loading) return <div>Ladataan...</div>

  return (
    <div>
      <Button
        variant={'secondary'}
        onClick={async () => {
          await loadYears()
        }}
      >
        <RefreshCcw />
      </Button>
      <ul className="space-y-2 my-4">
        {years.map((year) => (
          <li
            key={year.id}
            className="border rounded p-4 flex justify-between items-center"
          >
            <div>
              <div className="font-bold text-lg">{year.year}</div>
              <div className="text-sm text-gray-600">
                {year.start_date} – {year.end_date}
              </div>
              {year.is_active && (
                <div className="text-green-600 font-semibold">Aktiivinen</div>
              )}
            </div>
            {!year.is_active && (
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => handleActivate(year.id)}
              >
                Aktivoi
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ExhibitionYearList
