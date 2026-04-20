const USERS_MOCK = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "Manager" },
  { id: 4, name: "Sara Lee", email: "sara@example.com", role: "User" },
  { id: 5, name: "Nora Adams", email: "nora@example.com", role: "Admin" },
];

export async function getUsers() {
  return USERS_MOCK.map((user) => ({ ...user }));
}
