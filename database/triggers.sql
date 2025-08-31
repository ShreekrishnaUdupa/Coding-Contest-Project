CREATE OR REPLACE FUNCTION insert_organizer ()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO contest_user_roles (contest_id, user_id, role)
    VALUES (NEW.id, NEW.created_by, 'organizer')
    ON CONFLICT (contest_id, user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insert_participant_in_leaderboards ()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role = 'participant' THEN
        INSERT INTO leaderboards (contest_id, user_id)
        VALUES (NEW.contest_id, NEW.user_id)
        ON CONFLICT (contest_id, user_id) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_submissions_values ()
RETURNS TRIGGER AS $$
DECLARE
    tc_points FLOAT;
BEGIN
    SELECT points INTO tc_points
    FROM test_cases
    WHERE id = NEW.test_case_id;
    
    IF tc_points IS NULL THEN
        tc_points := 0;
    END IF;
    
    UPDATE submissions
    SET
        total_test_cases = total_test_cases + 1,
        total_points = total_points + tc_points,
        test_cases_passed = test_cases_passed + CASE WHEN NEW.passed THEN 1 ELSE 0 END,
        points = points + CASE WHEN NEW.passed THEN tc_points ELSE 0 END
    WHERE id = NEW.submission_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-----------------------------------------------------------

CREATE OR REPLACE TRIGGER trigger_insert_organizer
AFTER INSERT ON contests
FOR EACH ROW
EXECUTE FUNCTION insert_organizer ();

CREATE OR REPLACE TRIGGER trigger_insert_participant_in_leaderboards
AFTER INSERT ON contest_user_roles
FOR EACH ROW
EXECUTE FUNCTION insert_participant_in_leaderboards ();

CREATE OR REPLACE TRIGGER trigger_update_submissions_points
AFTER INSERT ON submission_results
FOR EACH ROW
EXECUTE FUNCTION update_submissions_values ();