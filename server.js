const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/surveyor', (req, res) => res.sendFile(path.join(__dirname, 'public', 'surveyor.html')));

app.listen(PORT, () => console.log(`FarmMap running on port ${PORT}`));
