import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RE from 'fp-ts/ReaderEither';

import { ask, decodeFailed, validate, VariableDecoder } from './VariableDecoder';

/**
 * Decodes a host.
 * A host consists of a hostname and a port number.
 */
const host = (): VariableDecoder<string> =>
    pipe(
        RE.Do,
        RE.bind('value', () => ask()),
        RE.bind('url', ({ value }) =>
            pipe(
                O.tryCatch(() => RE.of(new URL(`https://${value}/`))),
                O.getOrElse(() => decodeFailed('must be a valid host')),
            ),
        ),
        RE.chain(validate(({ url }) => url.port !== '', 'must be a valid host')),
        RE.chain(validate(({ value, url }) => url.host === value, 'must be a valid host')),
        RE.map(({ value }) => value),
    );

export { host };
