import pool from '../../utils/db.js';

const getLeaderboard = (io) => {

    io.on ('connection', (socket) => {
        console.log('Client connected: ', socket.id);

        socket.on ('get_leaderboard', async (contestId) => {
            try {
                const results = await pool.query (`
                    SELECT u.username, l.total_points, l.total_submissions
                    FROM leaderboards l
                    JOIN users u ON u.id = l.user_id
                    WHERE l.contest_id = $1
                    ORDER BY l.total_points DESC, l.total_submissions ASC`, [contestId]);

                socket.emit ('leaderboard_data', results.rows);
            }

            catch (error) {
                console.error ('Error fetching leaderboard:', error);
                socket.emit ('leaderboard_error', {error: 'Could not fetch leaderboard'});
            }
        });

        socket.on ('disconnect', () => {
            console.log('Client disconnected: ', socket.id);
        });
    });
};

export default getLeaderboard;