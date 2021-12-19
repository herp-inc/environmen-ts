import * as fc from 'fast-check';
import * as E from 'fp-ts/Either';

import { DecodeFailed } from '../EnvironmentError';
import { Variable } from '../Variable';

import { integer } from './integer';

describe(integer, () => {
    it('accepts an arbitrary integer', () => {
        fc.assert(
            fc.property(fc.integer(), (n) => {
                const variable = new Variable('KEY', String(n));
                expect(integer()(variable)).toStrictEqual(E.right(n));
            }),
        );
    });

    describe('options.max', () => {
        it('accepts an arbitrary integer that is smaller than or equal to max', () => {
            fc.assert(
                fc.property(fc.integer(), fc.integer(), (n, max) => {
                    const decoder = integer({ max });
                    const variable = new Variable('KEY', String(n));
                    expect(decoder(variable)).toStrictEqual(
                        n <= max
                            ? E.right(n)
                            : E.left(new DecodeFailed(variable, `must be smaller than or equal to ${max}`)),
                    );
                }),
            );
        });
    });

    describe('options.min', () => {
        it('accepts an arbitrary integer that is greater than or equal to min', () => {
            fc.assert(
                fc.property(fc.integer(), fc.integer(), (n, min) => {
                    const decoder = integer({ min });
                    const variable = new Variable('KEY', String(n));
                    expect(decoder(variable)).toStrictEqual(
                        n >= min
                            ? E.right(n)
                            : E.left(new DecodeFailed(variable, `must be greater than or equal to ${min}`)),
                    );
                }),
            );
        });
    });
});
