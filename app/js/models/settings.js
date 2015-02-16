import { Model } from 'components/fxos-mvc/dist/mvc';

export default
class Settings extends Model {
  constructor() {
    var properties = {
      peers: []
    };

    super(properties);
  }
}
