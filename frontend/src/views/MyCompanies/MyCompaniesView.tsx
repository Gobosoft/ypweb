import { Link } from 'react-router-dom'
import { Button } from 'src/components/ui/button'
import i18n from 'src/i18n'

const MyCompaniesView = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-row flex-wrap gap-2">
        <Button asChild variant={'secondary'}>
          <Link to={'/' + i18n.t('paths.companyList')}>
            {i18n.t('companyList')}
          </Link>
        </Button>
        <Button asChild variant={'secondary'}>
          <Link to={'/' + i18n.t('paths.allOrders')}>
            {i18n.t('allOrders')}
          </Link>
        </Button>
      </div>
      <div>
        <h2>{i18n.t('myCompanies')}</h2>
        {/*TODO Fetch users companies and list them */}
      </div>
    </div>
  )
}

export default MyCompaniesView
