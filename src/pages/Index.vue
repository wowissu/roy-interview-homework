<template>
  <q-page class="col grid-wrap fit" :class="`got-friend-${remoteStreams.length}`" >
    <!-- <div class="hello">
      <div class="agora-view q-mt-lg">
        <q-card class="agora-video q-pa-none">
          <q-responsive :ratio="4/3">
            <div class="rounded-borders bg-primary text-white flex flex-center">
              <StreamPlayer v-if="localStream" :stream="localStream" :dom-id="localStream.getId()" />
              <div v-else>
                <q-icon size="xl" name="mdi-message-video"></q-icon>
              </div>
            </div>
          </q-responsive>
        </q-card>

      </div>
    </div> -->

    <div class="mm">
      <StreamPlayer :stream="localStream">
        <template #bar>
          <q-chip color="primary" text-color="white" icon="mdi-account-circle">
            You
          </q-chip>
        </template>
      </StreamPlayer>
    </div>

    <div v-for="(remoteStream, index) in remoteStreams" :key="index" :class="gridorder[index]">
      <div class="rounded-borders bg-primary text-white fit">
        <StreamPlayer :stream="remoteStream" />
      </div>
    </div>

    <!-- <div class="main-box full-width col bg-primary justify-center flex">
      <StreamPlayer v-if="focusStream" :stream="focusStream" :dom-id="focusStream.getId()" />
      <div v-else class="text-white col flex justify-center q-pa-xl">
        <q-icon size="xl" name="mdi-message-video"></q-icon>
      </div>
    </div>
    <div class="box-nav full-width flex flex-start">
      <div class="nav-video">
        <div class="fit">
          <div class="rounded-borders bg-primary text-white flex flex-center">
            <StreamPlayer v-if="localStream" :stream="localStream" :dom-id="localStream.getId()" />
            <div v-else>
              <q-icon size="xl" name="mdi-message-video"></q-icon>
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </q-page>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import StreamPlayer from 'components/StreamPlayer.vue';
import { RTCClientOption } from 'src/agora-rtc-client';
import RTCModule from 'src/store/rtc.module';

@Component<HomePage>({
  name: 'HomePage',
  components: { StreamPlayer },
  created() {
    console.log(this.rtc);

    this.rtc.on('publish-stream', ({ stream }) => {
      if (this.focusStream === null) {
        this.focusStream = stream;
        console.log({stream});
      }
    })
  }
})
export default class HomePage extends Vue {

  @Prop({ type: String }) public msg!: string;

  public focusStream: RTCModule['localStream'] = null;

  public gridorder = [
    'tl',
    'tm',
    'bl',
    'br',
    'ml',
    'mr',
    'tr',
    'bm',
  ]

  public option: RTCClientOption = {
    appid: '1b8b222b491542f9943051af647cf6e8',
    token: '0061b8b222b491542f9943051af647cf6e8IACa4TuwJgB+PCwWgK99SqCZUUuO6BN4MWIMv0HeI/o7vTQ8Hc8AAAAAEADkOavBO1bnXwEAAQA8Vudf',
    uid: null,
    channel: 'interview'
  };

  get rtc() {
    return this.$RTCStore.rtc;
  }

  get localStream() {
    return this.$RTCStore.localStream
  }

  get remoteStreams() {
    return this.$RTCStore.remoteStreams;
  }

  public judge(detail: string) {
    this.$q.notify({
      type: 'warning',
      message: `Please enter the ${detail}`,
      position: 'top-left'
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .agora-title {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    font-size: 32px;
    font-weight: bold;
    text-align: center;
    color: #2c3e50;
  }
  .agora-view {
    display: flex;
    flex-wrap: wrap;
  }
  .agora-video {
    width: 100%;
  }
  .agora-input {
    margin: 20px;
    width: 320px;
  }
  .agora-text {
    margin: 5px;
    font-size: 16px;
    font-weight: bold;
  }
  .agora-button {
    display: flex;
    width: 160px;
    justify-content: space-between;
    margin: 20px;
  }
  /* .agora-video {
    width: 320px;
    height: 240px;
  } */

  /* .main-box {
    width: 100%;
  } */

  .box-nav {
    height: 10vw;
    min-height: 60px;

    .nav-video {
      height: 100%;
      width: min(30vw, 300px);
    }
  }


  .grid-wrap {
    display: grid;
    grid-template-columns: 33.33% 33.33% 33.33%;
    grid-template-rows: 33.33% 33.33% 33.33%;
    grid-template-areas:
      "tl tm tr"
      "ml mm mr"
      "bl bm br";

    &.got-friend-0 {
      grid-template-columns: auto 50vw auto;
      grid-template-rows: auto 50vw auto;
    }

    &.got-friend-1 {
      grid-template-columns: 50% 50% auto;
      grid-template-rows: 50% 50% auto;
    }

    &.got-friend-2, &.got-friend-3 {
      grid-template-columns: 50% 50% auto;
      grid-template-rows: 50% 50% auto;
    }

    .tl  {
      grid-area: tl;
    }
    .ml  {
      grid-area: ml;
    }
    .bl  {
      grid-area: bl;
    }
    .tm {
      grid-area: tm;
    }
    .mm {
      grid-area: mm;
    }
    .bm {
      grid-area: bm;
    }
    .tr {
      grid-area: tr;
    }
    .mr {
      grid-area: mr;
    }
    .br {
      grid-area: br;
    }
  }

  // .tl, .tm, .tr {
  //   background-color: purple;
  // }
</style>
