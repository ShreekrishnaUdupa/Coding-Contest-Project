import {getShardDBPool} from '../../utils/get-db-pool.js';

const getLeaderboard = async (req, res) => {
    const {contestCode} = req.params;
    const pool = getShardDBPool(contestCode);

    try {
        const {rows: results} = await pool.query (`
                    SELECT u.username, l.total_points as "totalPoints", l.total_submissions as "totalSubmissions"
                    FROM leaderboards l
                    JOIN foreign_users u ON u.id = l.user_id
                    WHERE l.contest_code = $1
                    ORDER BY l.total_points DESC, l.total_submissions ASC`,
                    [contestCode]);

        return res.status(200).json({results});
    }

    catch (error) {
        console.error ('Error fetching leaderboard: ', error);
        return res.status(500).json({error: 'Internal server error'});
    }
};

export default getLeaderboard;