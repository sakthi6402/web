const http = require('http');
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const port = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/ats-resume-complete.html';
  const filePath = path.join(root, reqPath.replace(/^\//, ''));

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.txt': 'text/plain',
      '.ico': 'image/x-icon'
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, {'Content-Type': contentType});
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(port, () => console.log(`Static server listening on http://localhost:${port}`));

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => process.exit(0));
});