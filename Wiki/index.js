const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const https = require('https');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

app
	.route('/')
	.get((req, res) => {
		res.render('home');
	})
	.post((req, res) => {});

app.listen(3000, () => {
	cl('server started on port 3000');
});

function cl(str) {
	console.log(str);
}
