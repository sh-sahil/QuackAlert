import React, { useState, useEffect } from 'react';
import ResponseTable from './ResponseTable';
import axios from 'axios';

const ResponseTeam = () => {
  const [data, setData] = useState([]);
  const columns = [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Role",
      accessor: "role",
    },
    {
      Header: "Phone",
      accessor: "phone",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Location",
      accessor: "location",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Actions",
      accessor: "actions", // This column is likely causing the duplicate buttons
    },
  ];
  
  
  const [selectedItem, setSelectedItem] = useState(null); // For the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/response-team');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (row) => {
    setSelectedItem(row);
    setIsModalOpen(true); // Open the modal
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/response-team/${id}`);
      setData(data.filter(item => item._id !== id)); // Update local state after deletion
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/response-team/${selectedItem._id}`, selectedItem);
      setData(data.map(item => item._id === selectedItem._id ? selectedItem : item)); // Update local state
      setIsModalOpen(false); // Close the modal
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleChange = (e) => {
    setSelectedItem({
      ...selectedItem,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <ResponseTable 
        columns={columns} 
        data={data} 
        handleEdit={handleEdit} 
        handleDelete={handleDelete} 
      />

{isModalOpen && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-4 rounded shadow-lg w-1/3">
      <h2 className="text-xl mb-4">Edit Response Team Member</h2>
      <div className="flex mb-4">
        <div className="w-1/2 pr-2">
          <label className="block mb-2">Name:</label>
          <input 
            type="text" 
            name="name" 
            value={selectedItem.name || ''} 
            onChange={handleChange} 
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>
        <div className="w-1/2 pl-2">
          <label className="block mb-2">Role:</label>
          <input 
            type="text" 
            name="role" 
            value={selectedItem.role || ''} 
            onChange={handleChange} 
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>
      </div>
      <div className="flex mb-4">
        <div className="w-1/2 pr-2">
          <label className="block mb-2">Phone:</label>
          <input 
            type="text" 
            name="phone" 
            value={selectedItem.phone || ''} 
            onChange={handleChange} 
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>
        <div className="w-1/2 pl-2">
          <label className="block mb-2">Email:</label>
          <input 
            type="email" 
            name="email" 
            value={selectedItem.email || ''} 
            onChange={handleChange} 
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>
      </div>
      <div className="flex mb-4">
        <div className="w-1/2 pr-2">
          <label className="block mb-2">Location:</label>
          <input 
            type="text" 
            name="location" 
            value={selectedItem.location || ''} 
            onChange={handleChange} 
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>
        <div className="w-1/2 pl-2">
          <label className="block mb-2">Status:</label>
          <select 
            name="status" 
            value={selectedItem.status || ''} 
            onChange={handleChange} 
            className="border border-gray-300 rounded p-2 w-full"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end">
        <button 
          onClick={handleUpdate} 
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Update
        </button>
        <button 
          onClick={() => setIsModalOpen(false)} 
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default ResponseTeam;
