CREATE TABLE "tasks" (
    "id" serial primary key,
    "note" varchar(800),
    "complete" boolean default false
);

-- TEST DATA 
INSERT INTO "tasks" ("note", "complete")
VALUES ('Wash the dishes', false), 
('Finish weekend challenge', false);