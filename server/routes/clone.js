var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/weekend4';

router.get('/:id', function (req, res) {
  var taskId = req.params.id;

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('SELECT name, description FROM tasks ' +
                 'WHERE id = $1', [taskId],
      function (err, result) {
      done();
      res.send(result.rows);

    });
  });
});

module.exports = router;
