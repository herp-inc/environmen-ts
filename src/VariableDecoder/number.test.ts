import * as fc from 'fast-check';
import * as E from 'fp-ts/Either';

import { DecodeFailed } from '../EnvironmentError';
import { Variable } from '../Variable';

import { number } from './number';

describe(number, () => {
    it('accepts an arbitrary number', () => {
        const decoder = number();

        fc.assert(
            fc.property(
                fc.float().filter((x) => Number.isFinite(x)),
                (n) => {
                    const variable = new Variable('KEY', String(n));
                    expect(decoder(variable)).toStrictEqual(E.right(n));
                },
            ),
        );
    });

    test.each([Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])('rejects "%s"', (str) => {
        const decoder = number();
        const variable = new Variable('KEY', String(str));
        expect(decoder(variable)).toStrictEqual(E.left(new DecodeFailed(variable, 'must be finite')));
    });
});
