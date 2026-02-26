// Apply brand colors to entire dashboard dynamically
function applyBrandColors(primaryColor, secondaryColor, accentColor) {
    const root = document.documentElement;
    // Update CSS variables to theme the entire page
    root.style.setProperty('--color-primary', primaryColor);
    root.style.setProperty('--color-secondary', secondaryColor);
    root.style.setProperty('--color-accent', accentColor);
    
    // Calculate lighter shades for backgrounds
    root.style.setProperty('--color-primary-light', hexToRgba(primaryColor, 0.1));
    root.style.setProperty('--color-secondary-light', hexToRgba(secondaryColor, 0.05));
}

// Convert hex color to RGBA for transparency effects
function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Update color codes and apply theme when color pickers change
['primary-color','secondary-color','accent-color'].forEach(id => {
    const inp = document.getElementById(id);
    if (!inp) return;
    inp.addEventListener('input', function() {
        document.getElementById(`${id.split('-')[0]}-code`).textContent = this.value;
        refreshHeader();
        // Apply brand colors in real-time
        const primary = document.getElementById('primary-color').value;
        const secondary = document.getElementById('secondary-color').value;
        const accent = document.getElementById('accent-color').value;
        applyBrandColors(primary, secondary, accent);
    });
});

// update header when client name edited
const nameDisplay = document.querySelector('.client-name-display');
nameDisplay.addEventListener('blur', refreshHeader);

// utility: refresh load-client dropdown based on localStorage
function updateClientList() {
    const select = document.getElementById('load-client');
    if (!select) return;
    select.innerHTML = '<option value="">Load Client</option>';
    // show saved clients sorted alphabetically
    Object.keys(localStorage)
        .filter(key => key) // ignore empty keys
        .sort()
        .forEach(key => {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = key;
            select.appendChild(opt);
        });
}

// update header display and swatches when name or colors change
function refreshHeader() {
    const nameEl = document.querySelector('.client-name-display');
    const header = document.querySelector('h1');
    const swatchContainer = document.querySelector('.swatches');
    const name = nameEl.textContent.trim();
    header.textContent = name ? `CLIENT: ${name}` : 'Client Dashboard';
    // regenerate color swatches from pickers
    if (swatchContainer) {
        swatchContainer.innerHTML = '';
        ['primary-color','secondary-color','accent-color'].forEach(id => {
            const inp = document.getElementById(id);
            if (inp) {
                const s = document.createElement('div');
                s.className = 'swatch';
                s.style.backgroundColor = inp.value;
                swatchContainer.appendChild(s);
            }
        });
    }
}

// file upload progress simulation
function simulateUpload(file) {
    const fill = document.querySelector('.progress-fill');
    const text = document.querySelector('.progress-text');
    if (!fill || !text) return;
    let pct = 0;
    const interval = setInterval(() => {
        pct += Math.random()*20;
        if (pct >= 100) {
            pct = 100;
            clearInterval(interval);
        }
        fill.style.width = pct + '%';
        text.textContent = Math.floor(pct) + '% complete';
    }, 200);
}

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

// Document upload simulation
const docInput = document.getElementById('doc-upload');
if (docInput) {
    docInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) simulateUpload(file);
    });
}

// Load website preview
const previewInfo = document.querySelector('.preview-info');
document.getElementById('load-preview')?.addEventListener('click', function() {
    const url = document.getElementById('preview-url').value.trim();
    if (url) {
        document.getElementById('website-preview').src = url;
        previewInfo.textContent = `Previewing ${url}`;
    } else {
        previewInfo.textContent = 'Enter a valid address to preview.';
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
    refreshHeader();
    // Apply the saved brand colors
    applyBrandColors(data.primaryColor, data.secondaryColor, data.accentColor);
    alert('Client saved successfully! Theme updated.');
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
        refreshHeader();
        // Apply the loaded brand colors to theme the dashboard
        applyBrandColors(data.primaryColor, data.secondaryColor, data.accentColor);
    }
});

// New client
document.getElementById('new-client').addEventListener('click', function() {
    document.querySelector('.editable').textContent = '';
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
    refreshHeader();
    // Apply default colors
    applyBrandColors('#007bff', '#6c757d', '#ffc107');
});

// Initialize
updateClientList();
refreshHeader();
// Apply initial brand colors
const initialPrimary = document.getElementById('primary-color').value;
const initialSecondary = document.getElementById('secondary-color').value;
const initialAccent = document.getElementById('accent-color').value;
applyBrandColors(initialPrimary, initialSecondary, initialAccent);

// Auto-load home page preview on page load (no default URL)
window.addEventListener('DOMContentLoaded', function() {
    // keep iframe blank until user enters an address
    document.getElementById('website-preview').src = 'about:blank';
});