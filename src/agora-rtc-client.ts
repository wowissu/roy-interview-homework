/* eslint-disable no-console */

import AgoraRTC from 'agora-rtc-sdk';
import { EventEmitter } from 'events';
import { RTCError } from 'src/exceptions/rtc.exception';

export interface RTCClientOption {
  appid: string,
  channel: string,
  uid: string | number | null,
  token: string
}

export default class RTCClient {
  public client: AgoraRTC.Client | null = null;
  public localStream: AgoraRTC.Stream | null = null;
  public option: RTCClientOption = {
    appid: '',
    channel: '',
    uid: '',
    token: ''
  };

  public eventBus = new EventEmitter();

  // init client and Join a channel
  public joinChannel (option: RTCClientOption) {
    return new Promise((resolve, reject) => {
      this.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

      console.log(this.option);

      this.client.init(option.appid, () => {
        console.log('init success');

        this.clientListener();
        this.client?.join(option.token ? option.token : null, option.channel, null, (uid) => {
          console.log('join channel: ' + this.option.channel + ' success, uid: ', uid);

          this.option = {
            appid: option.appid,
            token: option.token,
            channel: option.channel,
            uid: uid
          };
          resolve();
        }, (err) => {
          console.error('client join failed', err);
        });
      }, (err) => {
        reject(err);
        console.error(err);
      });
      console.log('[agora-vue] appId', option.appid);
    });
  }

  public publishStream() {
    return new Promise<AgoraRTC.Stream>((resolve, reject) => {
      // Create a local stream
      this.localStream = AgoraRTC.createStream({
        streamID: this.option.uid ?? undefined,
        audio: true,
        video: true,
        screen: false
      });

      const stream = this.localStream;

      // Initialize the local stream
      stream.init(() => {
        console.log('init local stream success');

        this.eventBus.emit('publish-stream', { stream });
        resolve(stream);
        // Publish the local stream
        this.client?.publish(stream, (err) => {
          console.log('publish failed');
          console.error(err);
        });
      }, (err) => {
        reject(new RTCError(RTCError.Enum.PublicFailure, err.msg));
        console.error('init local stream failed ', err);
      });
    });


  }

  public clientListener () {
    const client = this.client;

    client?.on('stream-added', (evt) => {
      // The stream is added to the channel but not locally subscribed
      this.eventBus.emit('stream-added', evt);
    });
    client?.on('stream-subscribed', (evt) => {
      this.eventBus.emit('stream-subscribed', evt);
    });
    client?.on('stream-removed', (evt) => {
      this.eventBus.emit('stream-removed', evt);
    });
    client?.on('peer-online', (evt) => {
      this.eventBus.emit('peer-online', evt);
    });
    client?.on('peer-leave', (evt) => {
      this.eventBus.emit('peer-leave', evt);
    });
  }

  public on (...[eventName, callback]: Parameters<EventEmitter['on']>) {
    this.eventBus.on(eventName, callback);
  }

  public leaveChannel () {
    return new Promise((resolve, reject) => {
      // Leave the channel
      this.localStream && this.client?.unpublish(this.localStream, (err) => {
        console.log(err);
      });

      this.client?.leave(() => {
        // Stop playing the local stream
        if (this.localStream?.isPlaying()) {
          this.localStream.stop();
        }
        // Close the local stream
        this.localStream?.close();
        this.client = null;
        resolve();
        console.log('client leaves channel success');
      }, (err) => {
        reject(err);
        console.log('channel leave failed');
        console.error(err);
      });
    });
  }
}
