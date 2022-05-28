import express        from 'express'
import bodyParser     from 'body-parser'
import cookieSession  from 'cookie-session'
import cookieParser   from 'cookie-parser'
import urllib         from 'url'
import path           from 'path'
import crypto         from 'crypto'

import config         from './config.js'
import defaultroutes  from './routes/default.js'
import passwordauth   from './routes/password.js'
import webuathnauth   from './routes/webauthn.js'

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app           = express();

app.use(bodyParser.json());

/* ----- session ----- */
app.use(cookieSession({
  name: 'session',
  keys: [crypto.randomBytes(32).toString('hex')],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
app.use(cookieParser())

/* ----- serve static ----- */
app.use(express.static(path.join(__dirname, 'static')));

app.use('/', defaultroutes)
app.use('/password', passwordauth)
app.use('/webauthn', webuathnauth)

const port = config.port || 3000;
app.listen(port);
console.log(`Started app on port ${port}`);

export default app;
