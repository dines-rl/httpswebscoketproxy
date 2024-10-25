const express = require("express");
const httpProxy = require("http-proxy");

const app = express();
const port = process.env.PORT || 3000;

// Create a proxy server with http-proxy
const proxy = httpProxy.createProxyServer({
  target:
    "https://x7xejlw7ppim-dc118956-dcbb-4fae-b4ef-0a8390fe1256.tunnel.runloop.ai",
  changeOrigin: true,
  ws: true, // Enable WebSocket proxying
  //forward: true,
  //prependPath: true,
  //toProxy: true,
});

proxy.on("error", (err, req, res) => {
  console.error("Proxy error:", err);
  res.status(500).send("Error in proxy operation");
});

// Proxy all requests
app.use((req, res) => {
  proxy.web(req, res);
});

// Optionally handle WebSocket requests
app.on("upgrade", (req, socket, head) => {
  proxy.ws(req, socket, head);
});

// Health check route
app.get("/health", (req, res) => {
  res.send("Server is healthy");
});

// Start the server
app.listen(port, () => {
  console.log(`Proxy server listening on http://localhost:${port}`);
});
