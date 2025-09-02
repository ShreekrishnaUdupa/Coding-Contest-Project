DROP TABLE IF EXISTS leaderboards;
DROP TABLE IF EXISTS submission_results;
DROP TABLE IF EXISTS submissions;
DROP TABLE IF EXISTS test_cases;
DROP TABLE IF EXISTS problems;
DROP TABLE IF EXISTS contest_user_roles;
DROP TABLE IF EXISTS contests;
DROP TABLE IF EXISTS email_otps;
DROP TABLE IF EXISTS users;

DROP TYPE IF EXISTS DIFFICULTY_LEVEL;
DROP TYPE IF EXISTS ROLES;

DROP INDEX IF EXISTS index_submission_results_submission_id;
DROP INDEX IF EXISTS index_submissions_submission_time;
DROP INDEX IF EXISTS index_submissions_user_id_problem_id;
DROP INDEX IF EXISTS index_test_cases_problem_id;
DROP INDEX IF EXISTS index_problems_contest_id_number;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password TEXT,
    email_verified BOOLEAN DEFAULT false,
    oauth_provider VARCHAR(30),
    refresh_token TEXT,
    created_at TIMESTAMPTZ DEFAULT current_timestamp
);

CREATE TABLE email_otps (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    otp VARCHAR(6) NOT NULL,
    expires_at TIMESTAMPTZ DEFAULT (now () + INTERVAL '5 minutes'),
    attempts INT DEFAULT 0
);

CREATE TABLE contests (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    rules TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT current_timestamp
);

CREATE TYPE ROLES AS ENUM ('organizer', 'moderator', 'participant');
CREATE TABLE contest_user_roles (
    contest_id INT REFERENCES contests(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role ROLES DEFAULT 'participant',
    assigned_at TIMESTAMPTZ DEFAULT current_timestamp,
    
    PRIMARY KEY (contest_id, user_id)
);

CREATE TYPE DIFFICULTY_LEVEL AS ENUM ('easy', 'medium', 'hard');
CREATE TABLE problems (
	id SERIAL PRIMARY KEY,
    contest_id INT REFERENCES contests(id) ON DELETE CASCADE,
	number INT NOT NULL,
    difficulty DIFFICULTY_LEVEL NOT NULL,
    title TEXT,
    statement TEXT,
    constraints TEXT,
	total_points FLOAT DEFAULT 0,

	CONSTRAINT unique_problem_per_contest UNIQUE (contest_id, number)
);

CREATE INDEX index_problems_contest_id_number ON problems (contest_id, number);

CREATE TABLE test_cases (
    id SERIAL PRIMARY KEY,
    problem_id INT REFERENCES problems(id) ON DELETE CASCADE,
	number INT NOT NULL,
    input TEXT,
    expected_output TEXT,
    points FLOAT,
    is_sample BOOLEAN
);

CREATE INDEX index_test_cases_problem_id ON test_cases(problem_id);

CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    problem_id INT REFERENCES problems(id) ON DELETE CASCADE,
    code TEXT,
    points FLOAT DEFAULT 0,
    total_points FLOAT DEFAULT 0,
    test_cases_passed INT DEFAULT 0,
    total_test_cases INT DEFAULT 0,
    submission_time TIMESTAMPTZ DEFAULT current_timestamp
);

CREATE INDEX index_submissions_user_id_problem_id ON submissions (user_id, problem_id);
CREATE INDEX index_submissions_submission_time ON submissions (submission_time DESC);

CREATE TABLE submission_results (
    id SERIAL PRIMARY KEY,
    submission_id int REFERENCES submissions(id) ON DELETE CASCADE,
    test_case_id INT REFERENCES test_cases(id) ON DELETE CASCADE,
    passed BOOLEAN NOT NULL
);

CREATE INDEX index_submission_results_submission_id ON submission_results (submission_id);

CREATE TABLE leaderboards (
    contest_id INT REFERENCES contests(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    total_points FLOAT DEFAULT 0,
    total_submissions INT DEFAULT 0,
    
    PRIMARY KEY (contest_id, user_id)
) PARTITION BY LIST (contest_id);