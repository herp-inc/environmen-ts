import { Variable } from '../../Variable';

import { Log } from './Log';

class Found extends Log {
    public readonly message = 'Found environment variable';
    public readonly found = true;
    public readonly key: string;
    public readonly value: string;

    public constructor(variable: Variable) {
        super();

        this.key = variable.key;
        this.value = variable.sensitive ? '*REDACTED*' : variable.value;
    }
}

export { Found };
