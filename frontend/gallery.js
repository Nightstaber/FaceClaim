async function loadImages(filters = {}) {
    const res = await fetch('/api/images');
    const images = await res.json();

    const container = document.getElementById('gallery');
    container.innerHTML = '';

    const filtered = images.filter(img => {
        return Object.entries(filters).every(([key,val]) => !val || img[key] === val);
    });

    filtered.forEach(img => {
        const el = document.createElement('div');
        el.className = 'image-card';
        el.innerHTML = `<img src="/uploads/${img.filename}" alt=""><p>${img.Køn}, ${img.Alder}, ${img.Hårfarve}</p>`;
        container.appendChild(el);
    });
}

document.addEventListener('DOMContentLoaded', () => loadImages());
