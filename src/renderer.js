const dropZone = document.getElementById('dropZone');
const browseBtn = document.getElementById('browseBtn');
const queueDiv = document.getElementById('queue');
const startBtn = document.getElementById('startBtn');
const selectOutputBtn = document.getElementById('selectOutput');
const outputText = document.getElementById('outputPath');

let queue = [];
let outputFolder = null;

const updateStartButton = () => {
    startBtn.disabled = queue.length === 0 || !outputFolder;
};

// CLICK → open file dialog
const handleSelectFiles = async () => {
    const paths = await window.api.selectFiles();
    if (!paths) return;
    paths.forEach(p => addToQueue(p));
};

dropZone.addEventListener('click', (e) => {
    if (e.target !== browseBtn) handleSelectFiles();
});

browseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    handleSelectFiles();
});

// Select output folder
selectOutputBtn.addEventListener('click', async () => {
    const folder = await window.api.selectOutput();
    if (folder) {
        outputFolder = folder;
        outputText.textContent = folder;
        updateStartButton();
    }
});

// Drag-drop
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const files = [...e.dataTransfer.files];
    files.forEach(file => {
        if (file.path && file.path.toLowerCase().endsWith('.chd')) {
            addToQueue(file.path);
        }
    });
});

function addToQueue(filePath) {
    if (queue.some(item => item.path === filePath)) return; // Avoid duplicates
    
    queue.push({
        path: filePath,
        status: 'queued',
        log: ''
    });

    renderQueue();
    updateStartButton();
}

function renderQueue() {
    queueDiv.innerHTML = '';

    queue.forEach(item => {
        const fileName = item.path.split(/[\\/]/).pop();
        const div = document.createElement('div');
        div.className = 'queue-item';

        div.innerHTML = `
            <div class="item-info">
                <span class="file-name" title="${item.path}">${fileName}</span>
                <span class="status ${item.status}">${item.status}</span>
            </div>
            ${item.log ? `<div class="log">${item.log}</div>` : ''}
        `;

        queueDiv.appendChild(div);
    });
}

// START conversion
startBtn.addEventListener('click', async () => {
    if (!outputFolder) return;

    startBtn.disabled = true;
    
    for (let item of queue) {
        if (item.status === 'done') continue;

        item.status = 'processing';
        renderQueue();

        try {
            await window.api.convertSingle({
                input: item.path,
                outputFolder
            }, (msg) => {
                item.log += msg + '\n';
                renderQueue();
            });

            item.status = 'done';
        } catch (err) {
            item.status = 'error';
            item.log += `ERROR: ${err.message}`;
        }

        renderQueue();
    }
    
    updateStartButton();
});