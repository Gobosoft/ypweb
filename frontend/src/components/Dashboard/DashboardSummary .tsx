import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from 'src/components/ui/card'

const DashboardSummary = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Ilmoittautumiset</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Placeholder kaaviolle */}
          <div className="h-40 bg-muted flex items-center justify-center rounded">
            <span>Kaavio ilmoittautumisista</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Myynnin eteneminen</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Placeholder donitsille */}
          <div className="h-40 bg-muted flex items-center justify-center rounded">
            <span>Donitsikaavio 84 %</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardSummary
