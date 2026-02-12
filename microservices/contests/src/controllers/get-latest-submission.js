import getLatestSubmissionService from '../services/get-latest-submission.js';

export default async function getLatestSubmission (req, res) {

    const {id: userId} = req.user;
    const {code: contestCode, problemId} = req.params;

    const results = await getLatestSubmissionService ({contestCode, userId, problemId});

    if (results.rows.length === 0)
            return res.status(204).end();

    return res.status(200).json(results.rows[0]);
}