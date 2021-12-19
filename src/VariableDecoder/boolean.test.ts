import * as E from 'fp-ts/Either';

import { DecodeFailed } from '../EnvironmentError';
import { Variable } from '../Variable';

import { boolean } from './boolean';

describe(boolean, () => {
    test.each(['0', 'FALSE', 'False', 'false', 'NO', 'No', 'no'])('accepts "%s" to false', (input) => {
        const variable = new Variable('KEY', input);
        expect(boolean()(variable)).toStrictEqual(E.right(false));
    });

    test.each(['1', 'TRUE', 'True', 'true', 'YES', 'Yes', 'yes'])('accepts "%s" to true', (input) => {
        const variable = new Variable('KEY', input);
        expect(boolean()(variable)).toStrictEqual(E.right(true));
    });

    test.each(['non', 'oui', 'nein', 'ja'])('rejects "%s"', (input) => {
        const variable = new Variable('KEY', input);
        expect(boolean()(variable)).toStrictEqual(E.left(new DecodeFailed(variable, 'must be a boolean value')));
    });
});
