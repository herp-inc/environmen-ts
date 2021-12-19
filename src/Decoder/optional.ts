import type * as O from 'fp-ts/Option';

import type { LookupOptions } from '../Environment';
import type { VariableDecoder } from '../VariableDecoder';

import type { Decoder } from './Decoder';

/**
 * Loads an optional environment variable and decodes it if found.
 */
const optional =
    <A>(key: string, decoder: VariableDecoder<A>, options?: LookupOptions): Decoder<O.Option<A>> =>
    (env) =>
        env.lookup(key, decoder, options);

export { optional };
