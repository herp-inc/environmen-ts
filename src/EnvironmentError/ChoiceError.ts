import { ReadonlyNonEmptyArray } from 'fp-ts/ReadonlyNonEmptyArray';

import { EnvironmentError } from './EnvironmentError';

class ChoiceError extends EnvironmentError {
    public readonly message = 'No decoders succeeded';

    public constructor(public readonly errors: ReadonlyNonEmptyArray<EnvironmentError>) {
        super();
    }
}

export { ChoiceError };
