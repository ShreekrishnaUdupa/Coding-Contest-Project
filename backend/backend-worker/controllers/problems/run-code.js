import getRabbitMQChannel from '../../utils/get-rabbitmq-channel.js';

const runCode = async (req, res) => {
    try {
        const userId = req.user.id;
        const {contestCode, problemId} = req.params;
        const {language, code} = req.body;

        const message = { userId, contestCode, problemId, type: 'run', language, code };
        const messageBuffer = Buffer.from (JSON.stringify(message));

        const channel = await getRabbitMQChannel();
        channel.sendToQueue('execution_queue', messageBuffer, {persistent: true, priority: 1});
        
        await channel.waitForConfirms();

        res.status(202).json({webSocketId: `${req.user.id}-${contestCode}-${problemId}`});
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server error'});
    }
};

export default runCode;