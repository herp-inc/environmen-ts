import type { LookupOptions } from '../Environment';
import type { VariableDecoder } from '../VariableDecoder';

import type { Decoder } from './Decoder';

/**
 * Loads an environment variable and decodes it.
 *
 * If the variable is not found, `MissingEnvironmentVariable` will be thrown.
 */
const required =
    <A>(key: string, decoder: VariableDecoder<A>, options?: LookupOptions): Decoder<A> =>
    (env) =>
        env.require(key, decoder, options);

export { required };
