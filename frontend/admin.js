const form = document.getElementById('uploadForm');

form.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(form);

    try {
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const result = await res.json();
        if(result.success){
            alert('Upload succesfuld!');
            form.reset();
        } else {
            alert('Upload fejlede: ' + (result.msg || ''));
        }
    } catch(err){
        alert('Fejl ved upload: ' + err.message);
    }
});
