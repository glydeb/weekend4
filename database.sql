CREATE TABLE tasks (
 	id SERIAL PRIMARY KEY,
	name varchar(30),
	description varchar(500),
	due_date date,
	completed boolean,
	priority integer
);

-- dep_task_id represents the task that must wait to be completed until task_id is completed --

CREATE TABLE dependencies (
	task_id integer REFERENCES tasks,
	dep_task_id integer REFERENCES tasks,
	PRIMARY KEY (task_id, dep_task_id)
);
