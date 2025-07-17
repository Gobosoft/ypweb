import { useEffect, useState } from 'react'
import CompanyTable from 'src/components/Company/CompanyTable'
import AddOrUpdateCompanyDialog from 'src/components/Company/AddOrUpdateCompanyDialog'
import { Input } from 'src/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from 'src/components/ui/select'
import companyService from 'src/services/Companies/companyService'
import { Company } from 'src/lib/types'
import { displayResponseErrorMessage } from 'src/lib/utils'

const CompanyListView = () => {
  const [companies, setCompanies] = useState<Company[]>([])
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const fetchCompanies = async () => {
    try {
      setLoading(true)
      const result = await companyService.getAllCompanies()
      setCompanies(result ?? [])
    } catch (error) {
      displayResponseErrorMessage(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  useEffect(() => {
    let filtered = companies

    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase()
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(lowerSearch)
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((c) => c.status === filterStatus)
    }

    setFilteredCompanies(filtered)
  }, [companies, searchTerm, filterStatus])

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Yrityslistaus (IT-näkymä)</h1>
          <p className="text-muted-foreground text-sm">
            Tämä näkymä on tarkoitettu IT-ylläpitoon ja yritystietojen
            hallintaan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AddOrUpdateCompanyDialog
            setCompanies={setCompanies}
            companies={companies}
          />
        </div>
      </div>

      {/* Haku ja suodatus */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <Input
          placeholder="Hae yrityksistä"
          className="w-full md:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          onValueChange={(value) => setFilterStatus(value)}
          defaultValue="all"
        >
          <SelectTrigger className="w-full md:w-48">
            <span>
              {filterStatus === 'all'
                ? 'Suodata: Kaikki'
                : `Suodata: ${filterStatus}`}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Kaikki</SelectItem>
            <SelectItem value="reserved">Varatut</SelectItem>
            <SelectItem value="unreserved">Varaamattomat</SelectItem>
            <SelectItem value="signed">Sopimus allekirjoitettu</SelectItem>
            <SelectItem value="ordered">Tilaus tehty</SelectItem>
            <SelectItem value="charged">Laskutettu</SelectItem>
            <SelectItem value="paid">Maksettu</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <CompanyTable companies={filteredCompanies} loading={loading} />
    </div>
  )
}

export default CompanyListView
