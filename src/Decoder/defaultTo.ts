import type { Lazy } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RE from 'fp-ts/ReaderEither';

import { Decoder } from './Decoder';

/**
 * Provides the default value.
 *
 * @example
 * ```
 * pipe(
 *     optional('PORT', port()),
 *     defaultTo(() => 8000),
 * )
 * ```
 */
const defaultTo =
    <A>(defaultValue: Lazy<A>) =>
    (optional: Decoder<O.Option<A>>): Decoder<A> =>
        RE.map(O.getOrElse(defaultValue))(optional);

export { defaultTo };
