import { useLogoutMutation } from '@/app/services/users';
import Link from 'next/link';
import React from 'react'

const LogoutBtn = () => {

  const logoutMutation = useLogoutMutation();
  const handleLogout = async () => {
    try {
      logoutMutation.mutateAsync();
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