const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

const fs = require('fs');
app.use(cors());

const treeData = fs.readFileSync('../data/trees.json');

app.get('/api/data', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(JSON.parse(treeData));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
