import * as fc from 'fast-check';
import * as E from 'fp-ts/Either';

import { DecodeFailed } from '../EnvironmentError';
import { Variable } from '../Variable';

import { base64 } from './base64';

describe(base64, () => {
    it('accepts an arbitrary base64 string', () => {
        fc.assert(
            fc.property(
                fc.uint8Array().filter((buf) => buf.length > 0),
                (bytes) => {
                    const buf = Buffer.from(bytes);
                    const str = buf.toString('base64');
                    const variable = new Variable('KEY', str);
                    expect(base64()(variable)).toStrictEqual(E.right(buf));
                },
            ),
        );
    });

    it('rejects an empty string', () => {
        const variable = new Variable('KEY', '');
        expect(base64()(variable)).toStrictEqual(
            E.left(new DecodeFailed(variable, 'must be a non-empty base64 string')),
        );
    });

    test.each(['foo'])('rejects "%s"', (str) => {
        const variable = new Variable('KEY', str);
        expect(base64()(variable)).toStrictEqual(
            E.left(new DecodeFailed(variable, 'must be a valid base64 string that can be converted to Buffer')),
        );
    });
});
