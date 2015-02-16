import { Controller } from 'components/fxos-mvc/dist/mvc';

import WifiDirectService from 'js/services/wifi-direct';
import BluetoothService from 'js/services/bluetooth';
import LanService from 'js/services/lan';

import Settings from 'js/models/settings';

import /* global _ */ 'components/lodash/lodash.min';

export default
class MainController extends Controller {
  constructor() {
    console.log('MainController#constructor()');

    this.settings = new Settings();

    this.init();
  }

  init() {
    console.log('MainController#init()');

    var addPeer = peer => {
      this.settings.peers.push(peer);
      this.settings.peers = _.uniq(this.settings.peers, peer => peer.id);
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
