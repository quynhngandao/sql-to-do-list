CREATE TABLE "tasks" (
    "id" serial primary key,
    "note" varchar(800),
    "complete" boolean not null default false
    "priority"  boolean not null default false
);

INSERT INTO "tasks" ("note", "complete", "priority")
VALUES ('Wash the dishes', false, false), 
('Finish weekend challenge', false, true);