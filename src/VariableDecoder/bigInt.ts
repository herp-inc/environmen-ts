import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RE from 'fp-ts/ReaderEither';

import { asks, unwrap, validate, VariableDecoder, withOpt } from './VariableDecoder';

type Options = {
    /**
     * Maximum value that will be accepted (inclusive)
     */
    max?: BigInt | undefined;
    /**
     * Minimum value that will be accepted (inclusive)
     */
    min?: BigInt | undefined;
};

/**
 * Decodes a BigInt.
 */
const bigInt = (options: Options = {}): VariableDecoder<BigInt> =>
    pipe(
        asks((x) => O.tryCatch(() => BigInt(x))),
        RE.chain(unwrap('must be a valid BigInt')),
        withOpt(options?.max)((max) =>
            RE.chain(validate((n) => n <= max, `must be smaller than or equal to ${String(max)}`)),
        ),
        withOpt(options?.min)((min) =>
            RE.chain(validate((n) => n >= min, `must be greater than or equal to ${String(min)}`)),
        ),
    );

export { bigInt };
