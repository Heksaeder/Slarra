'use client'
import { getUserIdFromToken } from "@/app/services/auth";
import { useDeleteMutation, useFetchUserQuery, useUpdateMutation } from "@/app/services/users";
import UpdateForm from "./components/UpdateForm";

const Profile = () => {

  const id = getUserIdFromToken() || '';

  const { data: userData, isLoading, isError } = useFetchUserQuery(id); // Fetch user data



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

  if (isLoading) return <div> </div>; // Show loading state
  if (isError) return <div> </div>; // Show error state
  
  return (
    <div>
      <h1>User Details</h1>
      <p>Name: {userData.name}</p>
      <p>Email: {userData.email}</p>
      <p>Bio: {userData.bio}</p>
      <br />
      <br />
      <h1>Update User</h1>
      <UpdateForm userData={userData} onSubmit={handleUpdateUser} />
      <br />

      <button onClick={handleDeleteUser}>Delete Account</button>
    </div>
  );
};

export default Profile;