import { pipe } from 'fp-ts/function';
import * as RE from 'fp-ts/ReaderEither';

import { ask, validate, VariableDecoder } from './VariableDecoder';

/**
 * Decodes an exact string literal.
 */
const literal = <Lit extends string>(lit: Lit): VariableDecoder<Lit> =>
    pipe(ask(), RE.chain(validate((x): x is Lit => x === lit, `must be exactly '${lit}'`)));

export { literal };
