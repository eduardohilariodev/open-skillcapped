const { contextBridge, ipcRenderer } = require("electron");
// const ffmpeg = require("fluent-ffmpeg");
// const ffmpegPath = require("ffmpeg-static");
// const temp = require("temp");
// const fs = require("fs");
// const path = require("path");

// temp.track();
// ffmpeg.setFfmpegPath(ffmpegPath);

contextBridge.exposeInMainWorld("converter", {
  convertToMp4: async (tsBuffer) => {
    return ipcRenderer.invoke("convert-video", tsBuffer);
  },
});

// Add API needed for better-skill-capped React app
contextBridge.exposeInMainWorld("electronAPI", {
  platform: process.platform,
  // Add any additional APIs needed for the React app
  saveFile: async (options) => {
    return ipcRenderer.invoke("show-save-dialog", options);
  },
  openExternal: (url) => {
    ipcRenderer.send("open-external", url);
  },
  getVersion: () => {
    return process.env.npm_package_version || "1.0.0";
  },
});
