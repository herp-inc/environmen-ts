import { pipe } from 'fp-ts/function';
import * as RE from 'fp-ts/ReaderEither';

import { ask, validate, VariableDecoder } from './VariableDecoder';

type Options = Partial<{
    /**
     * Whether to allow an empty string.
     * Defaults to `false`.
     */
    allowEmpty?: boolean | undefined;
}>;

/**
 * Decodes a string.
 */
const string = (options?: Options): VariableDecoder<string> =>
    pipe(
        ask(),
        RE.chain(validate((str) => (options?.allowEmpty ?? false) || str !== '', 'must be a non-empty string')),
    );

export { string };
