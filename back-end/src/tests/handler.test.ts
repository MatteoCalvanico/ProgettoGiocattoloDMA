import { mongoRepo } from "../repository/mongoRepository";
import { controller } from "../controller/controller";

// Mock mongoRepo
jest.mock("../repository/mongoRepository", () => ({
  mongoRepo: jest.fn().mockImplementation(() => ({
    find: jest.fn().mockResolvedValue([{ id: 1, data: "test message" }]),
    findByTimestamp: jest
      .fn()
      .mockResolvedValue([{ id: 1, timestamp: "2023-01-01T00:00:00Z" }]),
    findSeries: jest.fn().mockResolvedValue([{ id: 2, data: "test series" }]),
    findSeriesByTimestamp: jest
      .fn()
      .mockResolvedValue([{ id: 2, timestamp: "2023-01-01T00:00:00Z" }]),
  })),
}));

describe("MessageHandler tests:", () => {
  let handler: controller;
  let mongo: mongoRepo;

  beforeEach(() => {
    jest.clearAllMocks();
    mongo = new mongoRepo();
    handler = new controller(mongo);
  });

  describe("findAllMessages", () => {
    test("should call findSeries when isSeries is true", async () => {
      const result = await handler.findAllMessages(true);

      expect(mongo.findSeries).toHaveBeenCalled();
      expect(mongo.find).not.toHaveBeenCalled(); // Essendo true NON deve essere chiamato perchè si cerca per timeseries
      expect(result).toEqual([{ id: 2, data: "test series" }]);
    });

    test("should call find when isSeries is false", async () => {
      const result = await handler.findAllMessages(false);
      expect(mongo.findSeries).not.toHaveBeenCalled(); // Essendo false NON deve essere chiamato perchè si cerca senza timeseries
      expect(mongo.find).toHaveBeenCalled();
      expect(result).toEqual([{ id: 1, data: "test message" }]);
    });
  });

  describe("findByStamp", () => {
    const timestamp = "2023-01-01T00:00:00Z";

    test("should call findSeriesByTimestamp when isSeries is true", async () => {
      const result = await handler.findByStamp(true, timestamp);

      expect(mongo.findSeriesByTimestamp).toHaveBeenCalledWith(timestamp);
      expect(mongo.findByTimestamp).not.toHaveBeenCalled(); // Essendo true NON deve essere chiamato perchè si cerca per timeseries
      expect(result).toEqual([{ id: 2, timestamp: "2023-01-01T00:00:00Z" }]);
    });

    test("should call findByTimestamp when isSeries is false", async () => {
      const result = await handler.findByStamp(false, timestamp);
      expect(mongo.findSeriesByTimestamp).not.toHaveBeenCalled(); // Essendo false NON deve essere chiamato perchè si cerca senza timeseries
      expect(mongo.findByTimestamp).toHaveBeenCalledWith(timestamp);
      expect(result).toEqual([{ id: 1, timestamp: "2023-01-01T00:00:00Z" }]);
    });
  });
});
