import moment from 'moment';

const KITTY_COOLDOWNS = [
    { name: 'Fast', durationName: '1m', duration: moment.duration(1, 'minute') },
    { name: 'Swift', durationName: '2m', duration: moment.duration(2, 'minutes') },
    { name: 'Swift II', durationName: '5m', duration: moment.duration(5, 'minutes') },
    { name: 'Snappy', durationName: '10m', duration: moment.duration(10, 'minutes') },
    { name: 'Snappy II', durationName: '30m', duration: moment.duration(30, 'minutes') },
    { name: 'Brisk', durationName: '1h', duration: moment.duration(1, 'hour') },
    { name: 'Brisk II', durationName: '2h', duration: moment.duration(2, 'hours') },
    { name: 'Plodding', durationName: '4h', duration: moment.duration(4, 'hours') },
    { name: 'Plodding II', durationName: '8h', duration: moment.duration(8, 'hours'), },
    { name: 'Slow', durationName: '16h', duration: moment.duration(16, 'hours') },
    { name: 'Slow II', durationName: '1 day', duration: moment.duration(1, 'day') },
    { name: 'Sluggish', durationName: '2 days', duration: moment.duration(2, 'days') },
    { name: 'Sluggish II', durationName: '4 days', duration: moment.duration(4, 'days') },
    { name: 'Catatonic', durationName: '7 days', duration: moment.duration(7, 'days') },
];

const OFFER_TYPES = {
    sell: 'Sell',
    sire: 'Sire'
}

export const offerTypes = OFFER_TYPES;
export const kittyCooldowns = KITTY_COOLDOWNS;