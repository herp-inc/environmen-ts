import { pipe } from 'fp-ts/function';
import * as RE from 'fp-ts/ReaderEither';

import { asks, validate, VariableDecoder } from '../VariableDecoder';

const s = new Set(['0', 'false', 'no']);

/**
 * Decodes falsy values to `false`
 *
 * The following values will be accepted (case insensitive):
 * - `'0'`
 * - `'false'`
 * - `'no'`
 */
const falsy: VariableDecoder<false> = pipe(
    asks((s) => s.toLowerCase()),
    RE.chain(validate(s.has.bind(s), `must be a falsy value`)),
    RE.map((_) => false),
);

export { falsy };
