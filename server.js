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

app.get('/', (req, res) => {
	//res.send(database.users);
});

app.post('/signin', (req, res) => {
	// if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
	// 	res.json({
	// 		id: database.users[0].id,
	// 		name: database.users[0].name,
	// 		email: database.users[0].email,
	// 		entries: database.users[0].entries,
	// 		joined: database.users[0].joined
	// 	});
	// } else {
	// 	res.status(400).json('error loggin in');
	// }
});

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
	// bcrypt.hash(password, 8, function (err, hash) {});
	db('users')
		.returning('*')
		.insert({
			name: name,
			email: email,
			joined: new Date()
		})
		.then((user) => {
			res.json(user[0]);
		})
		.catch((err) => res.status(400).json('unable to register'));
});

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let found = false;
	// database.users.forEach((user) => {
	// 	if (user.id === id) {
	// 		found = true;
	// 		return res.json(user);
	// 	}
	// });
	if (!found) {
		res.status(404).json('no such user');
	}
});

app.put('/image', (req, res) => {
	const { id } = req.body;
	let found = false;
	// database.users.forEach((user) => {
	// 	if (user.id === id) {
	// 		found = true;
	// 		user.entries++;
	// 		return res.json(user.entries);
	// 	}
	// });
	if (!found) {
		res.status(404).json('no such user');
	}
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
