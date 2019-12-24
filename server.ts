import path from 'path'
import express from 'express'

import buildTables from './schema/build-tables'

const app = express()
const port = 3000

const options = process.argv.slice(2)

const pg = require('knex')({
  client: 'pg',
  connection: 'postgresql://localhost:5432/lang_builder',
});
console.log(__dirname)
app.use(express.static(path.join(__dirname, 'dist/')));

app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
})

if (options[0] === '--setup') {
  buildTables(pg)
} else {
  app.listen(port, err => {
    if (err) {
      console.log('LANG_BUILDER: ', err)
    }
    console.log(`LANG_BUILDER: server listening on ${port}`)
  });
}
