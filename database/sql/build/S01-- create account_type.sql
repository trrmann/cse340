CREATE TYPE IF NOT EXISTS PUBLIC.account_type AS ENUM
    ('Client', 'Employee', 'Admin');

ALTER TYPE PUBLIC.account_type
    OWNER TO postgres;