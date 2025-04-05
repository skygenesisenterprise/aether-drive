UPDATE users
SET name = $1, email = $2, updated_at = NOW()
WHERE id = $3
RETURNING id, name, email, updated_at;