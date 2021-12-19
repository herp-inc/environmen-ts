import * as fc from 'fast-check';
import * as E from 'fp-ts/Either';

import { DecodeFailed } from '../EnvironmentError';
import { Variable } from '../Variable';

import { natural } from './natural';

describe(natural, () => {
    it('accepts an arbitrary natural number', () => {
        fc.assert(
            fc.property(fc.nat(), (n) => {
                const variable = new Variable('KEY', String(n));
                expect(natural()(variable)).toStrictEqual(E.right(n));
            }),
        );
    });

    it('rejects an arbitrary negative integer', () => {
        fc.assert(
            fc.property(
                fc.maxSafeInteger().filter((n) => n < 0),
                (n) => {
                    const variable = new Variable('KEY', String(n));
                    expect(natural()(variable)).toStrictEqual(
                        E.left(new DecodeFailed(variable, 'must be a natural number')),
                    );
                },
            ),
        );
    });

    test.each(['', 'foo'])('rejects "%s"', (str) => {
        const variable = new Variable('KEY', str);
        expect(natural()(variable)).toEqual(E.left(new DecodeFailed(variable, 'must be a natural number')));
    });
});
