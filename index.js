// ======================================================================== 
// Server init
// ========================================================================

// Filesystem reading functions
const fs = require('fs-extra');

// Load settings
try {
	stats = fs.lstatSync('settings.json');
} catch (e) {
	// If settings do not yet exist
	if (e.code == "ENOENT") {
		try {
			fs.copySync('settings.example.json', 'settings.json');
			console.log("Created new settings file.");
		} catch(e) {
			console.log(e);
			throw "Could not create new settings file.";
		}
	// Else, there was a misc error (permissions?)
	} else {
		console.log(e);
		throw "Could not read 'settings.json'.";
	}
}

// Load settings into memory
const settings = require("./settings.json");

// Setup basic express server
const express = require('express');
const app = express();
if (settings.express.serveStatic)
	app.use(express.static('./build/www'));
const server = require('http').createServer(app);

// Init socket.io
const io = require('socket.io')(server);
const port = process.env.PORT || settings.port;

exports.io = io;

// Init sanitize-html
const sanitize = require('sanitize-html');

// Init winston loggers
const Log = require('./log.js');
Log.init();
const log = Log.log;

// Load ban list
const Ban = require('./ban.js');
Ban.init();

// Start actually listening
server.listen(port, function () {
	console.log(
		" Welcome to BonziWORLD!\n",
		"Time to meme!\n",
		"----------------------\n",
		"Server listening at port " + port
	);
});

app.use(express.static(__dirname + '/public'));

// ========================================================================
// Banning & Flood Protection
// ========================================================================

const Utils = require("./utils.js");

// --- Flood protection variables ---
const ipEventCount = new Map(); // IP -> number of events
const WINDOW_MS = 1000; // 1 second window
const MAX_EVENTS = 15;  // Max socket events per IP per window

// Reset event counts every second
setInterval(() => ipEventCount.clear(), WINDOW_MS);

// Get real IP helper
function getIP(socket) {
	if (!socket) return "unknown";
	try {
		if (socket.handshake && socket.handshake.headers["x-forwarded-for"])
			return socket.handshake.headers["x-forwarded-for"].split(",")[0].trim();
		if (socket.handshake && socket.handshake.address)
			return socket.handshake.address;
		if (socket.conn && socket.conn.remoteAddress)
			return socket.conn.remoteAddress;
	} catch (e) {}
	return "unknown";
}

// ========================================================================
// The Beef(TM)
// ========================================================================

const Meat = require("./meat.js");
Meat.beat();

// ========================================================================
// Socket Flood Detection Middleware
// ========================================================================

io.on("connection", (socket) => {
	const ip = getIP(socket);

	// Check for bans
	if (Ban.isBanned(ip)) {
		log(`[DENY] Banned IP tried to connect: ${ip}`);
		socket.disconnect(true);
		return;
	}

	// Intercept every event to count traffic
	if (typeof socket.use === "function") {
		socket.use((packet, next) => {
			const count = (ipEventCount.get(ip) || 0) + 1;
			ipEventCount.set(ip, count);

			if (count > MAX_EVENTS) {
				log(`[FLOOD] ${ip} exceeded rate limit (${count})`);
				try {
					Ban.add(ip, "Auto-ban: flooding");
					log(`[BAN] ${ip} added to ban list.`);
				} catch (e) {
					log(`[WARN] Failed to add ban for ${ip}: ${e}`);
				}
				socket.disconnect(true);
				return;
			}
			next();
		});
	}

	log(`[CONNECT] ${ip} connected (id=${socket.id})`);

	socket.on("disconnect", (reason) => {
		ipEventCount.delete(ip);
		log(`[DISCONNECT] ${ip} disconnected: ${reason}`);
	});
});

// ========================================================================
// Console commands
// ========================================================================

const Console = require('./console.js');
Console.listen();
