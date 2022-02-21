import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RE from 'fp-ts/ReaderEither';

import { ask, decodeFailed, validate, VariableDecoder } from './VariableDecoder';

/**
 * Decodes a hostname.
 */
const hostname = (): VariableDecoder<string> =>
    pipe(
        RE.Do,
        RE.bind('value', () => ask()),
        RE.bind('url', ({ value }) =>
            pipe(
                O.tryCatch(() => RE.of(new URL(`https://${value}:80/`))),
                O.getOrElse(() => decodeFailed('must be a valid hostname')),
            ),
        ),
        RE.chain(validate(({ value, url }) => url.hostname === value, 'must be a valid hostname')),
        RE.map(({ value }) => value),
    );

export { hostname };
