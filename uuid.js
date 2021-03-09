var bluetoothDevice
let options = {filters: [], optionalServices: []}


let serviceUuid = '0000ffd5-0000-1000-8000-00805f9b34fb'
let characteristicUuid = '0000ffd9-0000-1000-8000-00805f9b34fb'

// let characteristicUuid = 0xfff1;
// let serviceUuid = 0xffd5
// let characteristicUuid = 0xffd9;

options.filters.push({services: [serviceUuid]})
options.optionalServices.push(serviceUuid)

let accept_all = {optionalServices: [serviceUuid], acceptAllDevices: true}

const onDisconnected = (event) => {
    const device = event.target;
    console.log(`> Device ${device.name} is disconnected.`);
  }

//* >>>>>>>>>>>>>>>>>>>>>>> wrtite <<<<<<<<<<<<<<<<<<

  const writeTest = async() => {
    try {
        console.log('Requesting Bluetooth Device...');
        const device  = await navigator.bluetooth.requestDevice(options);
    
        console.log('Connecting to GATT Server...');
        const server = await device.gatt.connect();

        await device.addEventListener('gattserverdisconnected', onDisconnected);
    
        console.log('Getting Service...');
        const service = await server.getPrimaryService(serviceUuid);
    
        console.log('Getting Characteristic...');
        const characteristic = await service.getCharacteristic(characteristicUuid);
    
        console.log("Writing...");
        // data = Uint32Array.of(6161616161)
        const encoder = new TextEncoder('utf-8');
        const data1 = encoder.encode("2901020304010228");
        const data2 = encoder.encode("FE4F50454E00000000FD");
        // const data3 = encoder.encode("data_3 ====> bf1d049c6791b9c7c884f7e7c5d9fef3c216808c");
        await characteristic.writeValue(data1);
        await characteristic.writeValue(data2);
        // await characteristic.writeValue(data3);
    
        console.log('> write success');
      } catch(error) {
        console.log('Argh! ' + error);
      }
    
  };
