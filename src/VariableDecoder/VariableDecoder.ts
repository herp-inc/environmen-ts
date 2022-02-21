import * as E from 'fp-ts/Either';
import { Endomorphism } from 'fp-ts/Endomorphism';
import { identity } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import type { Predicate } from 'fp-ts/Predicate';
import * as RE from 'fp-ts/ReaderEither';
import type { Refinement } from 'fp-ts/Refinement';

import { DecodeFailed, EnvironmentError } from '../EnvironmentError';
import { Variable } from '../Variable';

type VariableDecoder<A> = RE.ReaderEither<Variable, EnvironmentError, A>;

const ask = (): VariableDecoder<string> => RE.asks(({ value }) => value);

const asks = <A>(f: (value: string) => A): VariableDecoder<A> => RE.asks(({ value }) => f(value));

const decodeFailed =
    <A>(msg: string): RE.ReaderEither<Variable, EnvironmentError, A> =>
    (variable) =>
        E.left(new DecodeFailed(variable, msg));

function validate<A, B extends A>(p: Refinement<A, B>, msg: string): (x: A) => VariableDecoder<B>;
function validate<A>(p: Predicate<A>, msg: string): (x: A) => VariableDecoder<A>;
function validate<A>(p: Predicate<A>, msg: string): (x: A) => VariableDecoder<A> {
    return (x) => (p(x) ? RE.of(x) : decodeFailed(msg));
}

const unwrap = <A>(msg: string): ((value: O.Option<A>) => VariableDecoder<A>) =>
    O.fold(
        () => decodeFailed(msg),
        (x) => RE.of(x),
    );

const withOpt =
    <Opt>(option: Opt | undefined) =>
    <A>(f: (option: Opt) => Endomorphism<VariableDecoder<A>>): Endomorphism<VariableDecoder<A>> =>
        option === undefined ? identity : f(option);

export { ask, asks, VariableDecoder, decodeFailed, validate, unwrap, withOpt };
