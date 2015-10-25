var uuid = require('node-uuid');
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var fs = require('fs');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index')
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var todoList = {};

function checkAndCreate(req, res, next){
	if (!todoList[req.params.user]) {
		todoList[req.params.user] = [];
	}
	next();
}

app.get('/:user/todo', checkAndCreate, function(req, res) {
  	res.status(200).json(todoList[req.params.user]);
});

app.post('/:user/todo/delete', checkAndCreate, function(req, res) {
	var todo = req.body;
	if (!todo.id) {
		res.status(500).json('todo not found');
	}
	else {
		for (var i = 0; i < todoList[req.params.user].length; i++) {
			if (todoList[req.params.user][i].id == todo.id) {
				todoList[req.params.user].splice(i, 1);
			}
		};
		fs.writeFile('data.json', JSON.stringify(todoList));
		res.status(200).json(todoList[req.params.user]);
	}
});


app.post('/:user/todo', checkAndCreate, function(req, res) {
	var todo = req.body;
	if (!todo.id) {
		todo.id = uuid.v1();
		if (!todo.status) {
			todo.status = 'new';
		}
		todoList[req.params.user].push(todo);
	}
	else {
		for (var i = 0; i < todoList[req.params.user].length; i++) {
			if (todoList[req.params.user][i].id == todo.id) {
				todoList[req.params.user][i] = todo;
			}
		};
	}
	fs.writeFile('data.json', JSON.stringify(todoList));
  	res.status(200).json(todoList[req.params.user]);
});

fs.readFile('data.json', function(err, data){
	todoList = JSON.parse(data);
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
