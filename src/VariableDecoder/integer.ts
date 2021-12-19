import { pipe } from 'fp-ts/function';
import * as RE from 'fp-ts/ReaderEither';

import { asks, validate, VariableDecoder, withOpt } from './VariableDecoder';

type Options = {
    /**
     * Maximum value that will be accepted (inclusive)
     */
    max?: number | undefined;
    /**
     * Minimum value that will be accepted (inclusive)
     */
    min?: number | undefined;
    /**
     * Radix passed to the second argument of `Number.parseInt()`.
     * Defaults to `10`.
     */
    radix?: number | undefined;
};

/**
 * Decodes an integer with `Number.parseInt()`.
 *
 * The decoded result must be between `Number.MIN_SAFE_INTEGER` and `Number.MAX_SAFE_INTEGER`.
 */
const integer = (options?: Options): VariableDecoder<number> =>
    pipe(
        asks((str) => Number.parseInt(str, options?.radix ?? 10)),
        RE.chain(validate<number>(Number.isInteger, 'must be an integer')),
        RE.chain(validate<number>(Number.isSafeInteger, 'must be a safe integer')),
        withOpt(options?.max)((max) => RE.chain(validate((n) => n <= max, `must be smaller than or equal to ${max}`))),
        withOpt(options?.min)((min) => RE.chain(validate((n) => n >= min, `must be greater than or equal to ${min}`))),
    );

export { integer };
