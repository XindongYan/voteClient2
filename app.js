const Koa = require('koa');
const cors = require('koa2-cors');
const path = require('path');
const gzip = require('koa-gzip');

const { createReadStream } = require('fs');

const app = new Koa();

app.use(cors());
app.use(gzip());
app.use(require('koa-static')(path.join(__dirname, '/dist')));

app.listen(2100);
('start port 2100');