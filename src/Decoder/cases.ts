import { Decoder } from './Decoder';

const cases =
    <Cases extends string, A>(f: { [Case in Cases]: Decoder<A> }) =>
    (x: Cases): Decoder<A> =>
        f[x];

export { cases };
