import * as E from 'fp-ts/Either';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';

import { ChoiceError, type EnvironmentError } from '../EnvironmentError';

import type { Decoder } from './EnvironmentDecoder';

/**
 * Tries to apply the decoders in order, until one of them succeeds.
 * Returns the value of the succeeding decoder.
 */
const choice =
    <A>(decoders: RNEA.ReadonlyNonEmptyArray<Decoder<A>>): Decoder<A> =>
    (env) => {
        const errors: EnvironmentError[] = [];

        for (const decoder of decoders) {
            const result = decoder(env);

            if (E.isRight(result)) {
                return result;
            }

            errors.push(result.left);
        }

        const err = new ChoiceError(errors as unknown as RNEA.ReadonlyNonEmptyArray<EnvironmentError>);
        return E.left(err);
    };

export { choice };
