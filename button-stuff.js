const Gpio = require('onoff').Gpio;

const led = new Gpio(14, 'out');
const button = new Gpio(4, 'in', 'falling');

const sensor = require('node-dht-sensor');

const { exec } = require('child_process');
 
function readTemperature() {
  sensor.read(11, 17, function(err, temperature, humidity) {
    if (err) {
      console.log(err);
      return;
    }

    const message = 'temp: ' + temperature.toFixed(1) + '°C, ' + 'humidity: ' + humidity.toFixed(1) + '%';
    
    console.log(message);

    exec(`pico2wave -w temp.wav "${message}" && aplay temp.wav`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(stdout);
    });

  });
}

let buttonState = 0.0;
function toggleLED() {
  buttonState = buttonState ? 0 : 1;
  led.writeSync(buttonState);
}
toggleLED();
 
button.watch((err, value) => {
  if (err) {
    throw err;
  }
  console.log("changed state", value)
  toggleLED();
  readTemperature();
});
 
process.on('SIGINT', () => {
  led.unexport();
  button.unexport();
});

console.log("app started");