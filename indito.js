const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: '143.47.98.96',
  user: 'studb031',
  password: 'xyz456',
  database: 'db031'
});

db.connect((err) => {
  if (err) {
    console.error('Hiba az adatbázishoz való csatlakozáskor: ' + err.stack);
    return;
  }
  console.log('Sikeres csatlakozás az adatbázishoz.');
});

// Alkalmazás beállításai
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json()); // JSON body parser
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');



module.exports = db;

// Főoldal
app.get('/', (req, res) => {
  res.render('index', { title: 'Főoldal' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Kapcsolat' });
});

// CRUD műveletek
// Település CRUD műveletek
app.get('/crud', (req, res) => {
    db.query('SELECT * FROM telepules', (error, results) => {
      if (error) throw error;
      res.render('crud', { records: results }); // CRUD oldal megjelenítése a települések adataival
    });
  });
  
  // Lekérdezés a telepules táblából
  app.get('/get_records', (req, res) => {
    const query = 'SELECT * FROM telepules'; // Lekérdezi az összes rekordot a telepules táblából
    db.query(query, (err, results) => {
      if (err) throw err;
      res.json(results); // Visszaküldi a rekordokat JSON formátumban
    });
  });
  
  // Egy adott település lekérdezése a telepules táblából
  app.get('/get_record/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM telepules WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) throw err;
      res.json(result[0]); // Visszaadjuk az adott rekordot JSON formátumban
    });
  });
  
  // Új település hozzáadása a telepules táblához
  app.post('/create_record', (req, res) => {
    const { nev, npid } = req.body; // Az új település neve és nemzeti park azonosítója
    const query = 'INSERT INTO telepules (nev, npid) VALUES (?, ?)';
    db.query(query, [nev, npid], (err, result) => {
        if (err) throw err;
        res.sendStatus(201); // Sikeres hozzáadás után státuszkód visszaadása
    });
});
  
  app.post('/update_record', (req, res) => {
    const { id, nev, npid } = req.body;
  
    // Először lekérdezzük az aktuális rekordot
    db.query('SELECT * FROM telepules WHERE id = ?', [id], (err, result) => {
      if (err) throw err;
  
      const currentRecord = result[0];
  
      // Ha a mező üres, megtartjuk az eredeti értéket
      const updatedNev = nev || currentRecord.nev;
      const updatedNpid = npid || currentRecord.npid;
  
      // Ellenőrizheted, hogy történt-e valódi változás, hogy csak akkor frissítsd, ha szükséges
      if (updatedNev === currentRecord.nev && updatedNpid === currentRecord.npid) {
        return res.sendStatus(304); // Ha nincs változás, akkor nem szükséges frissíteni
      }
  
      const query = 'UPDATE telepules SET nev = ?, npid = ? WHERE id = ?';
      db.query(query, [updatedNev, updatedNpid, id], (err, result) => {
        if (err) throw err;
        res.sendStatus(200); // Sikeres frissítés
      });
    });
  });
  
  // Település törlése a telepules táblából
  app.delete('/delete_record/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM telepules WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) throw err;
      res.sendStatus(200); // Sikeres törlés után státuszkód visszaadása
    });
  });

app.get('/database', (req, res) => {
  const npQuery = 'SELECT * FROM np LIMIT 15';
  const telepulesQuery = 'SELECT * FROM telepules LIMIT 15';
  const utQuery = 'SELECT * FROM ut LIMIT 15';

  // Több lekérdezés végrehajtása
  db.query(npQuery, (err, npResults) => {
    if (err) throw err;

    db.query(telepulesQuery, (err, telepulesResults) => {
      if (err) throw err;

      db.query(utQuery, (err, utResults) => {
        if (err) throw err;

        // Továbbítjuk az adatokat az EJS fájlnak
        res.render('database', {
          np: npResults,
          telepules: telepulesResults,
          ut: utResults
        });
      });
    });
  });
});

// Üzenetek oldal
app.get('/messages', (req, res) => {
  const sql = 'SELECT * FROM uzenetek ORDER BY timestamp DESC'; // Üzenetek lekérdezése időrendben
  db.query(sql, (err, results) => {
    if (err) throw err;

    res.render('messages', { title: 'Üzenetek', uzenetek: results }); // Az üzenetek átadása az EJS-nek
  });
});

// Üzenet küldése
app.post('/send_message', (req, res) => {
  const { name, email, message } = req.body; // Használjuk a megfelelő változókat

  const sql = 'INSERT INTO uzenetek (nev, email, uzenet) VALUES (?, ?, ?)';
  db.query(sql, [name, email, message], (err, result) => { // Javítottam a változókat
      if (err) throw err;

      console.log('Message sent:', result);
      res.redirect('/messages'); // átirányítás a messages oldalra
  });
});

app.get('/oop', (req, res) => {
  res.render('oop', { title: 'OOP Javascript' });
});

const port = 8031;
app.listen(port, () => {
  console.log(`Server running at 143.47.98.96:${port}`);
});
