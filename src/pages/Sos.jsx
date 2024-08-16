import React, { useEffect, useState } from 'react';
import axios from 'axios';
import emailjs from 'emailjs-com';
import StateProgressbar from '../components/StateProgressbar';
import { ThreeDots } from 'react-loader-spinner';

const Sos = () => {
    const [isLoading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [responseTeam, setResponseTeam] = useState([]);
    const [sosStatus, setSosStatus] = useState(null);
    const [sosStatusIndex, setSosStatusIndex] = useState(-1);

    const sosStates = [
        'LocationAcquired',
        'LocationUpdated',
        'SendSOS',
        'EmergencyContactsNotified',
        'ResponseTeamAlerted',
        'Completed'
    ];

    useEffect(() => {
        const fetchUserInfo = async () => {
            const storedEmail = localStorage.getItem('userEmail');
            if (storedEmail) {
                try {
                    const response = await axios.get(`http://localhost:5000/details/${storedEmail}`);
                    setUserInfo(response.data.user);
                    setSosStatus(response.data.user.sosStatus);
                } catch (err) {
                    console.error('Error fetching user data:', err);
                }
            }
        };

        fetchUserInfo();
    }, []);

    useEffect(() => {
        const fetchResponseTeam = async () => {
            if (userInfo) {
                try {
                    const response = await axios.get('http://localhost:5000/notify/get-team-members');
                    setResponseTeam(response.data);
                } catch (err) {
                    console.error('Error fetching response team:', err);
                }
            }
        };

        fetchResponseTeam();
    }, [userInfo]);

    const handleSOSProcess = async () => {
        let currentState = localStorage.getItem('sosState') || 'LocationAcquired';

        while (currentState) {
            console.log('Current state:', currentState);
            const nextState = await executeStep(currentState);
            console.log('Next state:', nextState);

            if (nextState === 'Error') {
                console.error('An error occurred. Stopping the process.');
                break;
            }

            if (sosStates.includes(nextState)) {
                localStorage.setItem('sosState', nextState);
                setSosStatusIndex(sosStates.indexOf(nextState));
            } else {
                console.error('Invalid next state:', nextState);
                localStorage.removeItem('sosState');
                break;
            }

            if (nextState === 'Completed') {
                localStorage.removeItem('sosState');
                break;
            }

            currentState = nextState;
        }
    };

    useEffect(() => {
        if (userInfo && userInfo.sos) {
            handleSOSProcess();
        }
    }, [userInfo, responseTeam]);

    const executeStep = async (step) => {
        switch (step) {
            case 'LocationAcquired':
                console.log('Step: Location Acquired');
                return new Promise((resolve) => {
                    const handleGeolocation = () => {
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                                async (position) => {
                                    const { latitude, longitude } = position.coords;
                                    localStorage.setItem('sosState', 'LocationUpdated');
                                    console.log('Location acquired:', latitude, longitude);
                                    try {
                                        setLoading(true);
                                        console.log('Updating location...');
                                        await axios.post('http://localhost:5000/location/update-location', {
                                            email: userInfo.email,
                                            lat: latitude,
                                            long: longitude,
                                        });
                                        resolve('LocationUpdated');
                                    } catch (err) {
                                        console.error('Error updating location:', err);
                                        setLoading(false);
                                        resolve('Error');
                                    }
                                },
                                (err) => {
                                    console.error('Error getting geolocation:', err);
                                    setLoading(false);
                                    resolve('Error');
                                }
                            );
                        } else {
                            console.log('Geolocation is not supported by this browser.');
                            resolve('Error');
                        }
                    };

                    // Trigger geolocation request on button click
                    const button = document.createElement('button');
                    button.style.display = 'none';
                    button.addEventListener('click', handleGeolocation);
                    document.body.appendChild(button);
                    button.click();
                    document.body.removeChild(button);
                });

            case 'LocationUpdated':
                console.log('Step: Location Updated');
                return new Promise(async (resolve) => {
                    setLoading(true);
                    try {
                        const message = 'Urgent: Please be aware of the emergency situation. Safe places have been identified and action is being taken.';
                        localStorage.setItem('sosState', 'SendSOS');
                        console.log('Location updated.');
                        resolve('SendSOS');
                    } catch (err) {
                        console.error('Error updating location:', err);
                        setLoading(false);
                        resolve('Error');
                    } finally {
                        setLoading(false);
                    }
                });

            case 'SendSOS':
                console.log('Step: Send SOS To Server');
                return new Promise(async (resolve) => {
                    setLoading(true);
                    try {
                        await axios.post('http://localhost:5000/details/update-sos', {
                            email: userInfo.email,
                            sos: true
                        });
                        console.log('SOS sent to server.');
                        localStorage.setItem('sosState', 'EmergencyContactsNotified');
                        resolve('EmergencyContactsNotified');
                    } catch (err) {
                        console.error('Error sending SOS to server:', err);
                        setLoading(false);
                        resolve('Error');
                    } finally {
                        setLoading(false);
                    }
                });

            case 'EmergencyContactsNotified':
                console.log('Step: Emergency Contacts Notified');
                return new Promise(async (resolve) => {
                    // Send emails only once for this step
                    const emailSent = localStorage.getItem('emailSent');
                    if (!emailSent) {
                        try {
                            const notifications = responseTeam.map(member => {
                                const templateParams = {
                                    from_name: 'Emergency Alert System',
                                    to_name: member.name,
                                    to_email: member.email,
                                    message: 'Urgent: Please be aware of the emergency situation. Safe places have been identified and action is being taken.',
                                    subject: 'Emergency Alert'
                                };

                                return emailjs.send('service_tnol3rn', 'template_xmp0xlp', templateParams, 'VLvH9rCa8-byzYIJ-');
                            });

                            await Promise.all(notifications);
                            localStorage.setItem('emailSent', 'true');
                            console.log('Emergency contacts notified.');
                        } catch (err) {
                            console.error('Error notifying contacts:', err);
                            setLoading(false);
                            resolve('Error');
                        }
                    }
                    localStorage.setItem('sosState', 'ResponseTeamAlerted');
                    resolve('ResponseTeamAlerted');
                });

            case 'ResponseTeamAlerted':
                console.log('Step: Response Team Alerted');
                // Update SOS status explicitly

                return new Promise(async (resolve) => {
                    setLoading(true);
                    try {
                        const updatedUserResponse = await axios.get(`http://localhost:5000/details/${userInfo.email}`);
                        const updatedUser = updatedUserResponse.data.user;

                        if (updatedUser.sosStatus) {
                            localStorage.setItem('sosState', 'Completed');
                            resolve('Completed');
                        }
                    } catch (err) {
                        console.error('Error ', err);
                        setLoading(false);
                        resolve('Error');
                    } finally {
                        setLoading(false);
                    }
                });

            default:
                console.log('Unknown step:', step);
                return 'Error'; // Return an error state for unknown steps
        }
    };

    const cancelSos = async () => {
        try {
            setLoading(true);
            await axios.post('http://localhost:5000/details/update-sos', {
                email: userInfo.email,
                sos: false
            });
            setSosStatus(false);
            setSosStatusIndex(-1);
            localStorage.removeItem('sosState');
            localStorage.removeItem('emailSent'); // Clear email sent state
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const sendSos = async () => {
        try {
            setLoading(true);
            await axios.post('http://localhost:5000/details/update-sos', {
                email: userInfo.email,
                sos: true
            });
            setSosStatus(true);
            localStorage.setItem('sosState', 'LocationAcquired'); // Start the process
            localStorage.removeItem('emailSent'); // Clear email sent state
            handleSOSProcess(); // Re-trigger the SOS process
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container mx-auto p-4'>
            <div className=' mx-auto bg-white shadow-2xl rounded-lg p-6'>
                <h2 className='text-2xl font-bold mb-4'>SOS Emergency System</h2>
                <div className='mb-4 shadow-2xl'>
                    <StateProgressbar states={sosStates} currentState={sosStatusIndex} />
                </div>
                <div className='flex justify-around  items-center'>
                    <button
                        className='bg-red-500 text-white px-4 py-2 rounded shadow-2xl'
                        onClick={sendSos}
                        disabled={isLoading}
                    >
                        Send SOS
                    </button>
                    <button
                        className='bg-gray-300 text-black px-4 py-2 rounded shadow-2xl'
                        onClick={cancelSos}
                        disabled={isLoading}
                    >
                        Cancel SOS
                    </button>
                </div>
                {isLoading && (
                    <div className='flex justify-center items-center mt-4'>
                        <ThreeDots color="#00BFFF" height={80} width={80} />
                    </div>
                )}
                <div className='mt-4'>
                    <h3 className='text-lg font-bold'>Response Team</h3>
                    <div className='mt-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                        <div className='inline-block min-w-full sm:px-6 lg:px-8'>
                            <div className='overflow-hidden shadow-md sm:rounded-lg'>
                                <table className='min-w-full divide-y divide-gray-300'>
                                    <thead className='bg-gray-50'>
                                        <tr>
                                            <th scope="col" className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Name</th>
                                            <th scope="col" className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Email</th>
                                            <th scope="col" className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Phone</th>
                                            <th scope="col" className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Role</th>
                                        </tr>
                                    </thead>
                                    <tbody className='bg-white divide-y divide-gray-200'>
                                        {responseTeam.map(member => (
                                            <tr key={member.email}>
                                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{member.name}</td>
                                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{member.email}</td>
                                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{member.phone}</td>
                                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{member.role}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sos;
