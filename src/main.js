const { app, BrowserWindow, dialog, ipcMain, Menu } = require("electron");
const path = require("node:path");
const fs = require("fs");
const { updateElectronApp } = require("update-electron-app");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const temp = require("temp");

temp.track(); // Initialize temp
ffmpeg.setFfmpegPath(ffmpegPath); // Set ffmpeg path

const createWindow = () => {
  updateElectronApp();

  const preloadPath = path.join(__dirname, "preload.js");
  const iconPath = path.join(
    __dirname,
    "..",
    "assets",
    process.platform === "win32" ? "icon.ico" : "icon.png"
  );

  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 1000,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      webSecurity: true,
    },
    resizable: true,
    icon: iconPath,
  });

  mainWindow.webContents.openDevTools();

  // Determine if running in development based on an environment variable or similar
  // You might need to adjust how 'isDev' is set based on your environment setup
  // e.g., using process.env.NODE_ENV or electron-is-dev package
  const isDev = !app.isPackaged; // A common way to check

  Menu.setApplicationMenu(null);

  mainWindow.webContents.session.webRequest.onBeforeSendHeaders(
    (details, callback) => {
      callback({ requestHeaders: { Origin: "*", ...details.requestHeaders } });
    }
  );

  mainWindow.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription) => {
      console.error("Failed to load:", errorCode, errorDescription);
    }
  );

  // Check if running in development or production
  if (isDev) {
    // Development: Load from Vite dev server
    mainWindow.loadURL("http://localhost:5173"); // Default Vite port, adjust if needed
    mainWindow.webContents.openDevTools(); // Open DevTools automatically in dev
  } else {
    // Production: Load the built index.html file
    const reactAppPath = path.join(__dirname, "..", "dist", "index.html");
    mainWindow.loadFile(reactAppPath);
    // Removed the fallback path logic as it's handled by the dev server now
    // const fallbackPath = path.join(__dirname, "renderer", "index.html");
    // if (fs.existsSync(reactAppPath)) {
    //   mainWindow.loadFile(reactAppPath);
    // } else {
    //   mainWindow.loadFile(fallbackPath);
    // }
  }
};

ipcMain.handle("show-save-dialog", async () => {
  const options = {
    title: "Save Video As",
    defaultPath: path.join(app.getPath("downloads"), "video.mp4"),
    filters: [{ name: "MP4 Videos", extensions: ["mp4"] }],
  };

  return dialog.showSaveDialog(options);
});

// Add IPC handler for video conversion
ipcMain.handle("convert-video", async (event, tsBuffer) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await dialog.showSaveDialog({
        title: "Save Video As",
        defaultPath: path.join(app.getPath("downloads"), "video.mp4"),
        filters: [{ name: "MP4 Videos", extensions: ["mp4"] }],
      });

      if (result.canceled) {
        resolve({ canceled: true });
        return;
      }

      const tempFile = temp.path({ suffix: ".ts" });
      fs.writeFileSync(tempFile, Buffer.from(tsBuffer));

      const outputPath = result.filePath;

      ffmpeg(tempFile)
        .outputOptions("-c:v", "copy", "-c:a", "copy")
        .save(outputPath)
        .on("end", () => {
          resolve({ canceled: false, filePath: outputPath });
          temp.cleanupSync(); // Clean up temp file
        })
        .on("error", (err) => {
          reject(new Error(`Error converting video: ${err.message}`));
          temp.cleanupSync(); // Clean up temp file on error
        });
    } catch (err) {
      reject(new Error(`Error in conversion process: ${err.message}`));
    }
  });
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
