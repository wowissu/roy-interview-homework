import { store } from 'quasar/wrappers';
import RTCModule from 'src/store/rtc.module';
import Vuex from 'vuex';
import { getModule } from 'vuex-module-decorators';

declare module 'vue/types/vue' {
  interface Vue {
    $RTCStore: RTCModule;
  }
}

export interface StateInterface {
  // Define your own store structure, using submodules if needed
  // example: ExampleStateInterface;
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
  rtc: RTCModule
}

export default store(function ({ Vue }) {
  Vue.use(Vuex);

  const Store = new Vuex.Store<StateInterface>({
    modules: {
      rtc: RTCModule
    }

    // enable strict mode (adds overhead!)
    // for dev mode only
    // strict: !!process.env.DEBUGGING
  });

  Vue.prototype.$RTCStore = getModule(RTCModule, Store);
  Vue.prototype.$RTCStore.mountEvent();

  return Store;
});