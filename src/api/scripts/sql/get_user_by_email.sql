SELECT id, name, email, password, created_at
FROM users
WHERE email = $1;