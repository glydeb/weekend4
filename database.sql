CREATE TABLE tasks (
 	id SERIAL PRIMARY KEY,
	name varchar(80),
	description varchar(500),
	due_date date,
	completed boolean,
);
