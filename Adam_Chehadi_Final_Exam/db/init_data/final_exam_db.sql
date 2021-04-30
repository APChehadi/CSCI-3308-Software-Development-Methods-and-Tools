DROP TABLE IF EXISTS movie_reviews CASCADE;
CREATE TABLE IF NOT EXISTS movie_reviews (
    id SERIAL PRIMARY KEY,
    movie_name VARCHAR(50) NOT NULL,
    review_text VARCHAR NOT NULL,
    review_date TIMESTAMP NOT NULL
);

INSERT INTO movie_reviews(movie_name, review_text, review_date)
VALUES('Starship Troopers','Starship Troopers movie review.','2021-04-26 01:23:45'),
('Idiocracy','Idiocracy movie review.','2021-04-27 01:23:45'),
('Nacho Libre','Nacho Libre movie review.','2021-04-28 01:23:45'),
('Kicking and Screaming','Kicking and Screaming movie review.','2021-04-28 01:23:45');