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
            <h1>React App w/ Node</h1>
            {error ? (
                <div className="error">{error}</div>
            ) : (
                <>
                    <p>Data from server</p>
                    <hr />
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </>
            )}
        </div>
    );
}

export default App;
