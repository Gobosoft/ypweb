import DashboardSummary from 'src/components/Dashboard/DashboardSummary '
import CompanyTable from 'src/components/Company/CompanyTable'

const MainScreenView = () => {
  return (
    <div className="p-6 space-y-6">
      <DashboardSummary />
      <CompanyTable />
    </div>
  )
}

export default MainScreenView
