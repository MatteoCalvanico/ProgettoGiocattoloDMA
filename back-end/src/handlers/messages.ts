/*export class MessageHandler {

    findAll = async () => {
        try {
            const messages = isSeries ? await this.mongoRepository.findSeries() : await this.mongoRepository.find();
            reply.send({ messages })
        } catch (error: any) {
            reply.code(500).send({ success: false, error: error.message });
        }
    }


}*/
