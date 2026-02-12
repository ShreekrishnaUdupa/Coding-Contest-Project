import createProblemService from '../services/create-problem.js';

export default async function createProblem (req, res) {

    const {code: contestCode} = req.params;
    const {title, difficulty, statement, constraints, testCases} = req.body;

    await createProblemService ({contestCode, title, difficulty, statement, constraints, testCases});

    return res.status(201).end();
}