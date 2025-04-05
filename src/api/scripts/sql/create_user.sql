INSERT INTO users (name, email, password, created_at)
VALUES ($1, $2, $3, NOW())
RETURNING id, name, email, created_at;