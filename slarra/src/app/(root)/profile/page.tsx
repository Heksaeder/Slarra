'use client'
import { useFetchUserQuery } from '../../services/users';
import { getUserIdFromToken } from '../../services/auth';
import UpdateForm from './components/UpdateForm';
import { useUpdateMutation, useDeleteMutation } from '../../services/users';
import { useState } from 'react';

const Profile = () => {
  const id = getUserIdFromToken() || ''; // Get user ID from token, default to empty string if null

  const { data: userData, isLoading, isError } = useFetchUserQuery(id); // Fetch user data
  const [showModal, setShowModal] = useState(false);

  const updateUserMutation = useUpdateMutation(); // Use the mutation hook
  const deleteMutation = useDeleteMutation(); // Use the mutation hook

  const handleUpdateUser = async (updatedUserData: { id: string, name: string; email: string; bio: string }) => {
    try {
      console.log('Updating user data:', updatedUserData);
      await updateUserMutation.mutateAsync(updatedUserData); // Pass updatedUserData directly
      console.log('User data updated successfully');
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteMutation.mutateAsync(id); // Trigger the delete mutation
      // Redirect to login page
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching user data</div>;
  }

  return (
    <div>
      <h1>User Details</h1>
      <p>ID: {userData._id}</p>
      <p>Name: {userData.name}</p>
      <p>Email: {userData.email}</p>
      <p>Bio: {userData.bio}</p>
      <br />
      <br />
      <h1>Update User</h1>
      <UpdateForm userData={userData} onSubmit={handleUpdateUser} />

      {/* Button to trigger deletion */}
      <button onClick={() => setShowModal(true)}>Delete Account</button>
      {/* Modal for confirmation */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete your account?</p>
            <div>
              <button onClick={handleDeleteUser}>Yes, Delete</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
