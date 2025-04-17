import { mongoRepo } from "../repository/mongoRepository";

export class controller {
  private mongo: mongoRepo;

  constructor(mongo: mongoRepo) {
    this.mongo = mongo;
  }

  async findAllMessages(isSeries: boolean) {
    return isSeries ? await this.mongo.findSeries() : await this.mongo.find();
  }

  async findByStamp(isSeries: boolean, stamp: string) {
    return isSeries
      ? await this.mongo.findSeriesByTimestamp(stamp)
      : await this.mongo.findByTimestamp(stamp);
  }
}
