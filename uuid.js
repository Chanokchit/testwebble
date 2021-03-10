var bluetoothDevice
// let options = {filters: [], optionalServices: []}

let filters = []
let options = {}

// let serviceUuid = '0000ffd5-0000-1000-8000-00805f9b34fb'
// let characteristicUuid = '0000ffd9-0000-1000-8000-00805f9b34fb'

let serviceUuid = 0xffd5
let characteristicUuid = 0xffd9;

filters.push({namePrefix: 'LOCK'})
options.filters = filters
options.filters.push({services: [serviceUuid]})

// options.optionalServices.push(serviceUuid)

let accept_all = {optionalServices: [serviceUuid], acceptAllDevices: true}

const onDisconnected = (event) => {
    const device = event.target;
    console.log(`> Device ${device.name} is disconnected.`);
  }

//*--------------------------------------------------
function onButtonClick() {

  console.log('Requesting Bluetooth Device...');
  console.log('with ' + JSON.stringify(options));

  navigator.bluetooth.requestDevice(options)

  .then(device => {
     console.log('> Name:             ' + device.name);
     console.log('> Id:               ' + device.id);
     console.log('> Connected:        ' + device.gatt.connected);
  })
  .catch(error => {
    console.log('Argh! ' + error);
  });
}

//* >>>>>>>>>>>>>>>>>>>>>>> wrtite <<<<<<<<<<<<<<<<<<

const writeTest = async() => {
  try {
    var hex1 = '2901020304010228'
    var hex2 = 'FE4F50454E00000000FD'

    var typedArray1 = new Uint8Array(hex1.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
    }))
    var typedArray2 = new Uint8Array(hex2.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
    }))

      console.log('Requesting Bluetooth Device...');
      const device  = await navigator.bluetooth.requestDevice(options);
      console.log('> Connected >>1:        ' + device.gatt.connected);
      
      console.log('Connecting to GATT Server...');
      const server = await device.gatt.connect();
      console.log('> Connected >>2:        ' + device.gatt.connected);

      await device.addEventListener('gattserverdisconnected', onDisconnected);

      console.log('Getting Service...');
      const service = await server.getPrimaryService(serviceUuid);

      console.log('Getting Characteristic...');
      const characteristic = await service.getCharacteristic(characteristicUuid);
  
      console.log("Writing...");

      // const encoder = new TextEncoder('utf-8');
      // const data1 = encoder.encode("2901020304010228");
      // const data2 = encoder.encode("FE4F50454E00000000FD");

      await characteristic.writeValue(typedArray1);
      console.log('> write >>1:        ' + hex1);

      await setTimeout(() => {
          characteristic.writeValue(typedArray2);
          console.log('> write >>2:        ' + hex2);
          console.log('> write success');
          
          setTimeout(() => {
            console.log('Disconnecting from Bluetooth Device...');
            device.gatt.disconnect();
          }, 5000);
          
      }, 6000);
      
    } catch(error) {
      console.log('Argh! ' + error);
    }
  
};
