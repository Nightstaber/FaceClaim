const form = document.getElementById('uploadForm');
const imageList = document.getElementById('imageList');

// Funktion til at hente og vise alle billeder
async function loadImages() {
    const res = await fetch('/api/images');
    const data = await res.json();

    imageList.innerHTML = '';

    data.forEach(img => {
        const div = document.createElement('div');
        div.style.marginBottom = '10px';
        div.innerHTML = `
            <img src="/backend/uploads/${img.filename}" width="100" style="margin-right:10px;">
            <span>${Object.entries(img.tags).map(([k,v]) => `${k}: ${v}`).join(', ')}</span>
            <button data-id="${img.id}" style="margin-left:10px;">Slet</button>
        `;

        const btn = div.querySelector('button');
        btn.addEventListener('click', async () => {
            if (!confirm('Er du sikker på, du vil slette dette billede?')) return;
            await fetch(`/api/image/${img.id}`, { method: 'DELETE' });
            loadImages();
        });

        imageList.appendChild(div);
    });
}

// Upload billede med tags
form.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(form);

    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const result = await res.json();

    if(result.success){
        form.reset();
        loadImages();
    } else {
        alert('Upload fejlede.');
    }
});

// Initial load
loadImages();
