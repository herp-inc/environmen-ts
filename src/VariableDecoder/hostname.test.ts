import * as fc from 'fast-check';
import * as E from 'fp-ts/Either';

import { DecodeFailed } from '..';
import { Variable } from '../Variable';

import { hostname } from './hostname';

describe(hostname, () => {
    it('accepts an arbitrary URL string', () => {
        const decoder = hostname();

        fc.assert(
            fc.property(
                fc.webUrl().map((url) => new URL(url).hostname),
                (str) => {
                    const variable = new Variable('KEY', str);
                    expect(decoder(variable)).toStrictEqual(E.right(str));
                },
            ),
        );
    });

    it('rejects an arbitrary host string with a port number', () => {
        const decoder = hostname();

        fc.assert(
            fc.property(
                fc
                    .tuple(
                        fc.webUrl(),
                        fc.nat().filter((n) => n < 65536),
                    )
                    .map(([url, port]) => `${new URL(url).hostname}:${port}`),
                (str) => {
                    const variable = new Variable('KEY', str);
                    expect(decoder(variable)).toStrictEqual(
                        E.left(new DecodeFailed(variable, 'must be a valid hostname')),
                    );
                },
            ),
        );
    });

    it('rejects an arbitrary URL string', () => {
        const decoder = hostname();

        fc.assert(
            fc.property(fc.webUrl(), (str) => {
                const variable = new Variable('KEY', str);
                expect(decoder(variable)).toStrictEqual(E.left(new DecodeFailed(variable, 'must be a valid hostname')));
            }),
        );
    });
});
