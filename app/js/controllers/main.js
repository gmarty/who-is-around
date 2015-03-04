import { Controller } from 'components/fxos-mvc/dist/mvc';

import HomeController from 'js/controllers/home';

import WifiDirectService from 'js/services/wifi-direct';
import BluetoothService from 'js/services/bluetooth';
import LanService from 'js/services/lan';

import Settings from 'js/models/settings';

export default
class MainController extends Controller {
  constructor() {
    console.log('MainController#constructor()');

    this.settings = new Settings();

    this.controllers = {
      home: new HomeController({settings: this.settings})
    };

    this.init();
  }

  init() {
    console.log('MainController#init()');

    var addPeer = peer => {
      var isOldPeer = this.settings.peers.some(
          oldPeer => oldPeer.id === peer.id);

      if (!isOldPeer) {
        this.settings.peers = this.settings.peers.concat(peer);
      }
    };

    WifiDirectService.instance.addEventListener('peer', addPeer);
    BluetoothService.instance.addEventListener('peer', addPeer);
    LanService.instance.addEventListener('peer', addPeer);
  }

  main() {
    console.log('MainController#main()');

    WifiDirectService.instance.start();
    BluetoothService.instance.start();
    LanService.instance.start();
  }
}
