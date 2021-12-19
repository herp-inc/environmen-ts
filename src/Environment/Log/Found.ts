import { Variable } from '../../Variable';

import { Log } from './Log';

class Found extends Log {
    public constructor(public readonly variable: Variable) {
        super();
    }

    public toJSON(): object {
        return {
            found: true,
            message: 'Found environment variable',
            ...this.variable.toJSON(),
        };
    }
}

export { Found };
