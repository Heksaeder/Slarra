'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFetchUsers } from '../../../services/users';
import { useFetchGamesQuery } from '../../../services/games'; // [3]

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]); // [1]
  const router = useRouter();

  const { data: usersData, error:usersError } = useFetchUsers();
  const { data: gamesData, error: gamesError } = useFetchGamesQuery(); // [2]

  useEffect(() => {
    if (usersData) {
      setUsers(usersData);
    }
  }, [usersData]);

  useEffect(() => {
    if (gamesData) {
      setGames(gamesData); // [4]
    }
  }, [gamesData]);

  useEffect(() => {
    if (usersError) {
      router.push('/login');
    }
  }, [usersError, router]);

  return (
    <div>
      <h1>Admin Panel</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                {/*Promote user*/}
                <button>Update</button>
                {/*Delete user*/}
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game: any) => (
            <tr key={game._id}>
              <td>{game.title}</td>
              <td>{game.description}</td>
              <td><a href={`/games/${game._id}`}>Lien</a></td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  );
};

export default AdminPanel;
