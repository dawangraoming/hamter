-- Up
CREATE TABLE IF NOT EXISTS articles(
  article_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
  article_name VARCHAR DEFAULT (''),
  article_local_path TEXT NOT NULL UNIQUE,
  article_thumb_path TEXT UNIQUE,
  article_remote_path TEXT,
  article_width INTEGER,
  article_height INTEGER,
  article_size INTEGER,
  article_type VARCHAR,
  article_mime VARCHAR,
  article_created_time DATETIME,
  article_added_time DATETIME DEFAULT (datetime('now', 'localtime'))
);
CREATE INDEX IF NOT EXISTS articles_sort ON articles (
  article_created_time DESC,
  article_id ASC
);
CREATE TABLE IF NOT EXISTS terms (
  term_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
  term_name VARCHAR DEFAULT (''),
  term_type CHAR NOT NULL,
  term_order INTEGER DEFAULT (-1),
  term_parent INTEGER DEFAULT (0),
  term_count INTEGER DEFAULT (0)
);
CREATE INDEX IF NOT EXISTS terms_sort ON terms (
  term_type ASC,
  term_parent ASC,
  term_order DESC,
  term_id ASC
);
CREATE TABLE IF NOT EXISTS terms_relationships (
  article_id INTEGER REFERENCES articles (article_id) NOT NULL,
  term_id INTEGER REFERENCES terms (term_id) NOT NULL
);
CREATE TABLE IF NOT EXISTS options (
  option_name VARCHAR NOT NULL PRIMARY KEY ASC UNIQUE,
  option_value TEXT DEFAULT ('')
);

CREATE TRIGGER count_term_articles_create AFTER INSERT ON terms_relationships
BEGIN
	UPDATE  terms SET term_count = (SELECT count(*) FROM terms_relationships WHERE term_id = new.term_id) WHERE term_id = new.term_id;
END;

CREATE TRIGGER count_term_articles_update AFTER UPDATE ON terms_relationships
BEGIN
	UPDATE  terms SET term_count = (SELECT count(*) FROM terms_relationships WHERE term_id = new.term_id) WHERE term_id = new.term_id;
	UPDATE  terms SET term_count = (SELECT count(*) FROM terms_relationships WHERE term_id = old.term_id) WHERE term_id = old.term_id;
END;

INSERT INTO terms (term_type, term_name) VALUES ('category', 'unclassified');


-- Down
