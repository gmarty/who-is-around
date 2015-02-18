import { Service } from 'components/fxos-mvc/dist/mvc';

import /* global DNSSD */ 'components/dns-sd.js/dist/dns-sd';

var singletonGuard = {};
var instance = null;

export default
class LanService extends Service {
  constructor(guard) {
    console.log('LanService#constructor()');

    if (guard !== singletonGuard) {
      console.error('Cannot create singleton class.');
      return;
    }

    super();

    this.type = 'phone'; // We're a Firefox OS device!
    this.discoveryInterval = null;

    this.init();
  }

  init() {
    DNSSD.addEventListener('discovered', (evt) => {
      var peer = {
        id: evt.address,
        name: this._findName(evt.packet.records),
        connected: false,
        address: evt.address, // IP address
        type: this._guessType(evt.packet.records),
        method: 'lan',

        // Specific properties
        _packet: evt.packet
      };

      this._dispatchEvent('peer', peer);
    });
  }

  static get instance() {
    if (!instance) {
      instance = new this(singletonGuard);
    }
    return instance;
  }

  start() {
    DNSSD.startDiscovery();

    this.discoveryInterval = setInterval(() => {
      DNSSD.startDiscovery();
    }, 10000);
  }

  stop() {
    clearInterval(this.discoveryInterval);
  }

  setDeviceName(deviceName = '') {
    DNSSD.registerService('_fxos-whoisaround-' + this.type + '-' + deviceName + '._tcp.local', 8080, {});
  }

  _findName(records = {}) {
    var tentativeName = {};

    // Look for an AR record with recordType 1.
    tentativeName = records.AR.find(record => record.recordType === 1);
    if (tentativeName && tentativeName.name) {
      return this._formatName(tentativeName.name);
    }

    // Try the first AR record.
    tentativeName = records.AR[0];
    if (tentativeName && tentativeName.name) {
      return this._formatName(tentativeName.name);
    }

    // Try the first AN record.
    tentativeName = records.AN[0];
    if (tentativeName && tentativeName.data) {
      return this._formatName(tentativeName.data);
    }

    return '[No name]';
  }

  _formatName(name = '') {
    return name
      .replace(/\.local$/, '')
      .replace(/\.(_tcp|_udp)$/, '')
      .replace(/\._dns-sd$/, '')
      .replace(/^_fxos\-whoisaround\-[^\-]+\-/, '');
  }

  _guessType(records = {}) {
    // We reuse the name for now, but need a more complex logic in the future.
    var name = this._findName(records);

    if (name.contains('-phone-') || name.contains('-iPhone') || name.contains('iPhone')) {
      return 'phone';
    } else if (name.contains('-MacBook-Pro')) {
      return 'computer';
    }

    return 'unknown';
  }
}
