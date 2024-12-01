const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Alkalmazás beállításai
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json()); // JSON body parser
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
  });
  
  app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Kapcsolat' });
  });
  
  app.get('/crud', (req, res) => {
    res.render('crud', { title: 'CRUD' });
  });
  
  app.get('/database', (req, res) => {
    res.render('database', { title: 'Adatbázis' });
  });
  
  app.get('/messages', (req, res) => {
    res.render('messages', { title: 'Üzenetek' });
  });
  
  app.get('/oop', (req, res) => {
    res.render('oop', { title: 'OOP Javascript' });
  });

const port = 8006;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
