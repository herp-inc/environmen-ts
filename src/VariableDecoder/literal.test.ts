import * as fc from 'fast-check';
import * as E from 'fp-ts/Either';

import { DecodeFailed } from '..';
import { Variable } from '../Variable';

import { literal } from './literal';

describe(literal, () => {
    it('accepts an arbitrary string that is the same as the given literal', () => {
        fc.assert(
            fc.property(fc.string(), fc.string(), (lit, str) => {
                const decoder = literal(lit);
                const variable = new Variable('KEY', str);
                expect(decoder(variable)).toStrictEqual(
                    lit === str ? E.right(str) : E.left(new DecodeFailed(variable, `must be exactly '${lit}'`)),
                );
            }),
        );
    });
});
