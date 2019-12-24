import http from 'http';
import buildTables from './schema/build-tables';

const hostname = '127.0.0.1';
const port = 3000;

const pg = require('knex')({
  client: 'pg',
  connection: 'postgresql://localhost:5432/lang_builder',
});

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  buildTables(pg);
});