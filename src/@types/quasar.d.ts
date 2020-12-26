import 'quasar';
import { QVueGlobals } from 'quasar';

declare module 'quasar' {
  export type QNotifyOption = FirstArgument<QVueGlobals['notify']>;
}

