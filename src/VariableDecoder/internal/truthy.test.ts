import * as E from 'fp-ts/Either';

import { Variable } from '../../Variable';

import { truthy } from './truthy';

describe(truthy, () => {
    test.each(['1', 'TRUE', 'True', 'true', 'YES', 'Yes', 'yes'])('accepts "%s"', (input) => {
        const variable = new Variable('KEY', input);
        expect(truthy(variable)).toStrictEqual(E.right(true));
    });
});
