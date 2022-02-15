import { Decoder } from './Decoder';

const cases =
    <Cases extends string, A>(f: Record<Cases, Decoder<A>>) =>
    (x: Cases): Decoder<A> =>
        f[x];

export { cases };
