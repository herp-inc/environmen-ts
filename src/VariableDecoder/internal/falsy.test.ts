import * as E from 'fp-ts/Either';

import { Variable } from '../../Variable';

import { falsy } from './falsy';

describe(falsy, () => {
    test.each(['0', 'FALSE', 'False', 'false', 'NO', 'No', 'no'])('accepts "%s"', (input) => {
        const variable = new Variable('KEY', input);
        expect(falsy(variable)).toStrictEqual(E.right(false));
    });
});
