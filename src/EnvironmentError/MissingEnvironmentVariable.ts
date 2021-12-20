import { EnvironmentError } from './EnvironmentError';

class MissingEnvironmentVariable extends EnvironmentError {
    public readonly message = 'Environment variable not found';

    public constructor(public readonly key: string) {
        super();
    }
}

export { MissingEnvironmentVariable };
