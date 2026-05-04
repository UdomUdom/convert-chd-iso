const dropZone = document.getElementById('dropZone');
const queueDiv = document.getElementById('queue');
const startBtn = document.getElementById('startBtn');
const selectOutputBtn = document.getElementById('selectOutput');
const outputText = document.getElementById('outputPath');

let queue = [];
let outputFolder = null;

// CLICK → open file dialog
dropZone.addEventListener('click', async () => {
    const paths = await window.api.selectFiles();
    if (!paths) return;

    paths.forEach(p => addToQueue(p));
});

// Select output folder
selectOutputBtn.addEventListener('click', async () => {
    const folder = await window.api.selectOutput();
    if (folder) {
        outputFolder = folder;
        outputText.textContent = folder;
    }
});

// Drag-drop (optional, may still fail depending on env)
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
        if (file.path && file.name.endsWith('.chd')) {
            addToQueue(file.path);
        }
    });
});

function addToQueue(filePath) {
    queue.push({
        path: filePath,
        status: 'queued',
        log: ''
    });

    renderQueue();
}

function renderQueue() {
    queueDiv.innerHTML = '';

    queue.forEach(item => {
        const div = document.createElement('div');
        div.className = 'queue-item';

        div.innerHTML = `
      <div>
        ${item.path}
        <span class="status ${item.status}">
          ${item.status.toUpperCase()}
        </span>
      </div>
      <div class="log">${item.log}</div>
    `;

        queueDiv.appendChild(div);
    });
}

// START conversion
startBtn.addEventListener('click', async () => {
    if (!outputFolder) {
        alert('Please select output folder first');
        return;
    }

    for (let item of queue) {
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
            item.log += err.message;
        }

        renderQueue();
    }
});