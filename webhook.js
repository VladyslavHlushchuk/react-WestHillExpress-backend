const http = require('http');
const crypto = require('crypto');
const { exec } = require('child_process');

const SECRET = 'mysecret123';

const verifySignature = (req, body) => {
  const signature = req.headers['x-hub-signature-256'];
  const hmac = crypto.createHmac('sha256', SECRET);
  const digest = 'sha256=' + hmac.update(body).digest('hex');
  return signature === digest;
};

const server = http.createServer((req, res) => {
  if (req.method !== 'POST' || req.url !== '/webhook') {
    res.writeHead(405);
    return res.end('Method Not Allowed');
  }

  let body = '';
  req.on('data', chunk => (body += chunk));
  req.on('end', () => {
    if (!verifySignature(req, body)) {
      res.writeHead(403);
      return res.end('Invalid signature');
    }

    exec('/root/deploy.sh', (err, stdout, stderr) => {
      if (err) {
        console.error('Deploy error:', stderr);
        res.writeHead(500);
        return res.end('Deploy failed');
      }

      console.log('✅ Deploy executed:', stdout);
      res.writeHead(200);
      res.end('Deployed!');
    });
  });
});

server.listen(3001, () => {
  console.log('Webhook server listening on port 3001');
});
