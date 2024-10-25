const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const port = process.env.PORT || 3000;

// Function to extract the tunnelToken from the request URL
function extractToken(req) {
  // Assuming URL pattern is "/:tunnelToken/proxy/*"
  const match = req.url.match(/\/([^\/]+)\/proxy/);
  return match ? match[1] : null;
}
// Create a single instance of createProxyMiddleware
const apiProxy = createProxyMiddleware({
  target:
    "https://l7srq4mnqdnc-dc118956-dcbb-4fae-b4ef-0a8390fe1256.tunnel.runloop.ai",
  changeOrigin: true,
  pathRewrite: {
    // Rewrite the path to remove '/:tunnelToken/proxy/' and keep everything after
    "^/[^/]+/proxy/(.*)$": "/$1",
  },
  ws: true, // Enable WebSocket proxying
  toProxy: true, // Enable the proxy to be used in a reverse proxy
  onError: (err, req, res) => {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy error");
  },
  router: (req) => {
    const tunnelToken = extractToken(req);
    if (!tunnelToken) {
      console.error("Failed to extract tunnelToken from URL:", req.url);
      return null;
    }
    return `https://${tunnelToken}.tunnel.runloop.ai`;
  },
});

// Apply middleware for the API path
// app.use("/:tunnelToken/proxy", apiProxy);
//app.use("/:tunnelToken/proxy/*", apiProxy);
const apiProxySimple = createProxyMiddleware({
  target:
    "https://zdj8yeshcf7z-dc118956-dcbb-4fae-b4ef-0a8390fe1256.tunnel.runloop.ai",
  changeOrigin: true,
  ws: true, // Enable WebSocket proxying
  //toProxy: true, // Enable the proxy to be used in a reverse proxy
  onError: (err, req, res) => {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy error");
  },
});
// This will handle HTTP GET requests to any path
app.use("/*", apiProxySimple);

// This will handle HTTP GET requests to any path
app.get("/health", (req, res) => {
  res.send("Super healthy");
});

// Start the server
app.listen(port, () => {
  console.log(`Proxy server listening on http://localhost:${port}`);
});
