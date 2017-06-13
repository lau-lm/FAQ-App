let http = require('http');
let r = require('rethinkdb');
let express = require('express')
let app = express()
let bcrypt = require('bcrypt');
let nodemailer = require('nodemailer'); // module pour envoi d'email



/**
 * Modules de Securité d'une API (logs, XSS securité etc...)
 */
let cors = require('cors'); // pour l'accès à l'API
let bodyParser = require('body-parser'); // pour la sécurité
let logger = require('morgan'); // permet d'utiliser des logs pour tracer dans la console
let helmet = require('helmet'); // pour la sécurité des sessions
let passport = require('passport'); // pour l'authentification
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('express-session')({ secret: 'hK34B23B4HJ', resave: false, saveUninitialized: false }));
app.use(bodyParser.json());
app.use(cors());
logger('tiny')
app.use(helmet());

/**
 * Bonus: Nodemailer configuration
 */
var transporter = nodemailer.createTransport({
	host: "smtp.mailtrap.io",
	port: 2525,
	auth: {
		user: "d2a4c34ba69f4d",
		pass: "9251ef32f45b19"
	}
});




// 1ere étape de rethinkDB, la connexion à la BDD
let connection = r.connect({
	db: "test"
}).then((connection) => {

	app.get('/', (req, res) => {
		r.table('faq').orderBy({ index: 'answer_case_insensitive' }).run(connection, (err, cursor) => {
			if (err) throw err; // jette l'erreur en json
			cursor.toArray((err, result) => {
				console.log(result)
				res.json(result)
			})
		})
	});



	app.post('/add', (req, res) => {



		bcrypt.genSalt(10, function (err, salt) {

			bcrypt.hash(req.body.answer, salt, function (err, hash) {


				r.table('faq').insert({
					answer: req.body.answer,
					response: hash,
					viewResponse: req.body.viewResponse
				}).run(connection, (err, cursor) => {
					if (err) { throw err };


					// setup email data with unicode symbols
					let mailOptions = {
						from: '"Julien Boyer" <julien@meetserious.com>', // sender address
						to: 'florian@gmail.com', // list of receivers
						subject: 'Une nouvelle FAQ a été ajoutée ✔', // Subject line
						text: 'Awesome long paragraph about inscription...', // plain text body
						html: `<h1>Hello! </h1>
					            <p>Une nouvelle faq a été ajoutée ! </p>
					            <p> Pouet</p>`
					};

					// send mail with defined transport object
					transporter.sendMail(mailOptions, (error, info) => {
						if (error) {
							return console.log(error);
						}
						console.log('Message %s sent: %s', info.messageId, info.response);
						res.json(true);
					});




				});


				r.table('faq').orderBy({ index: 'answer_case_insensitive' }).run(connection, (err, cursor) => {

					cursor.toArray((err, result) => {
						res.json(result);
					})
				});
			});
		});
	});



	// pour supprimer une faq
	app.get('/delete/:id', (req, res) => {

		let id = req.params.id;

		r.table('faq').get(id).delete().run(connection, (err, cursor) => {
			if (err) throw err;

			r.table('faq').orderBy({ index: 'answer_case_insensitive' }).run(connection, (err, cursor) => {
				cursor.toArray((err, result) => {
					res.json(result);
				})
			});

		});
	});

	// pour afficher la réponse au clic
	app.post('/answer/:id&:visibility', (req, res) => {
		let id = req.params.id;
		let visibility = req.params.visibility

		if (visibility === "true") {
			visibility = true
		} else {
			visibility = false
		}

		r.table('faq').get(id).update({ viewResponse: visibility }).run(connection, (err, cursor) => {
			if (err) throw err;

			r.table('faq').orderBy({ index: 'answer_case_insensitive' }).run(connection, (err, cursor) => {
				cursor.toArray((err, result) => {
					res.json(result);
				})
			});

		})
	});




}); //end connexion



app.listen(3000, function () {
	console.log('Listened on port 3000!')
})