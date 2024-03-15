const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Add JSON body parsing middleware

const treeDataPath = path.join(__dirname, '../data/trees.json');

app.get('/api/data', (req, res) => {
  try {
    const treeData = fs.readFileSync(treeDataPath, 'utf8');
    res.setHeader('Content-Type', 'application/json');
    res.json(JSON.parse(treeData));
  } catch (error) {
    console.error('Error reading tree data:', error);
    res.status(500).json({ error: 'Failed to read tree data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
