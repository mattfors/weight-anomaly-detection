import { HidDataMapper } from './hid-scale.service';
import { HardwareScaleReportEvent } from './hardware-scale.interface';

export const DATA_MAPPERS: {[key: string]: HidDataMapper}  = {
  /* DYMO M25 25 Lb Digital Postal Scale */
  '2338-32771' : (arrayBuffer: ArrayBuffer): HardwareScaleReportEvent => {
    const d = new Uint8Array(arrayBuffer);
    let weight = (d[3] + 256 * d[4])/10;
    if (d[0] === 5) {
      weight *= -1;
    }
    return {
      units: d[1] === 2 ? 'g' : 'oz',
      weight
    };
  }
}
