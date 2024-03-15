import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [data, setData] = useState({});

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
        }
    };

    return (
        <div className="App">
            <h1>Tree Management System - Web App</h1>
            <div>
                <h2>{data.name}</h2>
                {data.trees && data.trees.length > 0 ? (
                    data.trees.map((tree) => (
                        <div id="tree-block">
                            <img src={tree.image} />
                            <p>Image licensed under {tree.imageLicense}. <a href={tree.imageLicenseUrl}>View the full licence.</a></p>
                            <h3>{tree.name} tree</h3>
                            <p>{tree.species} - {tree.age} years old</p>
                        </div>
                    )) 
                ):(
                    <p>No Tree Data</p>
                )}
            </div>
        </div>
    );
}

export default App;
