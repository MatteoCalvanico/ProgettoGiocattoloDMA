import { controller } from "../controller/controller";
import { MessageHandler } from "../handlers/messages";

// Mock MessageHandler
jest.mock("../handlers/messages", () => ({
  MessageHandler: jest.fn().mockImplementation(() => ({
    findAllMessages: jest
      .fn()
      .mockResolvedValue([{ id: 1, data: "test data" }]),
    findByStamp: jest
      .fn()
      .mockResolvedValue([{ id: 1, timestamp: "2023-01-01T00:00:00Z" }]),
  })),
}));

describe("Controller tests:", () => {
  let testController: controller;
  let mockHandler: MessageHandler;

  // Mock dei request e dei reply
  const mockRequest = {
    params: {},
  } as any;

  const mockReply = {
    send: jest.fn().mockReturnThis(),
    code: jest.fn().mockReturnThis(),
  } as any;

  beforeEach(() => {
    mockHandler = new MessageHandler(null as any); // Stiamo testando il controller, non abbiamo bisogno di passare effettivamente nulla
    testController = new controller(mockHandler);
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    test("should return messages when findAll is called", async () => {
      await testController.findAll(mockRequest, mockReply, true);

      expect(mockHandler.findAllMessages).toHaveBeenCalledWith(true);
      expect(mockReply.send).toHaveBeenCalledWith({
        messages: [{ id: 1, data: "test data" }],
      });
    });

    test("should pass isSeries=false to handler", async () => {
      await testController.findAll(mockRequest, mockReply, false);

      expect(mockHandler.findAllMessages).toHaveBeenCalledWith(false);
      expect(mockReply.send).toHaveBeenCalledWith({
        messages: [{ id: 1, data: "test data" }],
      });
    });
  });

  describe("findStamp", () => {
    beforeEach(() => {
      mockRequest.params = { timestamp: "2023-01-01T00:00:00Z" };
    });

    test("should find message by timestamp when isSeries is true", async () => {
      await testController.findStamp(mockRequest, mockReply, true);

      expect(mockHandler.findByStamp).toHaveBeenCalledWith(
        true,
        "2023-01-01T00:00:00Z"
      );
      expect(mockReply.send).toHaveBeenCalledWith({
        message: [{ id: 1, timestamp: "2023-01-01T00:00:00Z" }],
      });
    });

    test("should find message by timestamp when isSeries is false", async () => {
      await testController.findStamp(mockRequest, mockReply, false);

      expect(mockHandler.findByStamp).toHaveBeenCalledWith(
        false,
        "2023-01-01T00:00:00Z"
      );
      expect(mockReply.send).toHaveBeenCalledWith({
        message: [{ id: 1, timestamp: "2023-01-01T00:00:00Z" }],
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
