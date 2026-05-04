# CHD → ISO Converter (Desktop GUI)

A simple desktop GUI built with Electron for converting `.chd` files to `.iso` using CHDMan.

This tool is designed for users who don’t want to deal with command-line usage or batch scripts.

---

## Features

- Easy-to-use graphical interface
- Click or drag-and-drop `.chd` files
- Select custom output folder
- Conversion queue system
- Real-time conversion logs
- Status indicators (Queued / Processing / Done / Error)
- Dark retro console-style UI

---

## Tech Stack

- Electron
- HTML / CSS / JavaScript (no frameworks)
- Node.js `child_process` (for running `chdman.exe`)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/UdomUdom/convert-chd-iso
cd convert-chd-iso
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Add CHDMan

Download `chdman.exe` and place it inside:

```
/tools/chdman.exe
```

---

### 4. Run the app

```bash
npm start
```

---

## Usage

1. Launch the application
2. Click or drag `.chd` files into the window
3. Select an output folder
4. Click **Start Conversion**
5. Wait for completion — `.iso` files will be generated

---

## ⚠️ Notes

- This app is a wrapper around `chdman.exe` and does not implement conversion logic itself
- Make sure `chdman.exe` is present in the `/tools` directory
- Only `.chd` files are supported
