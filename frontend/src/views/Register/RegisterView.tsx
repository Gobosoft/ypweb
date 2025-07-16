import RegisterForm from '../../components/Register/RegisterForm'
import i18n from '../../i18n'

const RegisterView = () => {
  return (
    <div data-testid="register-view" className="spacer background1 p-2">
      <div className="grid lg:grid-cols-2 grid-cols-1 w-full gap-2 mt-3">
        <div className="w-full col-span-1 items-center">
          <RegisterForm />
        </div>
        <div className="w-full col-span-1 items-center">
          <h1 className="sm:text-4xl text-2xl mb-2 text-center">
            {i18n.t('registerPage.description')}
          </h1>
        </div>
      </div>
    </div>
  )
}

export default RegisterView
