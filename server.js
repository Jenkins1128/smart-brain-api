const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		user: 'isaiahjenkins',
		password: '',
		database: 'smart-brain'
	}
});

app.use(express.json());
app.use(cors());

app.post('/signin', (req, res) => signin.handleSignin(req, res, db, bcrypt));

app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt));

app.get('/profile/:id', (req, res) => profile.handleProfileGet(req, res));

app.put('/image', (req, res) => image.handleImage(req, res, db));

app.listen(3000, () => {
	console.log('app is running on port 3000');
});

/*
/ --> res = this is working
/sign in --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*/
