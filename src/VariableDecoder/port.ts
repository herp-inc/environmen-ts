import { natural } from './natural';
import { VariableDecoder } from './VariableDecoder';

type Options = {
    /**
     * Whether to include well-known ports (0 - 1023).
     * Defaults to `false`.
     */
    includeWellKnown?: boolean | undefined;
};

/**
 * Decodes a TCP/IP port number.
 */
const port = (options: Options = {}): VariableDecoder<number> =>
    natural({
        min: options.includeWellKnown ?? false ? 0 : 1024,
        max: 65535,
    });

export { port };
