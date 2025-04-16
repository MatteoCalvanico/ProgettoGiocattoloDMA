import { mongoRepo } from "../repository/mongoRepository";

export class MessageHandler {
  private mongo: mongoRepo;

  constructor(mongo: mongoRepo) {
    this.mongo = mongo;
  }

  async findAllMessages(isSeries: boolean) {
    try {
      return isSeries ? await this.mongo.findSeries() : await this.mongo.find();
    } catch (error: any) {
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }
  }

  async findByStamp(isSeries: boolean, stamp: string) {
    try {
      return isSeries
        ? await this.mongo.findSeriesByTimestamp(stamp)
        : await this.mongo.findByTimestamp(stamp);
    } catch (error: any) {
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }
  }
}
