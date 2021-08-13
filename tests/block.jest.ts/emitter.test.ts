import Events from "../../src/events/emitter";
import { logger } from "../../src/logs/logger";
import { producer } from "../../src/stream/producer";

describe("Emitter", () => {

    beforeAll(() => {
        jest.spyOn(producer, 'send')
            .mockImplementation(() => {
                return null;
            });

        jest.spyOn(logger, 'info')
            .mockImplementation(() => {
                return null;
            });
    });

    test("it expects the on method to be called", () => {

        // TODO: need to figure how to spy on methods

        const events = Events.register(producer, logger);

        expect(events.on).toBeCalled();
    });

    test("it expects logger to be called", () => {

    });

    test("it expects producer to be called", () => {

    });
})