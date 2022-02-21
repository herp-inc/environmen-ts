import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RE from 'fp-ts/ReaderEither';

import { ask, decodeFailed, validate, VariableDecoder } from './VariableDecoder';

/**
 * Decodes a URL origin (scheme + hostname + port).
 */
const origin = (): VariableDecoder<string> =>
    pipe(
        RE.Do,
        RE.bind('value', () => ask()),
        RE.bind('url', ({ value }) =>
            pipe(
                O.tryCatch(() => RE.of(new URL(value))),
                O.getOrElse(() => decodeFailed('must be a valid URL origin')),
            ),
        ),
        RE.chain(validate(({ url }) => url.pathname !== '', 'must not have a pathname')),
        RE.chain(validate(({ value, url }) => url.origin === value, 'must be a valid URL origin')),
        RE.map(({ value }) => value),
    );

export { origin };
