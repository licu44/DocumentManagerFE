import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [ test, setTest ] = useState();
    useEffect(() => {
        axios.get('https://localhost:7227/WeatherForecast').then((response) => {
            return setTest(response.data);
        }).catch((error) => {
            return console.error();
        });
    }, []);

    return (
        <div className="App">
            {test && test[1].date}
        </div>
    );
}

export default App;
