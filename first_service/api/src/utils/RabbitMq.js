class RabbitMq {

	static async sendMessageReply(ch, msg, returnedData){
		ch.sendToQueue(
			msg.properties.replyTo,
			Buffer.from(JSON.stringify(returnedData)),
			{
				correlationId: msg.properties.correlationId
			}
		);
		ch.ack(msg);
	}

}

export default RabbitMq;