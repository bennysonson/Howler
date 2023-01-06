const express = require('express');
const routes = require('./src/routes');

const app = express();
const PORT = 3000;

// Designate the public folder as serving static resources
app.use(express.static('static'));
app.use(express.urlencoded({ extended: true }));

const html_dir = __dirname + '/templates/';

app.get('/', (req, res) => {
  res.sendFile(html_dir + 'login.html');
});

app.get('/howler', (req, res) => {
  res.sendFile(html_dir + 'howler.html');
})

app.get('/profile', (req, res) => {
  res.sendFile(html_dir + 'profile.html');
})

app.use(routes);

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));