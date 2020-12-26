<template>
  <q-card class="fit relative-position rounded-borders noise-gif text-white">
    <template v-if="stream">
      <div :id="domId" ref="player" class="agora-video-player" />
      <div class="absolute-top-left q-pa-sm" v-show="isMe">
        <q-btn flat dense icon="mdi-close-box" color="grey" @click="$RTCStore.leaveEvent()" />
      </div>

      <div class="absolute-top-right q-pa-sm">
        <q-chip v-show="isMe" color="primary" text-color="white" icon="mdi-account-circle" label="You" />
      </div>

      <div class="absolute-bottom text-subtitle2 q-pa-md">
        <div class="row q-gutter-md justify-between">
          <div>

          </div>
          <div>
            <q-btn dense flat :text-color="muteVideo.color" :icon="muteVideo.icon" size="md" @click="triggerMuteVideo" />
            <q-circular-progress
              :value="audioLevel * 100"
              show-value
              font-size="16px"
              class="text-red"
              size="md"
              :thickness="0.2"
              :color="muteAudio.color"
              icon=""
              track-color="transparent"
            >
              <q-icon class="cursor-pointer" dense round :color="muteAudio.color" :name="muteAudio.icon" size="sm" @click="triggerMuteAudio" />
            </q-circular-progress>
          </div>
        </div>
      </div>
    </template>
    <div v-else class="flex flex-center fit">
      <slot name="waiting">
        <q-icon size="xl" name="mdi-message-video" />
      </slot>
    </div>
  </q-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import AgoraRTC from 'agora-rtc-sdk';
import { uid } from 'quasar';

const muteVideoOpt = {
  state: true,
  icon: 'mdi-video-off',
  label: '暫停',
  color: 'red'
};

const unmuteVideoOpt = {
  state: false,
  icon: 'mdi-video',
  label: '繼續',
  color: 'positive'
};

const muteAudioOpt = {
  state: true,
  icon: 'mdi-microphone',
  label: '',
  color: 'primary'
};

const unmuteAudioOpt = {
  state: false,
  icon: 'mdi-microphone-off',
  label: '靜音',
  color: 'grey'
};

@Component<StreamPlayer>({
  name: 'StreamPlayer',
  mounted() {
    this.startSyncAudioLevel();
  },
  beforeDestroy () {
    if (this.stream) {
      if (this.stream.isPlaying()) {
        this.stream.stop();
      }
      this.stream.close();
    }

    this.clearSyncAudioLevel();
  }
})
export default class StreamPlayer extends Vue {
  @Prop() public stream!: AgoraRTC.Stream | null;
  @Prop({ default: false, type: Boolean }) public isMe!: boolean;

  public domId = uid();
  public muteVideo = muteVideoOpt;
  public muteAudio = muteAudioOpt;

  public audioLevel = 0;
  private audioLevelInterval = 0;

  public startSyncAudioLevel() {
    this.clearSyncAudioLevel();
    this.audioLevelInterval = setInterval(() => {
      this.audioLevel = this.stream?.getAudioLevel() ?? 0;
    });
  }

  public clearSyncAudioLevel() {
    clearInterval(this.audioLevelInterval);
  }

  @Watch('stream', { immediate: true })
  public watchStream(stream?: AgoraRTC.Stream | null) {
    stream && this.play();
  }

  public play() {
    this.$nextTick(function () {
      if (this.stream && !this.stream.isPlaying()) {
        this.stream.play(`${this.domId}`, { fit: 'cover' }, (err) => {
          if (err && err.status !== 'aborted') {
            console.warn('trigger autoplay policy');
          }
        });
      }
    });
  }

  public triggerMuteVideo() {
    this.muteVideo = this.muteVideo.state ? unmuteVideoOpt : muteVideoOpt;
    this.muteVideo.state ? this.stream?.unmuteVideo() : this.stream?.muteVideo();
  }

  public triggerMuteAudio() {
    this.muteAudio = this.muteAudio.state ? unmuteAudioOpt : muteAudioOpt;
    this.muteAudio.state ? this.stream?.unmuteAudio() : this.stream?.muteAudio();
  }

  public test () {
    this.stream?.getAudioTrack();
  }
}
</script>

<style>
.agora-video-player {
  height: 100%;
  width: 100%;
}

.noise-gif {
  background-image: url('/noise.gif');
  background-position: center;
  background-size: cover;
}
</style>