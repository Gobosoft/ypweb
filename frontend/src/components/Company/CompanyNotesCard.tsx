import { Card } from 'src/components/ui/card'

const CompanyNotesCard = () => {
  return (
    <Card className="p-4">
      <h4 className="font-semibold mb-2">Yrityksen toiveet ja huomiot</h4>
      <p className="text-sm text-muted-foreground">
        päivitetty viimeksi 12.9.2025
      </p>
      <p className="text-sm">
        Moikka! Toivoisimme pääsevämme Tietotaloon koska olemme siellä aina
        olleet. Lisäksi, miten ruokailut hoidetaan ja hoituuko tapahtumapaikka?
      </p>
    </Card>
  )
}

export default CompanyNotesCard
