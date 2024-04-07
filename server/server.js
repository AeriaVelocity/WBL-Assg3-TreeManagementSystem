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
    }
    catch (error) {
        console.error('Error reading tree data:', error);
        res.status(500).json({ error: 'Failed to read tree data' });
    }
});

app.post('/api/comments', (req, res) => {
    const { treeId, comment, timestamp } = req.body;

    try {
        console.log('Received comment for tree ID', treeId + ':', comment);
        
        var data = JSON.parse(fs.readFileSync(treeDataPath, 'utf8'));

        if (!data || !data.treeData || !data.treeData.trees) {
            res.status(400).json({ error: 'Invalid tree data' });
            return;
        }

        const treeIndex = data.treeData.trees.findIndex((tree) => tree.id === treeId);

        if (treeIndex === -1) {
            res.status(404).json({ error: 'Tree not found' });
            return;
        }

        if (!data.treeData.trees[treeIndex].comments) {
            data.treeData.trees[treeIndex].comments = [];
        }

        data.treeData.trees[treeIndex].comments.push({ comment, timestamp });

        fs.writeFileSync(treeDataPath, JSON.stringify(data, null, 2));

        res.status(200).json({ message: 'Comment submitted successfully' });
    }
    catch (error) {
        console.error('Error submitting comment:', error);
        res.status(500).json({ error: 'Failed to submit comment' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
