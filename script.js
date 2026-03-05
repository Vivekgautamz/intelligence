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


// Notes section logic
const notesArea = document.getElementById('notes-area');
const editNotesBtn = document.getElementById('edit-notes');
const saveNotesBtn = document.getElementById('save-notes');
const deleteNotesBtn = document.getElementById('delete-notes');

editNotesBtn.addEventListener('click', () => {
    notesArea.disabled = false;
    notesArea.focus();
});

saveNotesBtn.addEventListener('click', () => {
    notesArea.disabled = true;
    localStorage.setItem('clientNotes', notesArea.value);
});

deleteNotesBtn.addEventListener('click', () => {
    notesArea.value = '';
    notesArea.disabled = true;
    localStorage.removeItem('clientNotes');
});

// Load saved notes on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedNotes = localStorage.getItem('clientNotes');
    if (savedNotes) notesArea.value = savedNotes;
    notesArea.disabled = true;
});

const docUpload = document.getElementById('doc-upload');
const uploadedFiles = document.getElementById('uploaded-files');

docUpload.addEventListener('change', (e) => {
    uploadedFiles.innerHTML = '';
    Array.from(e.target.files).forEach(file => {
        const div = document.createElement('div');
        div.textContent = file.name;
        uploadedFiles.appendChild(div);
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
docUpload.addEventListener('change', (e) => {
    uploadedFiles.innerHTML = '';
    Array.from(e.target.files).forEach(file => {
        const div = document.createElement('div');
        div.textContent = file.name;
        uploadedFiles.appendChild(div);
    });
});

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
    window.open(window.location.pathname, '_blank');
});

// Save Client: Save all relevant data to localStorage (or backend if available)
document.getElementById('save-client').addEventListener('click', function() {
    const clientData = {
        name: document.querySelector('.client-name-display').textContent,
        notes: notesArea.value,
        // Add more fields as needed
    };
    localStorage.setItem('clientData', JSON.stringify(clientData));
    alert('Client data saved!');
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

function createChecklistItem(text = '', checked = false) {
    const li = document.createElement('li');
    li.style.position = 'relative';
    li.innerHTML = `
        <label>
            <input type="checkbox" ${checked ? 'checked' : ''}>
            <span class="checklist-text" contenteditable="false">${text}</span>
        </label>
        <button class="checklist-menu">⋮</button>
        <div class="checklist-dropdown" style="display:none;">
            <button class="edit-item">Edit</button>
            <button class="delete-item">Delete</button>
            <button class="insert-item">Insert Below</button>
        </div>
    `;
    return li;
}

function setupChecklistEvents(ul) {
    ul.addEventListener('click', function(e) {
        if (e.target.classList.contains('checklist-menu')) {
            const dropdown = e.target.nextElementSibling;
            document.querySelectorAll('.checklist-dropdown').forEach(d => d.style.display = 'none');
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        } else if (e.target.classList.contains('edit-item')) {
            const li = e.target.closest('li');
            const span = li.querySelector('.checklist-text');
            span.contentEditable = true;
            span.focus();
            e.target.closest('.checklist-dropdown').style.display = 'none';
        } else if (e.target.classList.contains('delete-item')) {
            const li = e.target.closest('li');
            li.remove();
        } else if (e.target.classList.contains('insert-item')) {
            const li = e.target.closest('li');
            const newLi = createChecklistItem('New Task', false);
            li.after(newLi);
            setupChecklistEventsForItem(newLi);
            e.target.closest('.checklist-dropdown').style.display = 'none';
        }
    });
    ul.addEventListener('blur', function(e) {
        if (e.target.classList.contains('checklist-text')) {
            e.target.contentEditable = false;
        }
    }, true);
}

function setupChecklistEventsForItem(li) {
    li.querySelector('.checklist-menu').addEventListener('click', function(e) {
        const dropdown = li.querySelector('.checklist-dropdown');
        document.querySelectorAll('.checklist-dropdown').forEach(d => d.style.display = 'none');
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        e.stopPropagation();
    });
    li.querySelector('.edit-item').addEventListener('click', function() {
        const span = li.querySelector('.checklist-text');
        span.contentEditable = true;
        span.focus();
        li.querySelector('.checklist-dropdown').style.display = 'none';
    });
    li.querySelector('.delete-item').addEventListener('click', function() {
        li.remove();
    });
    li.querySelector('.insert-item').addEventListener('click', function() {
        const newLi = createChecklistItem('New Task', false);
        li.after(newLi);
        setupChecklistEventsForItem(newLi);
        li.querySelector('.checklist-dropdown').style.display = 'none';
    });
    li.querySelector('.checklist-text').addEventListener('blur', function(e) {
        e.target.contentEditable = false;
    });
}

document.querySelectorAll('ul[id^="checklist"]').forEach(ul => {
    setupChecklistEvents(ul);
    ul.querySelectorAll('li').forEach(setupChecklistEventsForItem);
});

document.getElementById('add-checklist-item').addEventListener('click', function() {
    const ul = document.getElementById('checklist-initial');
    const li = createChecklistItem('New Task', false);
    ul.appendChild(li);
    setupChecklistEventsForItem(li);
});
