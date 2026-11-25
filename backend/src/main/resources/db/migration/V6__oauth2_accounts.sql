-- Google OIDC provider identity links. OAuth tokens are never stored in this table.
CREATE TABLE IF NOT EXISTS oauth2_accounts (
    id UUID PRIMARY KEY,
    provider VARCHAR(30) NOT NULL,
    provider_subject VARCHAR(200) NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(150) NOT NULL,
    linked_at TIMESTAMP NOT NULL,
    CONSTRAINT uk_oauth2_provider_subject UNIQUE (provider, provider_subject),
    CONSTRAINT uk_oauth2_provider_user UNIQUE (provider, user_id)
);
CREATE INDEX IF NOT EXISTS idx_oauth2_account_user ON oauth2_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth2_account_email ON oauth2_accounts(email);
