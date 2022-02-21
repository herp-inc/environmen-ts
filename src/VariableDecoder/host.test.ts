import * as fc from 'fast-check';
import * as E from 'fp-ts/Either';

import { DecodeFailed } from '..';
import { Variable } from '../Variable';

import { host } from './host';

describe(host, () => {
    it('accepts an arbitrary host string', () => {
        const decoder = host();

        fc.assert(
            fc.property(
                fc
                    .tuple(
                        fc.webUrl(),
                        fc.nat().filter((n) => n < 65536),
                    )
                    .map(([url, port]) => `${new URL(url).host}:${port}`),
                (str) => {
                    const variable = new Variable('KEY', str);
                    expect(decoder(variable)).toStrictEqual(E.right(str));
                },
            ),
        );
    });

    it('requires a port number', () => {
        const decoder = host();

        fc.assert(
            fc.property(
                fc.webUrl().map((url) => new URL(url).hostname),
                (str) => {
                    const variable = new Variable('KEY', str);
                    expect(decoder(variable)).toStrictEqual(E.left(new DecodeFailed(variable, 'must be a valid host')));
                },
            ),
        );
    });

    it('rejects an arbitrary URL string', () => {
        const decoder = host();

        fc.assert(
            fc.property(
                fc.webUrl().map((str) => {
                    const url = new URL(str);
                    url.port = '80';
                    return url.href;
                }),
                (str) => {
                    const variable = new Variable('KEY', str);
                    expect(decoder(variable)).toStrictEqual(E.left(new DecodeFailed(variable, 'must be a valid host')));
                },
            ),
        );
    });

    it('rejects the trailing pathname', () => {
        const decoder = host();

        fc.assert(
            fc.property(
                fc
                    .tuple(
                        fc.webUrl().filter((url) => new URL(url).pathname !== '/'),
                        fc.nat().filter((n) => n < 65536),
                    )

                    .map(([orig, port]) => {
                        const url = new URL(orig);
                        url.port = String(port);
                        return url.host + url.pathname;
                    }),
                (str) => {
                    const variable = new Variable('KEY', str);
                    expect(decoder(variable)).toStrictEqual(E.left(new DecodeFailed(variable, 'must be a valid host')));
                },
            ),
        );
    });
});
