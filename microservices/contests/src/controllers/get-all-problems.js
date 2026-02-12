import getAllProblemsService from '../services/get-all-problems.js';

export default async function getAllProblems (req, res) {

    const {role} = req.user;
    const {contestCode} = req.params;
    
    const problems = await getAllProblemsService ({contestCode});

    return res.status(200).json({role, problems});
}