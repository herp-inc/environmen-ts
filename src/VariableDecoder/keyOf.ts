import { pipe } from 'fp-ts/function';
import * as RE from 'fp-ts/ReaderEither';

import { ask, validate, VariableDecoder } from './VariableDecoder';

const oneOf = (xs: string[]): string =>
    xs
        .slice(0, -1)
        .map((x) => `'${x}'`)
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .join(', ') + `, or '${xs[xs.length - 1]!}'`;

/**
 * Decodes a string that is a key of the given object.
 *
 * @example
 * const logLevelD = keyOf({
 *   debug: null,
 *   info: null,
 *   warn: null,
 *   error: null,
 * });
 */
const keyOf = <Keys extends string>(record: Readonly<{ [Key in Keys]: unknown }>): VariableDecoder<Keys> => {
    const keys = Object.keys(record);
    const included = (x: string): x is Keys => keys.includes(x);

    return pipe(ask(), RE.chain(validate(included, `must be one of ${oneOf(keys)}`)));
};

export { keyOf };
