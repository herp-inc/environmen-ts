import * as Alt from 'fp-ts/Alt';
import * as RE from 'fp-ts/Either';

import { DecodeFailed, EnvironmentError } from '../EnvironmentError';
import { Variable } from '../Variable';

import { falsy } from './internal/falsy';
import { truthy } from './internal/truthy';
import { VariableDecoder } from './VariableDecoder';

/**
 * Decodes falsy values to `false`, and truthy values to `true`.
 *
 * The following values will be accepted (case insensitive).
 * - `"0"` / `"1"`
 * - `"false"` / `"true"`
 * - `"no"` / `"yes"`
 */
const boolean = (): VariableDecoder<boolean> => (variable: Variable) =>
    Alt.altAll(RE.Alt)<EnvironmentError, boolean>(falsy(variable))([
        truthy(variable),
        RE.left(new DecodeFailed(variable, 'must be a boolean value')),
    ]);

export { boolean };
