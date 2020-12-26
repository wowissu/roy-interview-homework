import { Mutation, Action, Module, VuexModule } from 'vuex-module-decorators';
import RTCClient, { RTCClientOption } from 'src/agora-rtc-client';
import { EventEmitter } from 'events';
import AgoraRTC from 'agora-rtc-sdk';
import { Notify } from 'quasar';

import { RTCError } from 'src/exceptions/rtc.exception';
import { log } from 'src/utils';

class JudgeError extends Error {
  public name = 'JudgeError';
}

@Module<RTCModule>({
  name: 'rtc',
  namespaced: true,
  stateFactory: true
})
export default class RTCModule extends VuexModule {
  public client: AgoraRTC.Client | null = null;
  public localStream: AgoraRTC.Stream | null = null;
  public remoteStreams: AgoraRTC.Stream[] = [];
  public eventBus = new EventEmitter();
  public disableJoin = false;
  public rtc = new RTCClient();
  public option: RTCClientOption = {
    appid: '1b8b222b491542f9943051af647cf6e8',
    token: '0061b8b222b491542f9943051af647cf6e8IACa4TuwJgB+PCwWgK99SqCZUUuO6BN4MWIMv0HeI/o7vTQ8Hc8AAAAAEADkOavBO1bnXwEAAQA8Vudf',
    channel: 'interview',
    uid: null
  };

  @Mutation
  private clearStream() {
    this.localStream = null;
    this.remoteStreams = [];
  }

  @Mutation
  private setDisable(val: RTCModule['disableJoin']) {
    this.disableJoin = val;
  }

  @Mutation
  public setLocalStream(val: RTCModule['localStream']) {
    this.localStream = val;
  }

  @Mutation
  public setRemoteStreams(val: RTCModule['remoteStreams']) {
    this.remoteStreams = val;
  }

  @Mutation
  public mountEvent(rtc = this.rtc) {
    rtc.on('stream-added', (evt) => {
      const { stream } = evt;

      log('[agora] [stream-added] stream-added', stream.getId());
      rtc.client?.subscribe(stream);
    });

    rtc.on('stream-subscribed', (evt) => {
      const { stream } = evt;

      log('[agora] [stream-subscribed] stream-added', stream.getId());
      if (!this.remoteStreams.find((it) => it.getId() === stream.getId())) {
        this.remoteStreams.push(stream);
      }
    });

    rtc.on('stream-removed', (evt) => {
      const { stream } = evt;

      log('[agora] [stream-removed] stream-removed', stream.getId());
      this.remoteStreams = this.remoteStreams.filter((it) => it.getId() !== stream.getId());
    });

    rtc.on('peer-online', (evt) => {
      Notify.create({
        type: 'rtc-info',
        message: `Peer ${evt.uid} is online`
      });
    });

    rtc.on('peer-leave', (evt) => {
      Notify.create({
        type: 'warning',
        message: `Peer ${evt.uid} already leave`
      });

      this.remoteStreams = this.remoteStreams.filter((it) => it.getId() !== evt.uid);
    });

  }

  @Action({ rawError: true })
  public async joinEvent(option = this.option) {
    try {
      if (!option.appid) {
        throw new JudgeError('Appid');
      }
      if (!option.channel) {
        throw new JudgeError('Channel Name');
      }

      this.setDisable(true);
      await this.rtc.joinChannel(option);

      Notify.create({
        message: 'Join Success',
        type: 'rtc-success',
        icon: 'mdi-account-check'
      });

      try {
        this.setLocalStream(await this.rtc.publishStream());

        Notify.create({
          message: 'Publish Success',
          type: 'rtc-success',
          icon: 'mdi-video-check'
        });
      } catch (err) {
        console.error('publish local error', err);
        throw new RTCError(RTCError.Enum.PublicFailure);
      }
    } catch (err) {
      if (err instanceof RTCError) {
        Notify.create(err.notifyOpt);
      } else if (err instanceof JudgeError) {
        Notify.create({
          type: 'warning',
          message: `Please enter the ${err.message}`
        });
      }

      console.error('join channel error', err);
    }
  }

  @Action({ rawError: true })
  public async leaveEvent () {
    this.setDisable(false);
    try {
      this.clearStream();
      await this.rtc.leaveChannel();

      Notify.create({
        message: 'Leave Success',
        type: 'rtc-info'
      });
    } catch (err) {
      Notify.create({
        type: 'negative',
        message: 'Leave Failure'
      });

      console.error('leave error', err);
    }
  }
}

