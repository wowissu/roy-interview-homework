import { Notify } from 'quasar';

Notify.registerType('agora-err', {
  position: 'top-right'
});

Notify.registerType('rtc-success', {
  position: 'top-right',
  color: 'positive'
});

Notify.registerType('rtc-info', {
  position: 'top-right',
  color: 'info'
});