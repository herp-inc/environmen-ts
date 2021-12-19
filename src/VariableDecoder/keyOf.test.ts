import * as E from 'fp-ts/Either';

import { DecodeFailed } from '../EnvironmentError';
import { Variable } from '../Variable';

import { keyOf } from './keyOf';

describe(keyOf, () => {
    const decoder = keyOf({
        debug: null,
        info: null,
        warn: null,
        error: null,
    });

    test.each(['debug', 'info', 'warn', 'error'])('decodes "%s"', (str) => {
        const variable = new Variable('KEY', str);

        expect(decoder(variable)).toStrictEqual(E.right(str));
    });

    test.each(['emerg', 'alert', 'crit', 'err', 'warning', 'notice'])('rejects "%s"', (str) => {
        const variable = new Variable('KEY', str);

        expect(decoder(variable)).toStrictEqual(
            E.left(new DecodeFailed(variable, `must be one of 'debug', 'info', 'warn', or 'error'`)),
        );
    });
});
