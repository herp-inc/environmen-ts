import { Log } from './Log';

class Missing extends Log {
    public constructor(public readonly key: string) {
        super();
    }

    public toJSON(): object {
        return {
            found: false,
            message: 'Tried to load an environment variable but not set',
            key: this.key,
        };
    }
}

export { Missing };
