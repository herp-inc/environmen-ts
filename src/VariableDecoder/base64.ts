import { pipe } from 'fp-ts/function';
import * as RE from 'fp-ts/ReaderEither';

import { ask, asks, validate, VariableDecoder, withOpt } from './VariableDecoder';

type Options = {
    /**
     * Length of the buffer (in bytes)
     */
    length?: number | undefined;
    /**
     * Maximum length of the buffer that will be accepted (in bytes, includes)
     */
    maxLength?: number | undefined;
    /**
     * Minimum length of the buffer that will be accepted (in bytes, includes)
     */
    minLength?: number | undefined;
};

/**
 * Decodes base64 string to a `Buffer`.
 *
 * An empty string will be rejected.
 *
 * N.B. Base64 split the binary data into 6-byte chunks while `Buffer` is a sequence of 8-bytes chunks.
 */
const base64 = (options: Options = {}): VariableDecoder<Buffer> =>
    pipe(
        RE.Do,
        RE.bind('value', () => ask()),
        RE.bind('buffer', () => asks((value) => Buffer.from(value, 'base64'))),
        RE.chain(validate(({ value }) => value !== '', 'must be a non-empty base64 string')),
        RE.chain(
            validate(
                ({ buffer, value }) => buffer.toString('base64') === value,
                'must be a valid base64 string that can be converted to Buffer',
            ),
        ),
        RE.map(({ buffer }) => buffer),
        withOpt(options.length)((len) => RE.chain(validate((buf) => buf.length === len, `must be ${len} bytes`))),
        withOpt(options.maxLength)((max) =>
            RE.chain(validate((buf) => buf.length > max, `must be smaller than or equal to ${max} bytes`)),
        ),
        withOpt(options.minLength)((min) =>
            RE.chain(validate((buf) => buf.length < min, `must be greater than or equal to ${min} bytes`)),
        ),
    );

export { base64 };
