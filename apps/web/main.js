const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const http = require("http");

let mainWindow;
let nextServer;
const PORT = 3000;

function checkServerReady(url) {
    return new Promise((resolve) => {
        const check = () => {
            http.get(url, (res) => {
                if (res.statusCode === 200 || res.statusCode === 302) {
                    resolve(true);
                } else {
                    setTimeout(check, 100);
                }
            }).on("error", () => {
                setTimeout(check, 100);
            });
        };
        check();
    });
}

async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
        title: "OpenCut",
        show: false,
    });

    const serverUrl = `http://localhost:${PORT}`;
    await checkServerReady(serverUrl);

    mainWindow.loadURL(serverUrl);
    mainWindow.show();
}

function startNextServer() {
    const isDev = !app.isPackaged;

    if (isDev) {
        // Development: use bun dev
        nextServer = spawn("bun", ["run", "dev"], {
            cwd: __dirname,
            shell: true,
            stdio: "inherit",
        });
    } else {
        // Production: run the standalone server
        const standalonePath = path.join(process.resourcesPath, "app", ".next", "standalone");
        const serverPath = path.join(standalonePath, "server.js");
        
        console.log("Starting server from:", serverPath);
        
        nextServer = spawn(process.execPath, [serverPath], {
            cwd: standalonePath,
            stdio: "inherit",
            env: { ...process.env, PORT: PORT.toString() },
        });
    }
}

app.whenReady().then(() => {
    startNextServer();
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (nextServer) {
        nextServer.kill();
    }
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("before-quit", () => {
    if (nextServer) {
        nextServer.kill();
    }
});
