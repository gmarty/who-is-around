import { Service } from 'components/fxos-mvc/dist/mvc';

var wifiP2pManager = navigator.mozWifiP2pManager;

var singletonGuard = {};
var instance = null;
var displayError = error => {
  var message = (error.message || error.name || 'Unknown error');
  console.error(message);
};

export default
class WifiDirectService extends Service {
  constructor(guard) {
    console.log('WifiDirectService#constructor()');

    if (guard !== singletonGuard) {
      console.error('Cannot create singleton class.');
      return;
    }

    super();

    this.init();
  }

  init() {
    wifiP2pManager.addEventListener('statuschange', this);
    wifiP2pManager.addEventListener('peerinfoupdate', this);

    this.setDeviceName('abc');
  }

  static get instance() {
    if (!instance) {
      instance = new this(singletonGuard);
    }
    return instance;
  }

  start() {
    wifiP2pManager.setScanEnabled(true)
      .then(result => {
        console.log('wifiP2pManager#setScanEnabled().then()');

        if (!result || !wifiP2pManager.enabled) {
          displayError(new Error('wifiP2pManager activation failed.'));
          return;
        }

        this._findPeers();
      })
      .catch(displayError);
  }

  stop() {
    wifiP2pManager.setScanEnabled(false)
      .then(result => {
        console.log('wifiP2pManager#setScanEnabled().then()');

        if (!result || wifiP2pManager.enabled) {
          displayError(new Error('wifiP2pManager deactivation failed.'));
        }
      })
      .catch(displayError);
  }

  setDeviceName(deviceName) {
    wifiP2pManager.setDeviceName(deviceName)
      .then(result => {
        console.log('wifiP2pManager#setDeviceName().then()');

        if (!result) {
          displayError(new Error('The device name could not be set.'));
        }
      })
      .catch(displayError);
  }

  _findPeers() {
    wifiP2pManager.getPeerList()
      .then(peers => {
        peers
          .map(peer => {
            return {
              id: peer.address,
              name: peer.name,
              connected: peer.connectionStatus === 'connected',
              address: peer.address,
              type: 'unknown',
              method: 'wifi-direct'
            };
          })
          .forEach(peer => {
            this._dispatchEvent('peer', peer);
          });
      })
      .catch(displayError);
  }

  handleEvent(evt) {
    switch (evt.type) {
      case 'peerinfoupdate':
      case 'statuschange':
        this._findPeers();
        break;
    }
  }
}
