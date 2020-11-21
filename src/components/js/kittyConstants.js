import moment from 'moment';

const getDuration = (d, units) => moment.duration(d, units).asMilliseconds();

const KITTY_COOLDOWNS = [
  { name: 'Fast', durationName: '1m', duration: getDuration(1, 'minute'), },
  { name: 'Swift', durationName: '2m', duration: getDuration(2, 'minutes'), },
  { name: 'Swift II', durationName: '5m', duration: getDuration(5, 'minutes'), },
  { name: 'Snappy', durationName: '10m', duration: getDuration(10, 'minutes'), },
  { name: 'Snappy II', durationName: '30m', duration: getDuration(30, 'minutes'), },
  { name: 'Brisk', durationName: '1h', duration: getDuration(1, 'hour'), },
  { name: 'Brisk II', durationName: '2h', duration: getDuration(2, 'hours'), },
  { name: 'Plodding', durationName: '4h', duration: getDuration(4, 'hours'), },
  { name: 'Plodding II', durationName: '8h', duration: getDuration(8, 'hours'), },
  { name: 'Slow', durationName: '16h', duration: getDuration(16, 'hours'), },
  { name: 'Slow II', durationName: '1 day', duration: getDuration(1, 'day'), },
  { name: 'Sluggish', durationName: '2 days', duration: getDuration(2, 'days'), },
  { name: 'Sluggish II', durationName: '4 days', duration: getDuration(4, 'days'), },
  { name: 'Catatonic', durationName: '7 days', duration: getDuration(7, 'days'), },
];

const OFFER_TYPES = {
  sell: 'Sell',
  sire: 'Sire',
};

export const offerTypes = OFFER_TYPES;
export const kittyCooldowns = KITTY_COOLDOWNS;
export const zeroAddress = '0x0000000000000000000000000000000000000000';
