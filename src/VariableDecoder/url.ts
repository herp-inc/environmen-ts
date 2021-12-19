import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RE from 'fp-ts/ReaderEither';

import { asks, unwrap, VariableDecoder } from './VariableDecoder';

/**
 * Decodes a URL.
 */
const url = (): VariableDecoder<URL> =>
    pipe(
        asks((x) => O.tryCatch(() => new URL(x))),
        RE.chain(unwrap('must be a valid URL')),
    );

export { url };
