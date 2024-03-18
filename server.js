const express = require('express');
const expressWs = require('express-ws')(express());
const puppeteer = require('puppeteer');
const WebSocket = require('ws');

const app = expressWs.app;
const port = 80;

const connectToChromium = async () => {
    const browser = await puppeteer.launch({
	headless: true,
	args: [
	    '--no-sandbox',
	    '--disable-setuid-sandbox'
	]
    });

    const browserWSEndpoint = browser.wsEndpoint();

    console.log(browserWSEndpoint);

    return [new WebSocket(browserWSEndpoint), browser];
}

const authenticateWebSocket = async (ws, req, next) => {
    const authToken = "2bdc412a-64d9-45aa-977d-cd30554be99c";

    try {
	const url = new URL(req.url, `ws://${req.headers.host}`);
	const token = url.searchParams.get('token');

	if (token === authToken) {
	    console.log('Logged in');
	    next();
	} else {
	    ws.close(1008, 'Unauthorize');
	}
    } catch (error) {
	console.error("Error during WebSocket authentication: ", error);
	ws.close(1011, 'Internal Server Error');
    }
}

app.ws('/chromium', authenticateWebSocket, async (ws, req) => {
    const [chromiumWs, chromiumBrowser] = await connectToChromium();

    chromiumWs.on('open', () => {
	console.log('chromiumWS open');
    });

    chromiumWs.on('message', (message) => {
	const messageObj = JSON.parse(message.toString());
	console.log('chromium', messageObj);
	ws.send(JSON.stringify(messageObj));
    });

    chromiumWs.on('error', () => {
	console.error('chromiumWS error: ', error);
	chromiumBrowser.close();
    });

    chromiumWs.on('close', () => {
	console.log('chromiumWs close');
	chromiumBrowser.close();
    });

    ws.on('message', (message) => {
	console.log('ws', message);
	chromiumWs.send(message);
    });

    ws.on('error', () => {
	console.error('ws error: ', error);
	chromiumBrowser.close();
	chromiumWs.close();
    });

    ws.on('close', () => {
	console.log('ws close');
	chromiumBrowser.close();
	chromiumWs.close();
    });
});

app.listen(port, () => {
    console.log("Proxy server running on ws://localhost/chromium");
});
