INSERT INTO users (
    id,
    global_user_id,
    full_name,
    email,
    phone_number,
    password_hash,
    status
) VALUES (
    '11111111-1111-4111-8111-111111111111',
    '1000000000000001',
    'Sample Platform Admin',
    'admin@example.com',
    '9876543210',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'ACTIVE'
);

INSERT INTO user_roles (user_id, role)
VALUES (
    '11111111-1111-4111-8111-111111111111',
    'PLATFORM_ADMIN'
);