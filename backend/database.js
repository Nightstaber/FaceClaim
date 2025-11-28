const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./gallery.sqlite');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT,
        upload_date TEXT DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image_id INTEGER,
        category TEXT,
        value TEXT,
        FOREIGN KEY(image_id) REFERENCES images(id) ON DELETE CASCADE
    )`);
});

function addImage(filename, tags){
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO images(filename) VALUES(?)`, [filename], function(err){
            if(err) reject(err);
            const id = this.lastID;
            const stmt = db.prepare(`INSERT INTO tags(image_id, category, value) VALUES(?,?,?)`);
            for(const [cat, val] of Object.entries(tags)){
                if(val) stmt.run(id, cat, val);
            }
            stmt.finalize();
            resolve(id);
        });
    });
}

function getImages(){
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM images`, [], (err, rows) => {
            if(err) reject(err);
            const promises = rows.map(row => new Promise((res, rej) => {
                db.all(`SELECT category, value FROM tags WHERE image_id=?`, [row.id], (e, tags)=>{
                    if(e) rej(e);
                    const tagObj = {};
                    tags.forEach(t=>tagObj[t.category]=t.value);
                    row.tags = tagObj;
                    res(row);
                });
            }));
            Promise.all(promises).then(resolve).catch(reject);
        });
    });
}

function deleteImage(id){
    return new Promise((resolve, reject) => {
        db.get(`SELECT filename FROM images WHERE id=?`, [id], (err, row)=>{
            if(err) reject(err);
            if(row) require('fs').unlinkSync(`uploads/${row.filename}`);
            db.run(`DELETE FROM images WHERE id=?`, [id], err=> err ? reject(err): resolve());
        });
    });
}

module.exports = { addImage, getImages, deleteImage };
