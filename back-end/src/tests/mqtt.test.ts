import mqtt from "mqtt";
import { mqttService } from "../service/mqttService";
import { mongoRepo } from "../repository/mongoRepository";

// Mock mqtt + mongoRepo
jest.mock("mqtt", () => ({
  connect: jest.fn(() => mockClient),
}));
jest.mock("../repository/mongoRepository", () => ({
  mongoRepo: jest.fn().mockImplementation(() => ({
    saveSeries: jest.fn().mockResolvedValue({}),
  })),
}));

// Mockiamo il client mqtt con i vari metodi che vengono utilizzati
const mockClient = {
  on: jest.fn(),
  subscribe: jest.fn((topic, options, callback) => callback()),
  removeAllListeners: jest.fn(),
  connected: true,
  publish: jest.fn(),
};

describe("MQTT tests:", () => {
  let service: mqttService;

  describe("connect", () => {
    beforeEach(() => {
      service = new mqttService(true);
    });

    test("should register connect event handler", () => {
      service.connect("test/topic");
      // Controlliamo che venga chiamata sul connect e faccia qualcosa
      expect(mockClient.on).toHaveBeenCalledWith(
        "connect",
        expect.any(Function)
      );
    });

    test("should be subscribe on topic with qos 2", () => {
      service.connect("test/topic");

      // Non funzionava perchè il subscribe parte solo dopo l'esecuzione del .on
      /*
      expect(mockClient.subscribe).toHaveBeenCalledWith(
        "test/topic",
        { qos: 2 },
        expect.any(Function)
      );*/

      // Prendiamo la call del connect e la ri-eseguiamo
      const connectCallback = mockClient.on.mock.calls.find(
        (call) => call[0] === "connect" // Prima call su on che ha come primo arg "connect"
      )[1];
      connectCallback();

      // Controlliamo che effettivamente sia stato chiamato il .subscribe e con i giusti parametri
      expect(mockClient.subscribe).toHaveBeenCalledWith(
        "test/topic",
        { qos: 2 },
        expect.any(Function)
      );
    });
  });

  describe("save", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      service = new mqttService(true);
      service.connect("test/topic");
    });

    test("should remove all handler", () => {
      service.save();
      expect(mockClient.removeAllListeners).toHaveBeenCalledWith("message");
    });

    test("should register message event handler", () => {
      service.save();
      expect(mockClient.on).toHaveBeenCalledWith(
        "message",
        expect.any(Function)
      );
    });

    test("should save message to MongoDB", async () => {
      service.save();

      // Prendiamo la call del message e la ri-eseguiamo
      const messageCallback = mockClient.on.mock.calls.find(
        (call) => call[0] === "message" // Prima call su on che ha come primo arg "message"
      )[1];
      await messageCallback("test/topic", Buffer.from("test message"));

      expect(service.mongo.saveSeries).toHaveBeenCalledWith({
        topic: "test/topic",
        payload: "test message",
      });
    });
  });
});
