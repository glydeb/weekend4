$(document).ready(function () {

  $('#ui-datepicker-div').css('display', 'none');

  // load existing tasks
  $.get('/tasks', getTasks);

  //----- EVENT LISTENERS -----//
  // datepicker for new event
  $('#datepicker').datepicker({
    dateFormat: 'yy-mm-dd',
  });

  // submit task button
  $('#submit-task').on('click', postTask);

  // completed task, clone and delete task buttons
  $('#container').on('click', '.delete', deleteTask);
  $('#container').on('click', '.completed', completedTask);
  $('#container').on('click', '.clone', cloneTask);

  // reveal and hide the task descriptions
  $('#container').on('mouseenter', '.task', revealDesc);
  $('#container').on('mouseleave', '.task', unrevealDesc);
  $('#container').on('click', '.hold', holdDesc);
  $('#container').on('click', '.hide', hideDesc);

});

function revealDesc() {
  $(this).children('.hidden').slideDown();
}

function unrevealDesc() {
  $(this).children('.hidden').slideUp();
}

function holdDesc() {
  $(this).parent().parent().removeClass('task');
  $(this).text('Hide description').removeClass('hold').addClass('hide');
}

function hideDesc() {
  $(this).parent().slideUp();
  $(this).parent().parent().addClass('task');
  $(this).text('Hold description open').removeClass('hide').addClass('hold');
}

function cloneTask() {
  var taskID = $(this).parent().parent().data('taskID');
  $.ajax({
    type: 'GET',
    url: '/clone/' + taskID,
    success: fillTaskInputs,
  });

}

function fillTaskInputs(task) {
  $('form').children('#task_name').val(task[0].name);
  $('form').children('textarea').val(task[0].description);
}

function completedTask() {
  var taskID = $(this).parent().parent().data('taskID');
  $.ajax({
    type: 'PUT',
    url: '/tasks',
    data: { id: taskID },
    success: refreshTable,
  });

}

function deleteTask() {
  if (confirm('About to permanently delete this task.  Proceed?')) {
    var taskID = $(this).parent().parent().data('taskID');
    $.ajax({
      type: 'DELETE',
      url: '/tasks/' + taskID,
      success: refreshTable,
    });
  }
}

function refreshTable(res) {
  if (res == 'OK') {
    console.log('Operation success', res);
    $.get('/tasks', getTasks);
  } else {
    console.log('Operation failed', res);
  }
}

function postTask(event) {
  event.preventDefault();

  var newTask = {};
  $.each($(this).parent().find('input').serializeArray(), function (i, field) {
    newTask[field.name] = field.value;
  });

  console.log(newTask);
  $.post('/tasks', newTask, postTaskResponse);
  $('form').children('#task_name').val('');
  $('form').children('textarea').val('');
}

function postTaskResponse(res) {
  if (res == 'Created') {
    $.get('/tasks', getTasks);
    console.log('task created!');
  } else {
    console.log('Task rejected!!', res);
  }
}

function getTasks(tasks) {
  console.log('Get tasks called!');
  $('#container').empty();
  $('#container').append('<h3><span>Due Date</span>Task (mouse over for its ' +
     'description)</h3>');

  tasks.forEach(function (row) {
    var dateString = '';
    var $el1 = '';
    if (row.due_date !== null) {
      dateString = row.due_date.substr(0, 10);
    }

    if (row.completed) {
      $el1 = '<button class="clone">Clone this task</button>';
    } else {
      $el1 = '<button class="completed">Complete!</button>';
    }

    $el = $('<div class="task"><p><span>' + dateString + '</span>' + row.name +
              $el1 + '<button class="delete">Delete</button></p>' +
              '<p class="hidden">' + row.description +
              '<button class="hold">Hold description open</button></p></div>');

    $el.data('taskID', row.id);
    if (row.completed) { $el.addClass('complete'); }
    $('#container').append($el);

  });

}
