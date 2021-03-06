import express   from 'express'
import utils     from '../utils.js'
const router   = express.Router();
import database  from './db.js'

router.post('/register', (request, response) => {
    if(!request.body || !request.body.username || !request.body.password || !request.body.name) {
        response.json({
            'status': 'failed',
            'message': 'Request missing username or password!'
        })

        return
    }

    let username = request.body.username;
    let password = request.body.password;
    let name     = request.body.name;

    if(database[username]) {
        response.json({
            'status': 'failed',
            'message': `Username ${username} already exists`
        })

        return
    }


    database[username] = {
        'password': password,
        'name': name,
        'id': utils.randomBase64URLBuffer()
    }

    request.session.loggedIn = true;
    request.session.username = username

    response.json({
        'status': 'ok'
    })
})

router.post('/login', (request, response) => {
    if(!request.body || !request.body.username || !request.body.password) {
        response.json({
            'status': 'failed',
            'message': 'Request missing username or password!'
        });

        return
    }

    let username = request.body.username;
    let password = request.body.password;

    if(!database[username] || database[username].password !== password) {
        response.json({
            'status': 'failed',
            'message': `Wrong username or password!`
        });

        return
    }

    request.session.loggedIn = true;
    request.session.username = username

    response.json({
        'status': 'ok'
    })
})

export default router;
