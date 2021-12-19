import { ReadonlyNonEmptyArray } from 'fp-ts/ReadonlyNonEmptyArray';

import { EnvironmentError } from './EnvironmentError';

class ChoiceError extends EnvironmentError {
    public constructor(public readonly errors: ReadonlyNonEmptyArray<EnvironmentError>) {
        super();
        this.errors = errors;
    }

    public toJSON(): object {
        return {
            message: 'No decoders succeeded',
            errors: this.errors,
        };
    }
}

export { ChoiceError };
