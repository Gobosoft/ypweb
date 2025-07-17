import React from 'react'
import CreateExhibitionYearForm from 'src/components/AdminSettings/CreateExhibitionYearForm'
import ExhibitionYearList from 'src/components/AdminSettings/ExhibitionYearList'

const AdminSettings = () => {
  return (
    <div>
      <ExhibitionYearList />
      <CreateExhibitionYearForm />
    </div>
  )
}

export default AdminSettings
