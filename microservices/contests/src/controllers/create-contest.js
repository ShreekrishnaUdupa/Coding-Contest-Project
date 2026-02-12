import isContestCodePresent from '../services/is-contest-code-present.js';

export default async function createContest (req, res) {

    const {id: userId} = req.user;
    const {code, title, description, rules, startTime, endTime} = req.body;

    if (isContestCodePresent(code))
        return res.status(409).json({error: 'Contest Code already exists, please choose a different one'});

    await createContestService ({code, title, description, rules, startTime, endTime, userId});

    return res.status(201).end();
}