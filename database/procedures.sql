CREATE OR REPLACE PROCEDURE update_leaderboards_procedure (p_submission_id INT)
LANGUAGE plpgsql
AS $$
DECLARE
	v_user_id UUID;
	v_problem_id INT;
	v_contest_id INT;
	v_submission_points FLOAT;
	v_best_points FLOAT;
BEGIN
	SELECT user_id, problem_id, points
	INTO v_user_id, v_problem_id, v_submission_points
	FROM submissions
	WHERE id = p_submission_id;

	SELECT contest_id
	INTO v_contest_id
	FROM problems
	WHERE id = v_problem_id;

	SELECT COALESCE (MAX(points), 0)
	INTO v_best_points
	FROM submissions
	WHERE user_id = v_user_id
	AND problem_id = v_problem_id
	AND id != p_submission_id;

	UPDATE leaderboards
	SET
		total_points = total_points + GREATEST (v_submission_points - v_best_points, 0),
		total_submissions = total_submissions + 1
	WHERE user_id = v_user_id
	AND contest_id = v_contest_id;
END;
$$;