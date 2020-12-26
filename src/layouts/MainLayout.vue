<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="mdi-menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Agora Basic Video Call
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label header class="text-grey-8">
          Essential Links
        </q-item-label>
        <q-card>
          <q-card-section>
            <div>
              <q-input v-model="option.appid" label="* Appid" placeholder="Appid" clearable :rules="[$rule.required()]" />
            </div>
            <div>
              <q-input v-model="option.token" label="* Token" placeholder="Token" clearable :rules="[$rule.required()]" />
            </div>
            <div>
              <q-input v-model="option.channel" label="* Channel Name" placeholder="Channel Name" clearable :rules="[$rule.required()]" />
            </div>
          </q-card-section>
          <q-card-actions>
            <q-btn color="primary" :disabled="disableJoin" @click="$RTCStore.joinEvent(option)">
              join
            </q-btn>
            <q-btn color="primary" plain :disabled="!disableJoin" @click="$RTCStore.leaveEvent()">
              leave
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { extend } from 'quasar';
import { RTCClientOption } from 'src/agora-rtc-client';
import { Vue, Component } from 'vue-property-decorator';

@Component<MainLayout>({
  name: 'MainLayout',
})
export default class MainLayout extends Vue {
  public leftDrawerOpen = false;

  public option = extend<RTCClientOption>(true, {}, this.$RTCStore.option);

  get disableJoin() {
    return this.$RTCStore.disableJoin;
  }
}
</script>
