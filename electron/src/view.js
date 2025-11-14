const electron = require("electron");
const { BrowserView } = electron; // https://www.electronjs.org/docs/api/browser-view

exports.createBrowserView = (mainWindow) => {
  const view = new BrowserView();
  mainWindow.setBrowserView(view);
  view.setBounds({ x: 0, y: 0, width: 1024, height: 768 });
  // SECURITY: Use environment variable instead of hardcoded URL
  const appUrl = process.env.TELEDRIVE_URL || "http://localhost:3000/startup";
  view.webContents.loadURL(appUrl);
};
