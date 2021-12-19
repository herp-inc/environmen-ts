import { pipe } from 'fp-ts/function';
import { not } from 'fp-ts/Predicate';
import * as RE from 'fp-ts/ReaderEither';

import { asks, validate, VariableDecoder } from './VariableDecoder';

/**
 * Decodes a number with `Number.parseFloat`.
 *
 * The decoded result must be finite.
 */
const number = (): VariableDecoder<number> =>
    pipe(
        asks(Number.parseFloat),
        RE.chain(validate<number>(not(Number.isNaN), 'must be a valid number')),
        RE.chain(validate<number>(Number.isFinite, 'must be finite')),
    );

export { number };
