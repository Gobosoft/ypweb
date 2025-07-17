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
import { Company } from 'src/lib/types'
import SmallLoadingCircleOnly from 'src/components/Loading/SmallLoadingCircle'

interface Props {
  companies: Company[]
  loading: boolean
}

const CompanyTable = ({ companies, loading }: Props) => {
  const navigate = useNavigate()

  if (loading) {
    return <SmallLoadingCircleOnly />
  }

  return (
    <div className="space-y-4">
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
          {companies.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground"
              >
                Ei yrityksiä
              </TableCell>
            </TableRow>
          ) : (
            companies.map((company) => (
              <TableRow
                key={company.id}
                className="hover:bg-muted cursor-pointer"
                onClick={() =>
                  navigate(`/${i18n.t('paths.singleCompany')}/${company.id}`)
                }
              >
                <TableCell>{company.name}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default CompanyTable
