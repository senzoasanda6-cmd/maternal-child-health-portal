import React from 'react';

const ChildrenList = () => {
  const children = [
    { id: 1, name: 'Inga', age: 2, gender: 'Male' },
    { id: 2, name: 'Lerato', age: 1, gender: 'Female' },
  ];

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">Children List</h2>
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {children.map((child) => (
            <tr key={child.id}>
              <td>{child.name}</td>
              <td>{child.age}</td>
              <td>{child.gender}</td>
              <td>
                <button className="btn btn-primary btn-sm me-2">View</button>
                <button className="btn btn-secondary btn-sm">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChildrenList;