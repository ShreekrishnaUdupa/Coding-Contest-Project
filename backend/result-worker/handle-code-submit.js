import getShardDBPool from './get-db-pool.js';

export default async function handleCodeSubmit (decodedMessage) {

    const {userId, contestCode, problemId, language, code, results} = decodedMessage;
    const pool = getShardDBPool(contestCode);
    const client = await pool.connect();

    try {
        await client.query (`BEGIN`);

        const insertResult = await client.query (`INSERT INTO submissions (user_id, problem_id, language, code) VALUES ($1, $2, $3, $4) RETURNING id`, [userId, problemId, language, code]);

        const submissionId = insertResult.rows[0].id;

        const values = [];
        const placeholders = [];

        results.forEach ((result, index) => {

            const placeholderStart = index * 3 + 1;

            placeholders.push (`($${placeholderStart}, $${placeholderStart + 1}, $${placeholderStart + 2})`);

            values.push (submissionId, result.id, result.passed);
        });

        await client.query (`INSERT INTO submission_results (submission_id, test_case_id, passed) VALUES ${placeholders.join(', ')}`, values);

        await client.query (`CALL update_leaderboards_procedure ($1)`, [submissionId]);

		await client.query('COMMIT');

        const submissionResult = await client.query (`SELECT points_scored AS "pointsScored", total_points as "totalPoints", test_cases_passed as "totalTestCasesPassed", total_test_cases as "totalTestCases" FROM submissions WHERE id = $1`, [submissionId]);

        return submissionResult.rows[0];
    }

    catch (error) {
        console.error(error);
    }

    finally {
        client.release();
    }
}