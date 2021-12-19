import { EnvironmentError } from './EnvironmentError';

class MissingEnvironmentVariable extends EnvironmentError {
    public constructor(public readonly key: string) {
        super();
    }

    public toJSON(): object {
        return {
            key: this.key,
            message: 'Environment variable not found',
        };
    }
}

export { MissingEnvironmentVariable };
