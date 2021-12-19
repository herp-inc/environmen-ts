import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';

import { MissingEnvironmentVariable } from '../EnvironmentError';
import { Variable } from '../Variable';
import { natural, string } from '../VariableDecoder';

import { Environment } from './Environment';
import { Found, Missing } from './Log';

describe(Environment, () => {
    describe('#lookup', () => {
        describe('when the variable is missing', () => {
            it('returns none in the right', () => {
                const env = new Environment({});

                const actual = env.lookup('PORT', natural());
                const expected = E.right(O.none);

                expect(actual).toStrictEqual(expected);
            });
        });

        describe('when the variable is present', () => {
            it('returns some(variable) in the right', () => {
                const env = new Environment({ PORT: '8080' });

                const actual = env.lookup('PORT', natural());
                const expected = E.right(O.some(8080));

                expect(actual).toStrictEqual(expected);
            });
        });
    });

    describe('#require', () => {
        describe('when the variable is missing', () => {
            it('returns MissingEnvironmentVariable in the left', () => {
                const env = new Environment({});

                const actual = env.require('PORT', natural());
                const expected = E.left(new MissingEnvironmentVariable('PORT'));

                expect(actual).toStrictEqual(expected);
            });
        });

        describe('when the variable is present', () => {
            it('returns the variable in the right', () => {
                const env = new Environment({ PORT: '8080' });

                const actual = env.require('PORT', natural());
                const expected = E.right(8080);

                expect(actual).toStrictEqual(expected);
            });
        });
    });

    describe('#log', () => {
        it('returns an iterator over the internal logs', () => {
            const env = new Environment({ PORT: '8080' });

            env.require('PORT', natural());
            env.lookup('FOO', string());

            const actual = Array.from(env.logs());

            const expected = [new Found(new Variable('PORT', '8080')), new Missing('FOO')];

            expect(actual).toStrictEqual(expected);
        });
    });
});
