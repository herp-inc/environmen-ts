import * as fc from 'fast-check';
import * as E from 'fp-ts/Either';

import { DecodeFailed } from '../EnvironmentError';
import { Variable } from '../Variable';

import { hex } from './hex';

describe(hex, () => {
    it('accepts an arbitrary non-empty hexadecimal string', () => {
        fc.assert(
            fc.property(
                fc.hexaString().filter((str) => str !== ''),
                (str) => {
                    const variable = new Variable('KEY', str);
                    const buf = Buffer.from(str, 'hex');
                    expect(hex()(variable)).toStrictEqual(E.right(buf));
                },
            ),
        );
    });

    test.each(['', 'foo'])('rejects "%s"', (str) => {
        const variable = new Variable('KEY', str);
        expect(hex()(variable)).toStrictEqual(E.left(new DecodeFailed(variable, 'must be a valid hexadecimal string')));
    });
});
