import * as fc from 'fast-check';
import * as E from 'fp-ts/Either';

import { DecodeFailed } from '..';
import { Variable } from '../Variable';

import { origin } from './origin';

describe(origin, () => {
    it('accepts an arbitrary origin string', () => {
        const decoder = origin();

        fc.assert(
            fc.property(
                fc
                    .tuple(
                        fc.webUrl(),
                        fc.nat().filter((n) => n < 65536),
                    )
                    .map(([url, port]) => `${new URL(url).origin}:${port}`),
                (str) => {
                    const variable = new Variable('KEY', str);
                    expect(decoder(variable)).toStrictEqual(E.right(str));
                },
            ),
        );
    });

    it('rejects the complete URL', () => {
        const decoder = origin();

        fc.assert(
            fc.property(
                fc.webUrl().filter((url) => new URL(url).pathname !== '/'),
                (str) => {
                    const variable = new Variable('KEY', str);
                    expect(decoder(variable)).toStrictEqual(
                        E.left(new DecodeFailed(variable, 'must be a valid URL origin')),
                    );
                },
            ),
        );
    });
});
