import pool from '../../utils/db.js';

const registerForContest = (io) => async (req, res) => {

    try {
        const {contestId} = req.body;
        const userId = req.user.id;

        await pool.query('INSERT INTO contest_user_roles (contest_id, user_id) VALUES ($1, $2) ON CONFLICT (contest_id, user_id) DO NOTHING;', [contestId, userId]);

        res.status(201).end();

        const {rows: updatedLeaderboard} = await pool.query (
			`SELECT u.username, l.total_points, l.total_submissions
			FROM leaderboards l
			JOIN users u ON u.id = l.user_id
			WHERE l.contest_id = $1
			ORDER BY l.total_points DESC, l.total_submissions ASC`,
			[contestId]
        );

		io.emit (`leaderboard-update-${contestId}`, updatedLeaderboard);
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server error'});
    }
};

export default registerForContest;