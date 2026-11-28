-- Harapanku & TumbuhKembang.id — MySQL 8.0 Schema
-- Character set: utf8mb4 for full Indonesian text & emoji support

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ==========================================
-- DOMAIN 1: IDENTITAS & PROFIL ANAK
-- ==========================================

CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NULL UNIQUE,
    phone_wa VARCHAR(20) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NULL,
    role ENUM('parent', 'therapist', 'psychologist', 'admin') NOT NULL DEFAULT 'parent',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS therapists (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL UNIQUE,
    str_number VARCHAR(50) NOT NULL UNIQUE,
    license_org VARCHAR(50) NOT NULL,
    specialization ENUM('ABA', 'Speech', 'Occupational', 'Psychologist') NOT NULL,
    bio TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_therapists_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS children (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    parent_id CHAR(36) NULL,
    nickname VARCHAR(60) NOT NULL,
    full_name VARCHAR(120) NULL,
    birth_date DATE NOT NULL,
    gender ENUM('L', 'P') NULL,
    is_premature BOOLEAN NOT NULL DEFAULT FALSE,
    gestational_weeks TINYINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT chk_gestational_weeks CHECK (gestational_weeks IS NULL OR gestational_weeks BETWEEN 24 AND 36),
    CONSTRAINT fk_children_parent FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_children_parent ON children(parent_id, deleted_at);

-- ==========================================
-- DOMAIN 2: SKRINING MANDIRI (TumbuhKembang.id)
-- ==========================================

CREATE TABLE IF NOT EXISTS screening_questions (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(30) NOT NULL UNIQUE,
    source_standard VARCHAR(50) NOT NULL,
    pillar ENUM('wicara', 'okupasi', 'perilaku') NOT NULL,
    age_group_months SMALLINT UNSIGNED NULL,
    aspect VARCHAR(40) NULL,
    min_age_months SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    max_age_months SMALLINT UNSIGNED NOT NULL DEFAULT 144,
    question_template TEXT NOT NULL,
    home_example TEXT NOT NULL,
    mini_game_title VARCHAR(120) NULL,
    mini_game_steps JSON NULL,
    is_critical_indicator BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS screenings (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    child_id CHAR(36) NOT NULL,
    guest_session_token VARCHAR(100) NULL,
    primary_concerns JSON NOT NULL,
    chronological_age_months DECIMAL(5, 2) NOT NULL,
    corrected_age_months DECIMAL(5, 2) NOT NULL,
    score_wicara_pct TINYINT UNSIGNED NULL,
    score_okupasi_pct TINYINT UNSIGNED NULL,
    score_perilaku_pct TINYINT UNSIGNED NULL,
    risk_level ENUM('optimal', 'stimulasi', 'perlu_evaluasi') NULL,
    clinical_summary TEXT NULL,
    pdf_report_url VARCHAR(255) NULL,
    completed_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_score_wicara CHECK (score_wicara_pct IS NULL OR score_wicara_pct <= 100),
    CONSTRAINT chk_score_okupasi CHECK (score_okupasi_pct IS NULL OR score_okupasi_pct <= 100),
    CONSTRAINT chk_score_perilaku CHECK (score_perilaku_pct IS NULL OR score_perilaku_pct <= 100),
    CONSTRAINT fk_screenings_child FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_screenings_child_date ON screenings(child_id, completed_at DESC);
CREATE INDEX idx_screenings_guest_token ON screenings(guest_session_token);

CREATE TABLE IF NOT EXISTS screening_answers (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    screening_id CHAR(36) NOT NULL,
    question_id INT UNSIGNED NOT NULL,
    answer_status ENUM('optimal', 'stimulasi', 'perlu_pantauan') NOT NULL,
    answer_choice ENUM('ya', 'tidak', 'belum_dinilai') NULL,
    notes TEXT NULL,
    used_mini_game BOOLEAN NOT NULL DEFAULT FALSE,
    answered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_screening_question (screening_id, question_id),
    CONSTRAINT fk_answers_screening FOREIGN KEY (screening_id) REFERENCES screenings(id) ON DELETE CASCADE,
    CONSTRAINT fk_answers_question FOREIGN KEY (question_id) REFERENCES screening_questions(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS daily_stimulation_logs (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    screening_id CHAR(36) NOT NULL,
    day_number TINYINT UNSIGNED NOT NULL,
    pillar ENUM('wicara', 'okupasi', 'perilaku', 'semua') NOT NULL,
    activity_title VARCHAR(120) NOT NULL,
    activity_description TEXT NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at DATETIME NULL,
    CONSTRAINT chk_day_number CHECK (day_number BETWEEN 1 AND 14),
    CONSTRAINT fk_stim_logs_screening FOREIGN KEY (screening_id) REFERENCES screenings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- DOMAIN 3: LAYANAN KLINIK & RESERVASI
-- ==========================================

CREATE TABLE IF NOT EXISTS services (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    category_label VARCHAR(80) NOT NULL,
    duration_minutes SMALLINT UNSIGNED NOT NULL,
    description TEXT NOT NULL,
    highlights JSON NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS assessment_packages (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    price_idr INT UNSIGNED NOT NULL,
    observation_minutes SMALLINT UNSIGNED NOT NULL,
    dashboard_free_days SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    features JSON NOT NULL,
    is_recommended BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS appointments (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    child_id CHAR(36) NULL,
    service_id INT UNSIGNED NULL,
    package_id INT UNSIGNED NULL,
    therapist_id CHAR(36) NULL,
    parent_name VARCHAR(120) NOT NULL,
    parent_wa VARCHAR(20) NOT NULL,
    child_age_label VARCHAR(50) NOT NULL,
    main_complaint VARCHAR(100) NOT NULL,
    scheduled_at DATETIME NULL,
    status ENUM('pending_wa', 'confirmed', 'completed', 'cancelled') NOT NULL DEFAULT 'pending_wa',
    admin_notes TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_appt_child FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE SET NULL,
    CONSTRAINT fk_appt_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
    CONSTRAINT fk_appt_package FOREIGN KEY (package_id) REFERENCES assessment_packages(id) ON DELETE SET NULL,
    CONSTRAINT fk_appt_therapist FOREIGN KEY (therapist_id) REFERENCES therapists(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_appointments_status_sched ON appointments(status, scheduled_at);

-- ==========================================
-- DOMAIN 4: PARENT DASHBOARD & TERAPI BERJALAN
-- ==========================================

CREATE TABLE IF NOT EXISTS therapy_plans (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    child_id CHAR(36) NOT NULL,
    lead_psychologist_id CHAR(36) NOT NULL,
    title VARCHAR(120) NOT NULL,
    status ENUM('active', 'paused', 'graduated') NOT NULL DEFAULT 'active',
    evaluation_cycle_sessions SMALLINT UNSIGNED NOT NULL DEFAULT 12,
    start_date DATE NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_plans_child FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
    CONSTRAINT fk_plans_psychologist FOREIGN KEY (lead_psychologist_id) REFERENCES therapists(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS therapy_sessions (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    plan_id CHAR(36) NOT NULL,
    therapist_id CHAR(36) NOT NULL,
    session_number INT UNSIGNED NOT NULL,
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    stimulation_focus TEXT NOT NULL,
    emotional_response VARCHAR(80) NOT NULL,
    therapist_notes TEXT NULL,
    home_recommendation TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sessions_plan FOREIGN KEY (plan_id) REFERENCES therapy_plans(id) ON DELETE CASCADE,
    CONSTRAINT fk_sessions_therapist FOREIGN KEY (therapist_id) REFERENCES therapists(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_sessions_plan_num ON therapy_sessions(plan_id, session_number DESC);

CREATE TABLE IF NOT EXISTS milestone_snapshots (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    plan_id CHAR(36) NOT NULL,
    recorded_date DATE NOT NULL,
    speech_expressive_pct TINYINT UNSIGNED NOT NULL,
    sensory_focus_pct TINYINT UNSIGNED NOT NULL,
    fine_motor_pct TINYINT UNSIGNED NOT NULL,
    independence_trend_pct SMALLINT NULL,
    summary_note TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_speech_pct CHECK (speech_expressive_pct <= 100),
    CONSTRAINT chk_sensory_pct CHECK (sensory_focus_pct <= 100),
    CONSTRAINT chk_motor_pct CHECK (fine_motor_pct <= 100),
    CONSTRAINT fk_snapshots_plan FOREIGN KEY (plan_id) REFERENCES therapy_plans(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS monthly_targets (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    plan_id CHAR(36) NOT NULL,
    period_month DATE NOT NULL,
    target_description VARCHAR(255) NOT NULL,
    is_achieved BOOLEAN NOT NULL DEFAULT FALSE,
    achieved_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_targets_plan FOREIGN KEY (plan_id) REFERENCES therapy_plans(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_targets_plan_month ON monthly_targets(plan_id, period_month);

-- ==========================================
-- DOMAIN 5: CMS LANDING PAGE
-- ==========================================

CREATE TABLE IF NOT EXISTS cms_sections (
    section_key VARCHAR(50) NOT NULL PRIMARY KEY,
    content JSON NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
