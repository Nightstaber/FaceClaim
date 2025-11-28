const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Upload opsætning
const storage = multer.diskStorage({
    destination: function(req, file, cb){ 
        cb(null, path.join(__dirname, 'uploads')) 
    filename: function(req, file, cb){ cb(null, Date.now() + path.extname(file.originalname)) }
});
const upload = multer({ storage });

// List alle billeder
app.get('/api/images', async (req, res) => {
    const images = await db.getImages();
    res.json(images);
});

// Upload billede med tags
app.post('/api/upload', upload.single('image'), async (req, res) => {
    const { Køn, Alder, Hårfarve, Kendetegn } = req.body;
    const filename = req.file.filename;
    const id = await db.addImage(filename, {Køn, Alder, Hårfarve, Kendetegn});
    res.json({success: true, id});
});

// Slet billede
app.delete('/api/image/:id', async (req, res) => {
    const id = req.params.id;
    await db.deleteImage(id);
    res.json({success:true});
});

app.listen(PORT, () => console.log(`Server kører på port ${PORT}`));

