
-- throw errors for fk violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    username TEXT NOT NULL,
    passwd TEXT NOT NULL,
    registeredOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    lastModified TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS Plan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ownerId  INT NOT NULL,
    title TEXT NOT NULL,
    createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (ownerId) REFERENCES User(id)
);

CREATE TABLE IF NOT EXISTS Module (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ownerId  INT NOT NULL,
    title TEXT NOT NULL,
    createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (ownerId) REFERENCES User(id)
);

CREATE TABLE IF NOT EXISTS Lesson (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ownerId  INT NOT NULL,
    moduleId  INT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    lastModified TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (ownerId) REFERENCES User(id),
    FOREIGN KEY (moduleId) REFERENCES Module(id)
);

CREATE TABLE IF NOT EXISTS ModulePlanAssociation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    planId INT NOT NULL,
    moduleId INT NOT NULL,
    FOREIGN KEY (planId) REFERENCES Plan(id),
    FOREIGN KEY (moduleId) REFERENCES Module(id)
);

CREATE TABLE IF NOT EXISTS Enrollment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INT NOT NULL,
    planId INT NOT NULL,
    startDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status TEXT DEFAULT "Not Started",
    endDate TIMESTAMP,
    progress INT DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES User(id),
    FOREIGN KEY (planId) REFERENCES Plan(id)
);


-- trigger to update last modified timestamp when record changes.
CREATE TRIGGER IF NOT EXISTS UpdateLastModifiedTrigger
    AFTER UPDATE ON Lesson
    FOR EACH ROW
BEGIN
    UPDATE Lesson
        SET lastModified = CURRENT_TIMESTAMP WHERE id = old.id;
END;

--insert test user
INSERT INTO User ("firstName", "lastName", "username", "passwd") VALUES ("Test", "User", "user1", "password1");

COMMIT;

