import { boot } from 'quasar/wrappers';
import * as rules from 'src/const/rules.const';

declare module 'vue/types/vue' {
  interface Vue {
    $rule: typeof rules;
  }
}

export default boot(({ Vue }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  Vue.prototype.$rule = rules;
});
