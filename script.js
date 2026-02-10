// Update color codes when color pickers change
document.getElementById('primary-color').addEventListener('input', function() {
    document.getElementById('primary-code').textContent = this.value;
});

document.getElementById('secondary-color').addEventListener('input', function() {
    document.getElementById('secondary-code').textContent = this.value;
});

document.getElementById('accent-color').addEventListener('input', function() {
    document.getElementById('accent-code').textContent = this.value;
});

// Handle logo upload
document.getElementById('logo-upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const logoDiv = document.getElementById('client-logo');
            logoDiv.style.backgroundImage = `url(${e.target.result})`;
            logoDiv.style.backgroundSize = 'contain';
            logoDiv.style.backgroundRepeat = 'no-repeat';
            logoDiv.style.backgroundPosition = 'center';
            logoDiv.textContent = ''; // Remove placeholder text
            logoDiv.dataset.logoData = e.target.result; // Store data URL
        };
        reader.readAsDataURL(file);
    }
});

// Load website preview
document.getElementById('load-preview')?.addEventListener('click', function() {
    const url = document.getElementById('preview-url').value;
    if (url) {
        document.getElementById('website-preview').src = url;
    }
});

// Save client data
document.getElementById('save-client').addEventListener('click', function() {
    let clientName = document.querySelector('.editable').textContent.trim().toUpperCase();
    document.querySelector('.editable').textContent = clientName;
    
    if (!clientName) {
        alert('Please enter a client name.');
        return;
    }

    const data = {
        name: clientName,
        logo: document.getElementById('client-logo').dataset.logoData || '',
        primaryColor: document.getElementById('primary-color').value,
        secondaryColor: document.getElementById('secondary-color').value,
        accentColor: document.getElementById('accent-color').value,
        notes: document.querySelector('textarea').value,
        checklist: Array.from(document.querySelectorAll('input[type="checkbox"]')).map(cb => cb.checked)
    };

    localStorage.setItem(clientName, JSON.stringify(data));
    updateClientList();
    alert('Client saved!');
});

// Load client data
document.getElementById('load-client').addEventListener('change', function() {
    const clientName = this.value;
    if (!clientName) return;

    const data = JSON.parse(localStorage.getItem(clientName));
    if (data) {
        document.querySelector('.editable').textContent = data.name;
        const logoDiv = document.getElementById('client-logo');
        if (data.logo) {
            logoDiv.style.backgroundImage = `url(${data.logo})`;
            logoDiv.style.backgroundSize = 'contain';
            logoDiv.style.backgroundRepeat = 'no-repeat';
            logoDiv.style.backgroundPosition = 'center';
            logoDiv.textContent = '';
            logoDiv.dataset.logoData = data.logo;
        } else {
            logoDiv.style.backgroundImage = '';
            logoDiv.textContent = 'Logo Placeholder';
            logoDiv.dataset.logoData = '';
        }
        document.getElementById('primary-color').value = data.primaryColor;
        document.getElementById('primary-code').textContent = data.primaryColor;
        document.getElementById('secondary-color').value = data.secondaryColor;
        document.getElementById('secondary-code').textContent = data.secondaryColor;
        document.getElementById('accent-color').value = data.accentColor;
        document.getElementById('accent-code').textContent = data.accentColor;
        document.querySelector('textarea').value = data.notes;
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        data.checklist.forEach((checked, index) => {
            if (checkboxes[index]) checkboxes[index].checked = checked;
        });
    }
});

// New client
document.getElementById('new-client').addEventListener('click', function() {
    document.querySelector('.editable').textContent = 'CLIENT NAME HERE';
    const logoDiv = document.getElementById('client-logo');
    logoDiv.style.backgroundImage = '';
    logoDiv.textContent = 'Logo Placeholder';
    logoDiv.dataset.logoData = '';
    document.getElementById('primary-color').value = '#007bff';
    document.getElementById('primary-code').textContent = '#007bff';
    document.getElementById('secondary-color').value = '#6c757d';
    document.getElementById('secondary-code').textContent = '#6c757d';
    document.getElementById('accent-color').value = '#ffc107';
    document.getElementById('accent-code').textContent = '#ffc107';
    document.querySelector('textarea').value = '';
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.getElementById('preview-url').value = '';
    document.getElementById('website-preview').src = 'about:blank';
    document.getElementById('load-client').value = '';
});

// Initialize
updateClientList();

// Auto-load home page preview on page load
window.addEventListener('DOMContentLoaded', function() {
    document.getElementById('website-preview').src = 'https://www.drramkishannag.com';
});