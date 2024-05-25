'use client';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import { useLogoutMutation } from '@/app/services/users';
import { FaHome, FaRegUserCircle, FaGamepad, FaSignOutAlt, FaUserCog } from "react-icons/fa";


const Header = () => {
  const routes = usePathname();
  const logoutMutation = useLogoutMutation();
  const [links, setLinks] = useState([
    { href: '/', icon: FaHome, label: 'Home' },
    { href: '/profile', icon:FaRegUserCircle, label: 'Profile' },
    { href: '/games', icon:FaGamepad, label: 'Games' },
  ]);

  const isLoginRoute = routes === '/login';
  if (isLoginRoute) return null;

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decodedToken: { role: string } = jwtDecode(token);
        if (decodedToken.role === 'admin') {
          setLinks((prevLinks) => {
            if (!prevLinks.some(link => link.href === '/admin')) {
              return [
                { href: '/admin', icon: FaUserCog, label: 'Admin' },
                ...prevLinks,
              ];
            }
            return prevLinks;
          });
        }
      } catch (err) {
        console.error('Failed to decode token', err);
      }
    }
  }, []);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header>
      <nav>
        <a href="/">
          Slarra
        </a>
        <ul>
          {links.map(({ href, icon:Icon }) => (
            <li key={href}>
              <a href={href}>
                <Icon />
              </a>
            </li>
          ))}
        </ul>
        <a href="/login">
          <FaSignOutAlt onClick={handleLogout}/>
        </a>
      </nav>
    </header>
  );
};

export default Header;
