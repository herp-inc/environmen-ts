import type * as RE from 'fp-ts/ReaderEither';

import type { Environment } from '../Environment';
import type { EnvironmentError } from '../EnvironmentError';

type EnvironmentDecoder<A> = RE.ReaderEither<Environment, EnvironmentError, A>;

/**
 * An alias to `EnvironmentDecoder`
 */
type Decoder<A> = EnvironmentDecoder<A>;

export type { Decoder, EnvironmentDecoder };
