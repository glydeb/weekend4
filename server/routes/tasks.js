var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/weekend4';

router.get('/', function (req, res) {

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('SELECT * from tasks ORDER BY completed ASC, due_date ASC',
      function (err, result) {
      done();
      res.send(result.rows);

    });
  });
});

router.post('/', function (req, res) {
  var task = req.body;

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('INSERT INTO tasks (name, description, due_date, completed) ' +
                    'VALUES ($1, $2, $3, $4)', [task.task_name,
                     task.description, task.due_date, 'false'],
                  function (err, result) {
                    done();

                    if (err) {
                      res.sendStatus(500);
                      return;
                    }

                    res.sendStatus(201);
                  }
    );
  });
});

router.put('/', function (req, res) {
  var task = req.body;
  console.log(task);

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('UPDATE tasks ' +
                  'SET completed = true ' +
                  'WHERE id = $1', [task.id],
                  function (err, result) {
                    done();

                    if (err) {
                      res.sendStatus(500);
                      return;
                    }

                    res.sendStatus(200);
                  }
    );
  });
});

router.delete('/:id', function (req, res) {
  var taskId = req.params.id;

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('DELETE FROM tasks ' +
                  'WHERE id = $1 ',
                  [taskId],
                  function (err, result) {
                    done();

                    if (err) {
                      res.sendStatus(500);
                      return;
                    }

                    res.sendStatus(200);
                  }
    );
  });
});

module.exports = router;
