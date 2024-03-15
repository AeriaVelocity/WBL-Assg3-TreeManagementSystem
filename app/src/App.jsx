import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [data, setData] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/data');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const jsonData = await response.json();
            setData(jsonData);
        }
        catch (error) {
            console.error('Error fetching data:', error);
            setError('Error fetching data. Please try again later.');
        }
    };

    return (
        <div className="App">
            <h1>Tree Management System</h1>
            <h2>Web App</h2>
        </div>
    );
}

export default App;
