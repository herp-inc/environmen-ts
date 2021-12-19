import * as fc from 'fast-check';
import * as E from 'fp-ts/Either';

import { DecodeFailed } from '../EnvironmentError';
import { Variable } from '../Variable';

import { port } from './port';

describe(port, () => {
    it('rejects well-known ports by default', () => {
        const decoder = port();

        fc.assert(
            fc.property(
                fc.nat().filter((n) => n < 1024),
                (port) => {
                    const variable = new Variable('KEY', String(port));
                    expect(decoder(variable)).toStrictEqual(
                        E.left(new DecodeFailed(variable, 'must be greater than or equal to 1024')),
                    );
                },
            ),
        );
    });

    it('accepts well-known ports when explicitly allowed', () => {
        const decoder = port({ includeWellKnown: true });

        fc.assert(
            fc.property(
                fc.nat().filter((n) => n < 1024),
                (port) => {
                    const variable = new Variable('KEY', String(port));
                    expect(decoder(variable)).toStrictEqual(E.right(port));
                },
            ),
        );
    });
});
