import { View } from 'components/fxos-mvc/dist/mvc';

const MIN_TOP = 5;
const MAX_TOP = 70;
const MAX_BLUR = 0.3;

var peersTemplate = (style, peer) => `
  <div data-character="${style.character}"
      style="
        top: ${style.top}%;
        left: ${style.left}%;
        width: ${style.width}vh;
        height: ${style.height}vh;
        z-index: ${style.top};"
      >
    <div class="shadow"></div>
    <div class="character" style="filter: blur(${style.blur}px);"></div>
    <div class="name"><span>${peer.name}</span></div>
  </div>
  `;

var styles = Object.create(null);

export default
class HomeView extends View {
  constructor(options) {
    console.log('HomeView#constructor()');

    super(options);
  }

  init(controller) {
    console.log('HomeView#init()');

    super(controller);

    this.characters = this.$('#characters');
  }

  setActive(active) {
    this.el.classList.toggle('active', active);
  }

  renderPeers(peers = []) {
    console.log('HomeView#renderPeer()', peers);

    peers.forEach(peer => {
      if (styles[peer.id]) {
        return;
      }

      var character = 'penguin';

      switch (peer.type) {
        case 'audio-card':
          break;
        case 'audio-input-microphone':
          break;
        case 'battery':
          break;
        case 'camera-photo':
          break;
        case 'camera-video':
          break;
        case 'camera-web':
          break;
        case 'drive-harddisk':
          break;
        case 'drive-optical':
          break;
        case 'drive-removable-media':
          break;
        case 'input-gaming':
          break;
        case 'input-keyboard':
          character = 'keyboard';
          break;
        case 'input-mouse':
          break;
        case 'input-tablet':
          break;
        case 'media-flash':
          break;
        case 'media-floppy':
          break;
        case 'media-optical':
          break;
        case 'media-tape':
          break;
        case 'modem':
          break;
        case 'multimedia-player':
          break;
        case 'network-wired':
          break;
        case 'network-wireless':
          break;
        case 'printer':
          break;
        case 'scanner':
          break;
        case 'video-display':
          break;
        case 'computer':
          character = 'computer';
          break;
        case 'pda':
        case 'phone':
          character = 'phone';
          break;
        case 'tablet':
          character = 'tablet';
          break;
        default:
          character = 'penguin';
          break;
      }

      var top = Math.round(Math.random() * (MAX_TOP - MIN_TOP)) + MIN_TOP; // From MIN_TOP% to MAX_TOP%.
      var left = Math.round(Math.random() * 100); // From 0% to 100%.
      var size = 10 + Math.round(top / MAX_TOP * 20); // From 10 to 30 depending on top.
      var blur = MAX_BLUR - (top / MAX_TOP * MAX_BLUR); // From MAX_BLUR to 0 depending on top.

      styles[peer.id] = {
        character: character,
        top: top, // 45
        left: left, // 55
        width: size,
        height: size,
        blur: blur
      };

      let div = document.createElement('div');
      div.innerHTML = peersTemplate(styles[peer.id], peer);
      this.characters.appendChild(div.firstElementChild);
    });
  }
}
