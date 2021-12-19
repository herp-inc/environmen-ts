import * as fc from 'fast-check';
import * as E from 'fp-ts/Either';

import { Variable } from '../Variable';

import { url } from './url';

describe(url, () => {
    it('accepts an arbitrary URL string', () => {
        const decoder = url();

        fc.assert(
            fc.property(fc.webUrl(), (str) => {
                const variable = new Variable('KEY', str);
                expect(decoder(variable)).toStrictEqual(E.right(new URL(str)));
            }),
        );
    });
});
