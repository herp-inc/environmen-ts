import { Log } from './Log';

class Missing extends Log {
    public readonly message = 'Tried to load an environment variable but not set';
    public readonly found = false;

    public constructor(public readonly key: string) {
        super();
    }
}

export { Missing };
