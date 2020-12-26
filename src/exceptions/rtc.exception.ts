import { QNotifyOption } from 'quasar';

export enum RTCErrorCodeEnum {
  PublicFailure = 'PublicFailure',
  JoinFailure = 'JoinFailure',
}

export class RTCError extends Error {
  public static readonly Enum = RTCErrorCodeEnum;

  public static NotifyOpts: Record<RTCErrorCodeEnum, QNotifyOption> = {
    [RTCErrorCodeEnum.PublicFailure]: {
      type: 'negative',
      message: 'Publish Failure',
      icon: 'mdi-account-multiple-minus'
    },
    [RTCErrorCodeEnum.JoinFailure]: {
      type: 'negative',
      message: 'Publish Failure',
      icon: 'mdi-video-off'
    }
  };

  constructor(public code: RTCErrorCodeEnum, public notifyOpt = RTCError.NotifyOpts[code]) {
    super(typeof notifyOpt === 'string' ? notifyOpt : notifyOpt.message);

    this.name = `RTCError${code}`;
  }
}