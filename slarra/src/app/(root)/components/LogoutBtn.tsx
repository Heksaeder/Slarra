import { logout } from '@/app/services/auth';
import Link from 'next/link';
import React from 'react'

const LogoutBtn = () => {
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <Link href="/login" onClick={handleLogout}>
      Logout
    </Link>
  )
}

export default LogoutBtn