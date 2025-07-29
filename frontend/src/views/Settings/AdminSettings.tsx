import React from 'react'
import { Link } from 'react-router-dom'
import BuildingsList from 'src/components/AdminSettings/BuildingsList'
import CreateExhibitionYearForm from 'src/components/AdminSettings/CreateExhibitionYearForm'
import CreateProductForm from 'src/components/AdminSettings/CreateProductForm'
import ExhibitionYearList from 'src/components/AdminSettings/ExhibitionYearList'
import ProductsList from 'src/components/AdminSettings/ProductsList'
import { Button } from 'src/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'src/components/ui/dialog'
import i18n from 'src/i18n'

const AdminSettings = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        {i18n.t('settingsView.title')}
      </h2>
      <div className="flex flex-wrap gap-2 justify-between">
        <h2 className="text-xl font-semibold mb-4">
          {i18n.t('settingsView.products')}
        </h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>{i18n.t('settingsView.addProduct')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{i18n.t('settingsView.addProduct')}</DialogTitle>
            </DialogHeader>
            <div>
              <CreateProductForm />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ProductsList />

      <div className="flex flex-wrap gap-2 justify-between">
        <h2 className="text-xl font-semibold mb-4">
          {i18n.t('settingsView.exhibitionYears')}
        </h2>
        <Button asChild>
          <Link to={i18n.t('paths.usersList')}>
            {i18n.t('settingsView.usersList')}
          </Link>
        </Button>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>{i18n.t('settingsView.createExhibitionYear')}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {i18n.t('settingsView.createExhibitionYear')}
            </DialogTitle>
          </DialogHeader>
          <div>
            <CreateExhibitionYearForm />
          </div>
        </DialogContent>
      </Dialog>
      <div className="my-4">
        <ExhibitionYearList />
      </div>
      <div className="my-4">
        <BuildingsList />
      </div>
    </div>
  )
}

export default AdminSettings
