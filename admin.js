const form = document.getElementById('uploadForm');
const imageList = document.getElementById('imageList');

async function loadImages() {
    const res = await fetch('save.php?action=list');
    const data = await res.json();
    imageList.innerHTML = '';

    data.forEach(img => {
        const div = document.createElement('div');
        div.innerHTML = `
            <img src="../gallery/uploads/${img.filename}" width="100">
            <button data-id="${img.id}">Slet</button>
        `;
        const btn = div.querySelector('button');
        btn.addEventListener('click', async () => {
            await fetch(`save.php?action=delete&id=${img.id}`);
            loadImages();
        });
        imageList.appendChild(div);
    });
}

form.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(form);
    const res = await fetch('save.php?action=upload', { method: 'POST', body: fd });
    const result = await res.json();
    if(result.success) loadImages();
});

loadImages();
