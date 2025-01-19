import TableCard from '../../components/tableCard/TableCard';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const GeneralReportsPage = () => {
  const users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    {
      id: 3,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'Moderator',
    },
  ];

  const columns: { key: keyof User; label: string; sortable: boolean }[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
  ];

  return (
    <div>
      <h1>General Reports</h1>
      <TableCard<User>
        columns={columns}
        data={users}
        onSort={(key, direction) =>
          console.log(`Sorting ${key} by ${direction}`)
        }
      />
    </div>
  );
};

export default GeneralReportsPage;
