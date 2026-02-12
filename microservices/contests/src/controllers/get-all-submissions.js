import getAllSubmissionsService from '../services/get-all-submissions.js';

export default async function getAllSubmissions (req, res) {

    const {id: userId} = req.user;
    const {code: contestCode, problemId} = req.params;

    const results = await getAllSubmissionsService ({contestCode, problemId, userId});

    return res.status(200).json(results);
}