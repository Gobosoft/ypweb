import { Input } from 'src/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from 'src/components/ui/select'
import { Button } from 'src/components/ui/button'
import CompanyTable from 'src/components/Company/CompanyTable'
import AddOrUpdateCompanyDialog from 'src/components/Company/AddOrUpdateCompanyDialog'

const CompanyListView = () => {
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
          <Button variant="outline">Lataa Excel</Button>
          <AddOrUpdateCompanyDialog />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <Input placeholder="Hae yrityksistä" className="w-full md:w-1/2" />
        <Select>
          <SelectTrigger className="w-full md:w-48">
            <span>Suodata: Kaikki</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kaikki">Kaikki</SelectItem>
            <SelectItem value="jaetut">Jaetut</SelectItem>
            <SelectItem value="jakamattomat">Jakamattomat</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <CompanyTable />
    </div>
  )
}

export default CompanyListView
