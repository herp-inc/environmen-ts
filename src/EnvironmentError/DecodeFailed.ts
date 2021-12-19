import { Variable } from '../Variable';

import { EnvironmentError } from './EnvironmentError';

class DecodeFailed extends EnvironmentError {
    public constructor(public readonly variable: Variable, public readonly message: string) {
        super();
    }

    public toJSON(): object {
        return {
            key: this.variable.key,
            value: this.variable.sensitive ? '*REDACTED*' : this.variable,
            message: `$${this.variable.key} ${this.message}`,
        };
    }
}

export { DecodeFailed };
