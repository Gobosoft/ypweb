import RegisterForm from '../../components/Register/RegisterForm'

const RegisterView = () => {
  return (
    <div data-testid="register-view" className="spacer background1 p-2">
      <div className="w-full col-span-1 items-center">
        <RegisterForm />
      </div>
    </div>
  )
}

export default RegisterView
