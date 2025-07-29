import React, { useEffect, useState } from 'react'
import { Building } from 'src/lib/types'
import { Button } from '../ui/button'
import { RefreshCcw } from 'lucide-react'
import exhibitionYear from 'src/services/AdminSettings/exhibitionYear'

const BuildingsList: React.FC = () => {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const loadBuildings = async () => {
    try {
      const data = await exhibitionYear.fetchBuildings()
      setBuildings(data)
    } catch (error) {
      console.error('Failed to fetch exhibition buildings:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBuildings()
  }, [])

  if (loading) return <div>Ladataan...</div>

  return (
    <div>
      <h2 className="my-2">Rakennukset</h2>
      <Button
        variant={'secondary'}
        onClick={async () => {
          await loadBuildings()
        }}
      >
        <RefreshCcw />
      </Button>
      <ul className="space-y-2 my-4">
        {buildings.map((building) => (
          <li
            key={building.id}
            className="border rounded p-4 flex justify-between items-center"
          >
            <div>
              <div className="font-bold text-lg">{building.name}</div>
              <div className="text-sm text-gray-600">{building.location}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BuildingsList
