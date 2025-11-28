async function loadGallery() {
    // Hent alle billeder fra Node API
    const res = await fetch('/api/images');
    const data = await res.json();

    const categories = {};

    // Find unikke kategorier og tags
    data.forEach(img => {
        for (const [cat, val] of Object.entries(img.tags)) {
            if (!categories[cat]) categories[cat] = new Set();
            categories[cat].add(val);
        }
    });

    // Generer filtre
    const filterDiv = document.getElementById('filters');
    filterDiv.innerHTML = '';
    const activeFilters = {};

    for (const [cat, vals] of Object.entries(categories)) {
        const sel = document.createElement('select');
        sel.dataset.category = cat;

        const optAll = document.createElement('option');
        optAll.value = '';
        optAll.textContent = `Alle ${cat}`;
        sel.appendChild(optAll);

        vals.forEach(v => {
            const opt = document.createElement('option');
            opt.value = v;
            opt.textContent = v;
            sel.appendChild(opt);
        });

        sel.addEventListener('change', () => {
            activeFilters[cat] = sel.value;
            showImages(data, activeFilters);
        });

        filterDiv.appendChild(sel);
    }

    showImages(data, activeFilters);
}

function showImages(data, filters) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    const filtered = data.filter(img => {
        return Object.entries(filters).every(([cat, val]) => !val || img.tags[cat] === val);
    });

    filtered.forEach(img => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `<img src="/backend/uploads/${img.filename}" alt="">`;
        gallery.appendChild(div);
    });
}

// Load galleri på start
loadGallery();
