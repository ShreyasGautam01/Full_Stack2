-- ════════════════════════════════════════════════════════════════════════════
-- NoteLink schema – spring.sql.init.mode=always runs this on every startup.
-- CREATE TABLE IF NOT EXISTS is idempotent for new installs.
--
-- !! MIGRATION for existing databases !!
-- Run these statements once in MySQL, then restart the backend:
--
--   ALTER TABLE notes
--     ADD COLUMN IF NOT EXISTS category   VARCHAR(100) NULL,
--     ADD COLUMN IF NOT EXISTS node_color VARCHAR(7)   NULL;
--
--   ALTER TABLE relationships
--     MODIFY COLUMN type VARCHAR(50) NOT NULL DEFAULT 'RELATED_TO';
--
-- ════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS users (
    id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50)  NOT NULL UNIQUE,
    email    VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(120) NOT NULL
);

CREATE TABLE IF NOT EXISTS roles (
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id INT    NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notes (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    title      VARCHAR(255) NOT NULL,
    content    TEXT,
    category   VARCHAR(100) NULL,
    node_color VARCHAR(7)   NULL,
    created_at DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    user_id    BIGINT       NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS note_images (
    id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    note_id   BIGINT       NOT NULL,
    FOREIGN KEY (note_id) REFERENCES notes (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS relationships (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    type           VARCHAR(50)  NOT NULL DEFAULT 'RELATED_TO',
    source_note_id BIGINT NOT NULL,
    target_note_id BIGINT NOT NULL,
    FOREIGN KEY (source_note_id) REFERENCES notes (id) ON DELETE CASCADE,
    FOREIGN KEY (target_note_id) REFERENCES notes (id) ON DELETE CASCADE
);

INSERT IGNORE INTO roles (id, name) VALUES (1, 'ROLE_USER');
INSERT IGNORE INTO roles (id, name) VALUES (2, 'ROLE_MODERATOR');
INSERT IGNORE INTO roles (id, name) VALUES (3, 'ROLE_ADMIN');