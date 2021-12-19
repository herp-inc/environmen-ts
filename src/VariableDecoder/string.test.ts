import * as fc from 'fast-check';
import * as E from 'fp-ts/Either';

import { DecodeFailed } from '../EnvironmentError';
import { Variable } from '../Variable';

import { string } from './string';

describe(string, () => {
    it('accepts an arbitrary non-empty string', () => {
        const decoder = string();

        fc.assert(
            fc.property(
                fc.string().filter((x) => x !== ''),
                (str) => {
                    const variable = new Variable('KEY', str);

                    expect(decoder(variable)).toStrictEqual(E.right(str));
                },
            ),
        );
    });

    it('rejects an empty string by default', () => {
        const decoder = string();
        const variable = new Variable('KEY', '');
        expect(decoder(variable)).toStrictEqual(E.left(new DecodeFailed(variable, 'must be a non-empty string')));
    });

    it('accepts an empty string when explicitly allowed', () => {
        const decoder = string({ allowEmpty: true });
        const variable = new Variable('KEY', '');
        expect(decoder(variable)).toStrictEqual(E.right(''));
    });
});
