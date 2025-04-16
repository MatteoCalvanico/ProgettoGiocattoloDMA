import { controller } from "../controller/controller";
import { mongoRepo } from "../repository/mongoRepository";

// Mock mongoRepo
jest.mock("../repository/mongoRepository", () => ({
  mongoRepo: jest.fn().mockImplementation(() => ({
    findSeries: jest.fn().mockResolvedValue([{ id: 1, data: "test data" }]),
    findSeriesByTimestamp: jest
      .fn()
      .mockResolvedValue([{ id: 1, timestamp: "2023-01-01T00:00:00Z" }]),
    find: jest.fn().mockResolvedValue([{ id: 2, data: "regular data" }]),
    findByTimestamp: jest
      .fn()
      .mockResolvedValue([{ id: 2, timestamp: "2023-01-01T00:00:00Z" }]),
  })),
}));

describe("Controller tests:", () => {
  let testController: controller;
  let mockRepo: mongoRepo;

  // Mock dei request e dei reply
  const mockRequest = {
    params: {},
  } as any;

  const mockReply = {
    send: jest.fn().mockReturnThis(),
    code: jest.fn().mockReturnThis(),
  } as any;

  beforeEach(() => {
    mockRepo = new mongoRepo();
    testController = new controller(mockRepo);
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    test("should return timeseries data when isSeries is true", async () => {
      await testController.findAll(mockRequest, mockReply, true);

      expect(mockRepo.findSeries).toHaveBeenCalled();
      expect(mockRepo.find).not.toHaveBeenCalled(); // L'altro metodo NON deve essere chiamato
      expect(mockReply.send).toHaveBeenCalledWith({
        messages: [{ id: 1, data: "test data" }],
      });
    });

    test("shouldn't return timeseries data when isSeries si true", async () => {
      await testController.findAll(mockRequest, mockReply, false);

      expect(mockRepo.find).toHaveBeenCalled();
      expect(mockRepo.findSeries).not.toHaveBeenCalled(); // L'altro metodo NON deve essere chiamato
      expect(mockReply.send).toHaveBeenCalledWith({
        messages: [{ id: 2, data: "regular data" }],
      });
    });
  });

  describe("findStamp", () => {
    beforeEach(() => {
      mockRequest.params = { timestamp: "2023-01-01T00:00:00Z" };
    });

    test("should return timeseries data by timestamp when isSeries is true", async () => {
      await testController.findStamp(mockRequest, mockReply, true);

      expect(mockRepo.findSeriesByTimestamp).toHaveBeenCalledWith(
        "2023-01-01T00:00:00Z"
      );
      expect(mockRepo.findByTimestamp).not.toHaveBeenCalled();
      expect(mockReply.send).toHaveBeenCalledWith({
        message: [{ id: 1, timestamp: "2023-01-01T00:00:00Z" }],
      });
    });

    test("shouldn't return timeseries data by timestamp when isSeries is false", async () => {
      await testController.findStamp(mockRequest, mockReply, false);

      expect(mockRepo.findByTimestamp).toHaveBeenCalledWith(
        "2023-01-01T00:00:00Z"
      );
      expect(mockRepo.findSeriesByTimestamp).not.toHaveBeenCalled();
      expect(mockReply.send).toHaveBeenCalledWith({
        message: [{ id: 2, timestamp: "2023-01-01T00:00:00Z" }],
      });
    });

    test("should handle zod validation errors for invalid timestamps", async () => {
      mockRequest.params = { timestamp: "invalid-timestamp" };

      await testController.findStamp(mockRequest, mockReply, true);

      expect(mockReply.code).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        success: false,
        error: expect.any(String), // Errore dal validator di Zod
      });
    });
  });
});
