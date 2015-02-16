import { Service } from 'components/fxos-mvc/dist/mvc';

var bluetoothManager = navigator.mozBluetooth;

var singletonGuard = {};
var instance = null;
var displayError = error => {
  var message = (error.message || error.name || 'Unknown error');
  console.error(message);
};

export default
class BluetoothService extends Service {
  constructor(guard) {
    console.log('BluetoothService#constructor()');

    if (guard !== singletonGuard) {
      console.error('Cannot create singleton class.');
      return;
    }

    super();

    this.started = false;

    this.init();
  }

  init() {
  }

  static get instance() {
    if (!instance) {
      instance = new this(singletonGuard);
    }
    return instance;
  }

  start() {
    this.started = true;

    // Enable the bluetooth setting.
    navigator.mozSettings.createLock().set({'bluetooth.enabled': true})
      .then(() => {
        console.log('mozSettings#createLock().then()');

        // Get the default adapter.
        bluetoothManager.getDefaultAdapter()
          .then((adapter) => {
            console.log('bluetoothManager#getDefaultAdapter().then()');

            if (!adapter) {
              displayError(new Error('Cannot get default adapter.'));
              return;
            }

            this.adapter = adapter;

            this.adapter.addEventListener('devicefound', this);
            this.adapter.addEventListener('discoverystatechanged', this);
            this.adapter.addEventListener('pairedstatuschanged', this);

            this.setDeviceName('abc');
            this._setDiscoverable();
            this._findPeers();
          })
          .catch(displayError);
      })
      .catch(displayError);
  }

  stop() {
    this.started = false;

    if (!this.adapter) {
      return;
    }

    this.adapter.stopDiscovery()
      .then(() => {
        console.log('BluetoothAdapter#stopDiscovery().then()');
      })
      .catch(displayError);
  }

  setDeviceName(deviceName) {
    if (!this.adapter) {
      return;
    }

    this.adapter.setName(deviceName)
      .then(() => {
        console.log('BluetoothAdapter#setName().then()');
      })
      .catch(displayError);
  }

  _setDiscoverable() {
    if (!this.adapter) {
      return;
    }

    this.adapter.setDiscoverable(true)
      .then(() => {
        console.log('BluetoothAdapter#setDiscoverable().then()');
      })
      .catch(displayError);
  }

  _findPeers() {
    if (!this.started) {
      return;
    }

    if (!this.adapter) {
      return;
    }

    this.adapter.startDiscovery()
      .then(() => {
        console.log('BluetoothAdapter#startDiscovery().then()');
      })
      .catch(displayError);
  }

  handleEvent(evt) {
    switch (evt.type) {
      case 'devicefound':
        var peer = {
          id: evt.device.address,
          name: evt.device.name,
          connected: evt.device.connected,
          address: evt.device.address,
          type: evt.device.icon,
          method: 'bluetooth',
          // Specific properties
          'class': evt.device.class,
          paired: evt.device.paired
        };

        if (!peer.name) {
          peer.name = '[No name]';
        }

        this._dispatchEvent('peer', peer);
        break;

      case 'discoverystatechanged':
        if (!evt.discovering) {
          this._findPeers();
        }
        break;

      case 'pairedstatuschanged':
        console.log(evt.type, evt);
        break;
    }
  }
}
