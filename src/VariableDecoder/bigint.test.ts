import * as fc from 'fast-check';
import * as E from 'fp-ts/Either';

import { DecodeFailed } from '../EnvironmentError';
import { Variable } from '../Variable';

import { bigint } from './bigint';

describe(bigint, () => {
    it('accepts an arbitrary bigint', () => {
        fc.assert(
            fc.property(fc.bigInt(), (n) => {
                const variable = new Variable('KEY', String(n));
                expect(bigint()(variable)).toStrictEqual(E.right(n));
            }),
        );
    });

    describe('max', () => {
        const max = 42;

        it('accepts an arbitrary bigint smaller or equal to max', () => {
            fc.assert(
                fc.property(
                    fc.bigInt().filter((n) => n <= max),
                    (n) => {
                        const variable = new Variable('KEY', String(n));
                        expect(bigint({ max: 42n })(variable)).toStrictEqual(E.right(n));
                    },
                ),
            );
        });

        it('accepts an arbitrary bigint greater than max', () => {
            fc.assert(
                fc.property(
                    fc.bigInt().filter((n) => n > 42),
                    (n) => {
                        const variable = new Variable('KEY', String(n));
                        expect(bigint({ max: 42n })(variable)).toStrictEqual(
                            E.left(new DecodeFailed(variable, 'must be smaller than or equal to 42')),
                        );
                    },
                ),
            );
        });
    });
});
