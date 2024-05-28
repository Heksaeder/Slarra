'use client';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useLogoutMutation } from '@/app/services/users';
import { FaHome, FaRegUserCircle, FaGamepad, FaSignOutAlt, FaUserCog, FaTimes, FaBars } from "react-icons/fa";

const Header = () => {
  const routes = usePathname();
  const logoutMutation = useLogoutMutation();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [links, setLinks] = useState([
    { href: '/', icon: FaHome, label: 'Home' },
    { href: '/profile', icon: FaRegUserCircle, label: 'Profile' },
    { href: '/games', icon: FaGamepad, label: 'Games' },
  ]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

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

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isMenuOpen]);

  

  const isLoginRoute = routes === '/login';

  return (
    <header className="absolute p-4 bg-transparent text-white z-50">
      {!isLoginRoute && (
        <>
          <nav className="flex items-center justify-between">
            <div className="md:text-4xl z-50 p-6 md:p-4 text-2xl fixed top-0 left-0 font-thin ">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Menu">
                {isMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </nav>
          {isMenuOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-85 backdrop-filter backdrop-blur-md transition-transform transform duration-300 md:transition-transform md:transform md:duration-300 ease-in-out flex flex-col items-start justify-center">
                <ul className="space-y-4">
                  {links.map(({ href, label, icon: Icon }) => (
                    <li key={href}>
                      <a href={href} className="menu-link hover:pl-4 flex flex-row hover:text-gray-500 uppercase text-8xl md:text-[7rem] lg:text-[10rem] xl:text-[11rem] transition-all duration-300 md:transition-all md:duration-300 -mx-3">
                        {/*<Icon />*/}
                        <span>{label}</span>
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href="/login" className="menu-link hover:pl-4 flex flex-row hover:text-gray-500 uppercase text-8xl md:text-[7rem] lg:text-[10rem] xl:text-[11rem] transition-all duration-300 md:transition-all md:duration-300 -mx-3" onClick={handleLogout}>
                      {/*<FaSignOutAlt />*/}
                      <span>Logout</span>
                    </a>
                  </li>
                </ul>
            </div>
          )}
        </>
      )}
    </header>
  );
};

export default Header;
