import addUserInContestService from '../services/add-user-in-contest.js';

export default async function registerForContest (req, res) {

    const {id: userId} = req.user;
    const {code: contestCode} = req.params;

    await addUserInContestService ({contestCode, userId, role: 'participant'});

    return res.status(201).end();
}