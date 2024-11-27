import { MessageDescriptor } from 'react-intl';

/**
 * The `transformMessages` function transforms a Record of MessageDescriptor objects into a Record of string messages by
 * extracting the id and defaultMessage properties.
 * @param messages - `Record<string, MessageDescriptor>` - an object where keys are strings and values are of type
 * `MessageDescriptor`.
 * @returns The `transformMessages` function returns a transformed object where the keys are the `id` values of the
 * messages and the values are the `defaultMessage` values of the messages.
 */

export const transformMessages = (messages: Record<string, MessageDescriptor>): Record<string, string> => {
  const transformed: Record<string, string> = {};
  Object.keys(messages).forEach((key) => {
    const message = messages[key];
    if (typeof message.id === 'string' && typeof message.defaultMessage === 'string') {
      transformed[message.id] = message.defaultMessage;
    }
  });
  return transformed;
};
