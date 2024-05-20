'use client'
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'
import LogoutBtn from './LogoutBtn';

const Header = () => {
  const routes = usePathname();
  const links = [
    { href: '/', label: 'Home' },
    { href: '/profile', label: 'Profile' },
    { href: '/games', label: 'Games' }
  ]

  const [isDisplayed, setIsDisplayed] = useState(false);

  const toggleMenu = () => {
    setIsDisplayed(prevState => !prevState);
  };

  const closeMenu = () => {
    setIsDisplayed(false);
  };

  const isLoginRoute = routes === '/login';
  if (isLoginRoute) return null;

  return (
    <>
      <header>
        <nav>
          <ul>
            {links.map(({ href, label }) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
            <LogoutBtn />
          </ul>
        </nav>
      </header>
    </>
  )
}

export default Header