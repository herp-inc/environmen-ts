import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';

import { EnvironmentError, MissingEnvironmentVariable } from '../EnvironmentError';
import { Variable } from '../Variable';
import { VariableDecoder } from '../VariableDecoder';

import { Found, Log, Missing } from './Log';

type LookupOptions = {
    /**
     * Mark the variable to be sensitive so that it will not be logged.
     */
    sensitive?: boolean;
};

/**
 * A set of environment variables.
 */
class Environment {
    #env: { [key: string]: string | undefined };
    #logs: Log[];

    /**
     * Constructs a new instance.
     *
     * @example
     * const env = new Environment(process.env);
     */
    public constructor(environment: { [key: string]: string | undefined }) {
        this.#logs = [];
        this.#env = environment;
    }

    /**
     * Returns an iterable iterator over the access log of the environment variables that have been looked up.
     */
    public logs(): IterableIterator<Log> {
        return this.#logs[Symbol.iterator]();
    }

    /**
     * @privateRemarks `optional` function is provided for public use.
     */
    public lookup<A>(
        key: string,
        decoder: VariableDecoder<A>,
        options: LookupOptions = {},
    ): E.Either<EnvironmentError, O.Option<A>> {
        return pipe(
            this.#fetch(key, options),
            O.fold(
                () => E.right(O.none),
                (variable) => pipe(variable, decoder, E.map(O.some)),
            ),
        );
    }

    /**
     * @privateRemarks `required` function is provided for public use.
     */
    public require<A>(
        key: string,
        decoder: VariableDecoder<A>,
        options: LookupOptions = {},
    ): E.Either<EnvironmentError, A> {
        return pipe(
            this.#fetch(key, options),
            O.fold(() => E.left(new MissingEnvironmentVariable(key)), decoder),
        );
    }

    #fetch(key: string, options: LookupOptions): O.Option<Variable> {
        const value = this.#env[key];

        if (value === undefined) {
            this.#logs.push(new Missing(key));

            return O.none;
        }
        const variable = new Variable(key, value, options.sensitive);

        this.#logs.push(new Found(variable));

        return O.some(variable);
    }
}

export { Environment, LookupOptions };
