const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();
app.set('view engine', 'ejs');
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wikiDB', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const articleSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, 'Error: a title is required'],
	},
	formattedTitle: String,
	content: String,
});

const Article = mongoose.model('Article', articleSchema);

app
	.route('/articles')
	.get((req, res) => {
		Article.find((err, foundArticles) => {
			err ? res.send(err) : res.send(foundArticles);
		});
	})
	.post((req, res) => {
		const newArticle = new Article({
			title: _.replace(_.toLower(req.body.title), ' ', '-'),
			formattedTitle: req.body.title,
			content: req.body.content,
		});

		newArticle.save((err) => {
			err ? res.send(err) : res.send('Successfully added article!');
		});

		termLine();
		cl('Created new article:');
		cl('\tTitle: ' + _.replace(_.toLower(req.body.title), ' ', '-'));
		cl('\tFormatted Title: ' + req.body.title);
		cl('\tContent: ' + req.body.content);
		termLine();
	})
	.delete((req, res) => {
		Article.deleteMany((err) => {
			err ? res.send(err) : res.send('Successfully deleted all articles.');
		});
	});

app
	.route('/articles/:articleTitle')
	.get((req, res) => {
		Article.findOne(
			{
				title: _.replace(_.toLower(req.params.articleTitle), ' ', '-'),
			},
			(err, result) => {
				err ? res.send(err) : res.send(result);
			}
		);
	})
	.put((req, res) => {
		Article.update(
			{
				title: _.replace(_.toLower(req.body.title), ' ', '-'),
			},
			{
				title: _.replace(_.toLower(req.body.title), ' ', '-'),
				formattedTitle: req.body.title,
				content: req.body.content,
			},
			{
				overwrite: true,
			},
			(err, result) => {
				err ? res.send(err) : res.send('Successfully updated article');
			}
		);
	})
	.patch((req, res) => {
		Article.update(
			{
				title: _.replace(_.toLower(req.body.title), ' ', '-'),
			},
			{
				$set: req.body,
			},
			(err, result) => {
				err ? res.send(err) : res.send('Successfully updated article');
			}
		);
	})
	.delete((req, res) => {
		Article.deleteOne(
			{
				title: _.replace(_.toLower(req.body.title), ' ', '-'),
			},
			(err) => {
				err ? res.send(err) : res.send('Successfully deleted article');
			}
		);
	});

app.listen(3500, () => {
	cl('api server started on port 3500');
});

function cl(str) {
	console.log(str);
}

function termLine() {
	let termWidth = process.stdout.columns;
	termWidth > 0 ? cl('%'.repeat(termWidth)) : cl('%'.repeat(80));
}
