import { pipe } from 'fp-ts/function';
import * as RE from 'fp-ts/ReaderEither';

import { asks, validate, VariableDecoder } from '../VariableDecoder';

const s = new Set(['1', 'true', 'yes']);

/**
 * Decodes truthy values to `true`
 *
 * The following values will be accepted (case insensitive):
 * - `'1'`
 * - `'true'`
 * - `'yes'`
 */
const truthy: VariableDecoder<true> = pipe(
    asks((s) => s.toLowerCase()),
    RE.chain(validate(s.has.bind(s), `must be a truthy value`)),
    RE.map((_) => true),
);

export { truthy };
