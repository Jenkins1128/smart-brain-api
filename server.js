const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

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

app.post('/signin', (req, res) => {
	db.select('email', 'hash')
		.where('email', '=', req.body.email)
		.from('login')
		.then((data) => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
			if (isValid) {
				return db
					.select('*')
					.from('users')
					.where('email', '=', req.body.email)
					.then((user) => {
						res.json(user[0]);
					})
					.catch((err) => res.status(400).json('unable to get user'));
			} else {
				res.status(400).json('wrong credentials');
			}
		})
		.catch((err) => res.status(400).json('wrong credentials'));
});

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
	const hash = bcrypt.hashSync(password, 8);
	db.transaction((trx) => {
		trx.insert({
			hash: hash,
			email: email
		})
			.into('login')
			.returning('email')
			.then((loginEmail) => {
				console.log(loginEmail);
				return trx('users')
					.returning('*')
					.insert({
						name: name,
						email: loginEmail[0],
						joined: new Date()
					})
					.then((user) => {
						res.json(user[0]);
					});
			})
			.then(trx.commit)
			.catch(trx.rollback);
	}).catch((err) => res.status(400).json('unable to register'));
});

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	db.select('*')
		.from('users')
		.where({ id })
		.then((user) => {
			if (user.length) {
				res.json(user[0]);
			} else {
				res.status(400).json('Not found');
			}
		})
		.catch((err) => res.status(400).json('Not found'));
});

app.put('/image', (req, res) => {
	const { id } = req.body;
	db('users')
		.where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then((entries) => {
			res.json(entries[0]);
		})
		.catch((err) => res.status(400).json('unable to get entries!'));
});

// // Load hash from your password DB.
// bcrypt.compare("B4c0/\/", hash, function(err, res) {
//     // res === true
// });
// bcrypt.compare("not_bacon", hash, function(err, res) {
//     // res === false
// });

// // As of bcryptjs 2.4.0, compare returns a promise if callback is omitted:
// bcrypt.compare("B4c0/\/", hash).then((res) => {
//     // res === true
// });

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
