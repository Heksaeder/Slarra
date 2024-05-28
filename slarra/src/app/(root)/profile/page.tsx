'use client'
import { getUserIdFromToken } from "@/app/services/auth";
import { useDeleteMutation, useFetchUserQuery, useUpdateMutation } from "@/app/services/users";
import UpdateForm from "./components/UpdateForm";
import './styles.css';
import { useEffect } from "react";

const Profile = () => {

  const userId = getUserIdFromToken(); // Get user ID from token

  const { data: user, isLoading, isError } = useFetchUserQuery(userId as string); // Fetch user data
  
  const updateUserMutation = useUpdateMutation(); // Use the mutation hook
  const deleteMutation = useDeleteMutation(); // Use the mutation hook

  const handleUpdateUser = async (updatedUserData: { id: string, name: string; email: string; bio: string }) => {
    try {
      await updateUserMutation.mutateAsync(updatedUserData); // Pass updatedUserData directly
      console.log('User data updated successfully');
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteMutation.mutateAsync(); // Trigger the delete mutation
      // Redirect to login page
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-extrabold uppercase shadow-black">Profile</h1>
      {user && ( // Conditional rendering when user data is available
        <div className="flex flex-row w-1/2 bg-[#080808] rounded-lg">
          <img src="https://via.placeholder.com/150" alt="profile" className="rounded-full h-24 w-24 m-4" />
          <div className="flex flex-col justify-center">
            <p className="text-2xl font-bold">Welcome, {user.name}</p>
            <p className="text-lg">Email: {user.email}</p>
            <p className="text-lg">Bio: {user.bio}</p>
          </div>
        </div>
      )}
      <h1 className="text-4xl font-extrabold uppercase shadow-black">Settings</h1>
      <UpdateForm userData={user} onSubmit={handleUpdateUser} />
      <br />
      <div className="mx-4">
        <button className="create-btn bg-red-800 active:bg-red-950" onClick={handleDeleteUser}>Delete Account</button>
      </div>
    </div>
  );
};

export default Profile;
