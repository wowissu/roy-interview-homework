
export type Msg<T = any> = string | ((val: T, ...args: any[]) => string);
type Arr = readonly any[];

function returnMessage<T, A extends Arr = Arr>(val: T, message: Msg<T>, ...args: [...A]) {
  return typeof message === 'function' ? message(val, ...args) : message;
}

/** 必填 */
export const required = <T = any>(message: Msg<T> = '此為必填欄位' as string) => (val: T): string | true =>
  !(val === undefined || val === ('' as any) || val === null) || returnMessage<T>(val, message);
