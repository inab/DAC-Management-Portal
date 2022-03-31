import amqp from "amqplib";

const connectToChannel = async () => {
    try {
        let connection = await amqp.connect(process.env.RABBITMQ_SERVER)
        return connection.createChannel()
    } catch (e) {
        console.error('failed to create amqp channel: ', e)
    }
}

export default async (data, queue = process.env.RABBITMQ_QUEUE) => {
    let channel = await connectToChannel();
    
    await channel.assertQueue(queue, { durable: true });

    return channel.sendToQueue(queue, Buffer.from(data));
}