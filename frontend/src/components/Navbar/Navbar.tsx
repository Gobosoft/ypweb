import { GiHamburgerMenu } from 'react-icons/gi'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { NavigationMenuLink } from 'src/components/ui/navigation-menu'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from 'src/components/ui/sheet'

import { cn } from 'src/lib/utils'
import { Link } from 'react-router-dom'
import i18n from 'src/i18n'
import { Home, LogOut, User, List } from 'lucide-react'
import logoutService from 'src/services/Auth/logout'
import { linkStyling } from 'src/constants'
import { useAppContext } from 'src/context/AppProvider'

interface NavbarProps {
  onLogoutSuccess: () => void
}

export default function Navbar({ onLogoutSuccess }: NavbarProps) {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

  const { currentUser } = useAppContext()

  const handleLogout = async () => {
    setIsNavbarOpen(false)
    const res = await logoutService.logoutUser()
    if (res) {
      onLogoutSuccess()
      navigate('/')
    }
  }

  useEffect(() => {
    if (currentUser.userData) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [currentUser])

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen)
  }

  useEffect(() => {
    setIsNavbarOpen(false)
  }, [location.pathname])

  return (
    <nav className="p-4 bg-white border-b">
      <div className="container mx-auto flex items-center justify-between">
        <button data-testid="home-button">
          <Link to="/">Etusivu</Link>
        </button>
        {isVisible && (
          <Sheet open={isNavbarOpen} onOpenChange={setIsNavbarOpen}>
            <SheetTrigger
              onClick={toggleNavbar}
              data-testid="open-application-sidebar-button"
            >
              <GiHamburgerMenu className="mx-2" />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Gobosoft</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col flex-wrap gap-3 justify-center my-4">
                <Link to={i18n.t('paths.mainscreen')} className={linkStyling}>
                  <Home /> {i18n.t('mainscreen')}
                </Link>
                <Link
                  to={i18n.t('paths.companyList')}
                  className={linkStyling}
                  data-testid="sidebar-companylist-link"
                >
                  <List />
                  {i18n.t('companyList')}
                </Link>
                <Link
                  to={i18n.t('paths.profile')}
                  className={linkStyling}
                  data-testid="sidebar-profile-link"
                >
                  <User />
                  {i18n.t('profile.profile')}
                </Link>

                <button
                  onClick={handleLogout}
                  className={linkStyling}
                  data-testid="sidebar-logout-button"
                >
                  <LogOut />
                  {i18n.t('logout')}
                </button>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </nav>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'
