<template>
  <q-card class="fit relative-position rounded-borders bg-primary text-white" >
    <template v-if="stream">
      <div :id="domId" ref="player" class="agora-video-player" />
      <div class="absolute-bottom text-subtitle2 text-center ">
        <slot name="bar"></slot>
      </div>
    </template>
    <div v-else class="flex flex-center fit">
      <q-icon size="xl" name="mdi-message-video"></q-icon>
    </div>
  </q-card>

</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import AgoraRTC from 'agora-rtc-sdk';
import { uid } from 'quasar';

@Component<StreamPlayer>({
  name: 'StreamPlayer',
  beforeDestroy () {
    if (this.stream) {
      if (this.stream.isPlaying()) {
        this.stream.stop();
      }
      this.stream.close();
    }
  }
})
export default class StreamPlayer extends Vue {
  @Prop() public stream!: AgoraRTC.Stream | null;

  public domId = uid();


  @Watch('stream', { immediate: true })
  public watchStream(stream?: AgoraRTC.Stream | null) {

    stream && this.play();
  }

  public play() {
    this.$nextTick(function () {
      if (this.stream && !this.stream.isPlaying()) {
        console.log(this.domId);
        this.stream.play(`${this.domId}`, { fit: 'cover' }, (err) => {
          if (err && err.status !== 'aborted') {
            console.warn('trigger autoplay policy');
          }
        });
      }
    });
  }
}
</script>

<style>
.agora-video-player {
  height: 100%;
  width: 100%;
}
</style>