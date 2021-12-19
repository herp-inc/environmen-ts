import * as fc from 'fast-check';
import * as E from 'fp-ts/Either';

import { Variable } from '../Variable';

import { number } from './number';

describe(number, () => {
    it('accepts an arbitrary number', () => {
        const decoder = number();

        fc.assert(
            fc.property(fc.float(), (n) => {
                const variable = new Variable('KEY', String(n));
                expect(decoder(variable)).toStrictEqual(E.right(n));
            }),
        );
    });
});
