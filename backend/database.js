const sqlite3 = require('sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'images.db');
const db = new sqlite3.Database(dbPath);

// Opret tabel hvis ikke eksisterer
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT,
        Køn TEXT,
        Alder TEXT,
        Hårfarve TEXT,
        Kendetegn TEXT
    )`);
});

module.exports = {
    addImage: (filename, tags) => new Promise((resolve, reject) => {
        const stmt = db.prepare('INSERT INTO images (filename, Køn, Alder, Hårfarve, Kendetegn) VALUES (?,?,?,?,?)');
        stmt.run(filename, tags.Køn, tags.Alder, tags.Hårfarve, tags.Kendetegn, function(err){
            if(err) reject(err);
            else resolve(this.lastID);
        });
    }),
    getImages: () => new Promise((resolve, reject) => {
        db.all('SELECT * FROM images', (err, rows) => {
            if(err) reject(err);
            else resolve(rows);
        });
    }),
    deleteImage: (id) => new Promise((resolve, reject) => {
        db.run('DELETE FROM images WHERE id=?', id, err => {
            if(err) reject(err);
            else resolve();
        });
    })
};
