// In your Next.js project (server.ts or index.ts)
import { createServer, IncomingMessage } from 'http';
import { parse, UrlWithParsedQuery } from 'url';
import { RequestListener } from 'http';

const server: RequestListener = (req, res) => {
  const parsedUrl = parse(req.url!, true);
  const { pathname } = parsedUrl;

  if (pathname === '/slarra') {
    // Handle request to /slarra here
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World');
  } else {
    // For all other routes, let Next.js handle them
    // You can also proxy these requests to your backend if needed
    handle(req, res, parsedUrl);
  }
};

createServer(server).listen(3000, (err?: Error) => {
  if (err) throw err;
  console.log('> Ready on http://localhost:3000');
});

function handle(req: IncomingMessage, res: import("http").ServerResponse<import("http").IncomingMessage> & { req: import("http").IncomingMessage; }, parsedUrl: UrlWithParsedQuery) {
  throw new Error('Function not implemented.');
}
