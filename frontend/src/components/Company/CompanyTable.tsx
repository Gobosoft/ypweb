import { useNavigate } from 'react-router-dom'
import i18n from 'src/i18n'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'src/components/ui/table'
import { Select, SelectTrigger, SelectContent, SelectItem } from 'src/components/ui/select'
import { Input } from 'src/components/ui/input'

const CompanyTable = () => {
  const navigate = useNavigate()

  const companies = [
    {
      id: 'codenest-labs',
      name: 'CodeNest Labs',
      contact: 'Kyllä',
      material: 'Kyllä',
      registered: '-',
      returned: 'Kyllä',
    },
  ]

  return (
    <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <Input placeholder="Hae yrityksistä" className="w-full md:w-1/2" />
        <Select>
          <SelectTrigger className="w-full md:w-48">
            <span>Suodata: Kaikki</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kaikki">Kaikki</SelectItem>
            <SelectItem value="yhteys">Yhteys saatu</SelectItem>
            <SelectItem value="ei_yhteys">Ei yhteyttä</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Yritys</TableHead>
            <TableHead>Yhteys saatu</TableHead>
            <TableHead>Ennakkomateriaali</TableHead>
            <TableHead>Ilmoittautunut</TableHead>
            <TableHead>Sopimus palautettu</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow
              key={company.id}
              className="hover:bg-muted cursor-pointer"
              onClick={() =>
                navigate(`/${i18n.t('paths.singleCompany')}/${company.id}`)
              }
            >
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.contact}</TableCell>
              <TableCell>{company.material}</TableCell>
              <TableCell>{company.registered}</TableCell>
              <TableCell>{company.returned}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default CompanyTable
