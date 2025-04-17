import { handler } from "../handlers/handler";
import { controller } from "../controller/controller";

// Mock Handler
jest.mock("../controller/controller", () => ({
  controller: jest.fn().mockImplementation(() => ({
    findAllMessages: jest
      .fn()
      .mockResolvedValue([{ id: 1, data: "test data" }]),
    findByStamp: jest
      .fn()
      .mockResolvedValue([{ id: 1, timestamp: "2023-01-01T00:00:00Z" }]),
  })),
}));

describe("Controller tests:", () => {
  let testHandler: handler;
  let mockCtrl: controller;

  // Mock dei request e dei reply
  const mockRequest = {
    params: {},
  } as any;

  const mockReply = {
    send: jest.fn().mockReturnThis(),
    code: jest.fn().mockReturnThis(),
  } as any;

  beforeEach(() => {
    mockCtrl = new controller(null as any); // Stiamo testando il controller, non abbiamo bisogno di passare effettivamente nulla
    testHandler = new handler(mockCtrl);
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    test("should return messages when findAll is called", async () => {
      await testHandler.findAll(mockRequest, mockReply, true);

      expect(mockCtrl.findAllMessages).toHaveBeenCalledWith(true);
      expect(mockReply.send).toHaveBeenCalledWith({
        messages: [{ id: 1, data: "test data" }],
      });
    });

    test("should pass isSeries=false to handler", async () => {
      await testHandler.findAll(mockRequest, mockReply, false);

      expect(mockCtrl.findAllMessages).toHaveBeenCalledWith(false);
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
      await testHandler.findStamp(mockRequest, mockReply, true);

      expect(mockCtrl.findByStamp).toHaveBeenCalledWith(
        true,
        "2023-01-01T00:00:00Z"
      );
      expect(mockReply.send).toHaveBeenCalledWith({
        message: [{ id: 1, timestamp: "2023-01-01T00:00:00Z" }],
      });
    });

    test("should find message by timestamp when isSeries is false", async () => {
      await testHandler.findStamp(mockRequest, mockReply, false);

      expect(mockCtrl.findByStamp).toHaveBeenCalledWith(
        false,
        "2023-01-01T00:00:00Z"
      );
      expect(mockReply.send).toHaveBeenCalledWith({
        message: [{ id: 1, timestamp: "2023-01-01T00:00:00Z" }],
      });
    });

    test("should handle zod validation errors for invalid timestamps", async () => {
      mockRequest.params = { timestamp: "invalid-timestamp" };

      await testHandler.findStamp(mockRequest, mockReply, true);

      expect(mockReply.code).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        success: false,
        error: expect.any(String), // Errore dal validator di Zod
      });
    });
  });
});
