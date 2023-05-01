const path = require('path');
const fs = require('fs');
const uuid = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Serve static files from the "public" directory
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

app.post('/api/notes', (req, res) => {
  const newNote = {
    id: uuid.v4(),
    title: req.body.title,
    text: req.body.text
  };
  
  // Read the existing notes from the file
  fs.readFile('./db/db.json', (err, data) => {
    if (err) throw err;
    
    // Parse the existing notes as JSON
    const notes = JSON.parse(data);
    
    // Add the new note to the array of notes
    notes.push(newNote);
    
    // Write the updated notes back to the file
    fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
      if (err) throw err;
      
      // Return the new note to the client
      res.json(newNote);
    });
  });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
