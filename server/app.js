var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var index = require('./routes/index');
var tasks = require('./routes/tasks');

app.use(bodyParser.urlencoded({ extended: true }));

//Routes
app.use('/tasks', tasks);

app.use('/', index);

//Port
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
  console.log('Listening on port: ', app.get('port'));
});
