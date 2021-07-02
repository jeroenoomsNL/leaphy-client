const SerialPort = require("serialport");
const AvrGirl = require("avrgirl-arduino");

class DeviceManager {
    constructor(logger) {
        this.activeSerial = null;
        this.avrGirl = new AvrGirl({
             board: 'uno'
        });
        this.logger = logger;
    }

    subscribeToSerialData = async (event, payload) => {
        const lineParser = new SerialPort.parsers.Readline("\n");
        this.activeSerial = new SerialPort(payload.address, { baudRate: 115200 });
        this.activeSerial.pipe(lineParser)
        lineParser.on('data', function (data) {
            const serialDataReceivedMessage = { event: "SERIAL_DATA", payload: data };
            event.sender.send('backend-message', serialDataReceivedMessage);
        });
    }

    updateDevice = async (event, originalPayload) => {
        this.logger.verbose('Update Device command received');
        
        const payload = {...originalPayload, address: originalPayload.path};

        if(this.activeSerial?.isOpen){
            this.activeSerial.close();
        }
        
        const updatingMessage = { event: "UPDATE_STARTED", message: "UPDATE_STARTED", displayTimeout: 0 };
        event.sender.send('backend-message', updatingMessage);

        this.avrGirl.flash(`${payload.sketchPath}.${payload.ext}`, (error) => {
            if (error) {
                this.logger.error("Upload failed", error);
                var unsuccesfulUploadMessage = { event: "UPDATE_FAILED", message: "UPDATE_FAILED", payload: payload, displayTimeout: 3000 };
                event.sender.send('backend-message', unsuccesfulUploadMessage);
                return;
            }
        })

        await this.subscribeToSerialData(event, payload);
        
        const updateCompleteMessage = { event: "UPDATE_COMPLETE", message: "UPDATE_COMPLETE", payload: payload, displayTimeout: 3000 };
        event.sender.send('backend-message', updateCompleteMessage);
    }

    getDevices = async (event) => {
        this.logger.verbose('Get Serial Devices command received');

        this.avrGirl.listPorts((_err, ports) => {
            const eligibleBoards = ports.filter(device => device.path.indexOf("usbserial") != -1);
            
            let message;
            if (!eligibleBoards.length) {
                message = { event: "NO_DEVICES_FOUND", message: "NO_DEVICES_FOUND", displayTimeout: -1 };
            } else {
                message = { event: "DEVICES_FOUND", message: "DEVICES_FOUND", payload: eligibleBoards, displayTimeout: 0 };
            }
            event.sender.send('backend-message', message);
        });
    }
}

module.exports = DeviceManager;