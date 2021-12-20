import { Variable } from '../Variable';

import { EnvironmentError } from './EnvironmentError';

class DecodeFailed extends EnvironmentError {
    public readonly message: string;
    public readonly key: string;
    public readonly value: string;

    public constructor(variable: Variable, reason: string) {
        super();

        this.message = `$${variable.key} ${reason}`;
        this.key = variable.key;
        this.value = variable.sensitive ? '*REDACTED*' : variable.value;
    }
}

export { DecodeFailed };
