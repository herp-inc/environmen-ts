import type * as RE from 'fp-ts/ReaderEither';

import type { Environment } from '../Environment';
import type { EnvironmentError } from '../EnvironmentError';

type Decoder<A> = RE.ReaderEither<Environment, EnvironmentError, A>;

export type { Decoder };
