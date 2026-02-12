import getContestDetailsService from '../services/get-contest-details.js';

export default async function getContestDetails (req, res) {

    const {code: contestCode} = req.params;

    const results = await getContestDetailsService (contestCode);

    if (!results.isPresent)
        return res.status(404).json({error: 'Error 404, contest not found'});

    const {title, description, rules, startTime, endTime} = results;

    return res.status(200).json({title, description, rules, startTime, endTime});
}