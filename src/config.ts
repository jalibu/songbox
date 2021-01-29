module.exports = {
    webPort: 8080, // Must be > 1024; Else the script must run as administrator
    printer: {
        debug: true, // false for physical printing
        port: '/dev/ttyS0',
        baudRate: 19200,
        legacyPrint: false,
        tempFile: '/tmp/printFile.png'
    }
};