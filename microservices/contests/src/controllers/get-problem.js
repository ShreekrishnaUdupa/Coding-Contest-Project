import getProblemService from '../services/get-problem.js';

export default async function getProblem (req, res) {
    
    const {role} = req.user;
    const {code: contestCode, problemId} = req.params;

    const problem = await getProblemService ({contestCode, problemId});

    return res.status(200).json ({role, problem});
}