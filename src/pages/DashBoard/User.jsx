import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UsersTable from './UsersTable'; // Import the UsersTable component

const columns = [
  {
    Header: 'Index',
    accessor: 'index'
  },
  {
    Header: 'Username',
    accessor: 'username'
  },
  {
    Header: 'Email',
    accessor: 'email'
  },
  {
    Header: 'Location',
    accessor: 'location'
  },
  {
    Header: 'Latitude',
    accessor: 'lat'
  },
  {
    Header: 'Longitude',
    accessor: 'long'
  },
  {
    Header: 'SOS Request',
    accessor: 'sos',
    Cell: ({ value }) => (
      value ? 'Yes' : 'No'
    )
  },
  {
    Header: 'SOS Status',
    accessor: 'sosStatus',
    show: row => row.original.sos, // Conditionally show this column based on 'sos' field
    Cell: ({ value, row }) => (
      row.original.sos ? (
        <button
          onClick={() => row.original.handleSosStatusClick(row.original)}
          style={{
            backgroundColor: value ? 'green' : 'red',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 8px',
            cursor: 'pointer'
          }}
        >
          {value ? 'Accepted' : 'Accept'}
        </button>
      ) : null
    )
  }
];

const User = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from the backend
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getusers'); // Adjust the URL as needed
        if (Array.isArray(response.data)) {
          // Modify the data structure if needed to fit the UsersTable
          const modifiedData = response.data.map((item, index) => ({
            ...item,
            index: index + 1, // Add the index column value
            handleSosStatusClick: (user) => {
              updateSosStatus(user.email);


            }
          }));
          setData(modifiedData);
        } else {
          console.error('Fetched data is not an array:', response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const updateSosStatus = async (user) => {
    try {
      const response = await axios.patch('http://localhost:5000/getusers/toggle-sos-status/' + user);
      setData(prevData =>
        prevData.map(userObject =>
          userObject.email === user
            ? { ...userObject, sosStatus: response.data.sosStatus } // Update the user with the new sosStatus
            : userObject
        )
      );
    } catch (error) {
      console.error('Error updating SOS status:', error);
    }
  };

  return (
    <div>
      <UsersTable columns={columns} data={data} />
    </div>
  );
};

export default User;
