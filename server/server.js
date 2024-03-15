const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

const jsonData = {
    id: 1,
    title: 'Sample Data',
    description: 'This is a sample JSON response from the server.',
};

app.get('/api/data', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(jsonData);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
