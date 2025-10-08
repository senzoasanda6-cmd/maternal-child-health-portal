export const getUsers = async () => {
  // Replace with real API call
  return [
    { id: 1, name: "Thandi M.", email: "thandi@example.com", role: "user" },
    { id: 2, name: "Sipho K.", email: "sipho@example.com", role: "admin" },
    { id: 3, name: "Amina R.", email: "amina@example.com", role: "user" },
  ];
};

export const updateUserRole = async (userId, newRole) => {
  // Replace with real API call
  console.log(`User ${userId} promoted to ${newRole}`);
  return true;
};
