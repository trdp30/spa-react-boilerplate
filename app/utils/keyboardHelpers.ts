import type { KeyboardEvent } from 'react';

export const handleEnterKeyPress = (
  event: KeyboardEvent<HTMLDivElement> | KeyboardEvent<HTMLButtonElement> | KeyboardEvent<HTMLSpanElement>,
  callback: (e?: KeyboardEvent) => unknown
) => {
  if (event.keyCode === 13 || event.code === 'Enter') {
    callback(event);
  }
};
