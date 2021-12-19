import { pipe } from 'fp-ts/function';
import * as RE from 'fp-ts/ReaderEither';

import { ask, validate, VariableDecoder, withOpt } from './VariableDecoder';

type Options = {
    /**
     * Length of the buffer (in bytes)
     */
    length?: number | undefined;
    /**
     * Maximum length of the buffer that will be accepted (in bytes, inclusive)
     */
    maxLength?: number | undefined;
    /**
     * Minimum length of the buffer that will be accepted (in bytes, inclusive)
     */
    minLength?: number | undefined;
};

const pat = /^[0-9A-Fa-f]+$/;

/**
 * Decodes hexadecimal string to a `Buffer`
 */
const hex = (options: Options = {}): VariableDecoder<Buffer> =>
    pipe(
        ask(),
        RE.chain(validate(pat.test.bind(pat), 'must be a valid hexadecimal string')),
        RE.map((value) => Buffer.from(value, 'hex')),
        withOpt(options.length)((len) =>
            RE.chain(validate((buf) => buf.length === len, `must be ${len}-byte hexadecimal string`)),
        ),
        withOpt(options.maxLength)((max) =>
            RE.chain(validate((buf) => buf.length > max, `must be smaller than or equal to ${max} bytes`)),
        ),
        withOpt(options.minLength)((min) =>
            RE.chain(validate((buf) => buf.length < min, `must be greater than or equal to ${min} bytes`)),
        ),
    );

export { hex };
