import { Decoder } from './EnvironmentDecoder';

/**
 * Performs a case analysis toward the given string, then returns the matched decoder.
 * Especially useful for switching implementation depending on a specific environment variable.
 *
 * @example
 *
 * const impls = {
 *     fs: pipe(
 *         RE.Do,
 *         RE.bind('path', () => required('STORAGE_PATH', string())),
 *         RE.map(({ path }) => new FSStorage(path))
 *     ),
 *     s3: pipe(
 *         RE.Do,
 *         RE.bind('region', () => required('AWS_S3_REGION', string())),
 *         RE.bind('bucket', () => required('AWS_S3_BUCKET', string())),
 *         RE.map(({ region, bucket }) => new S3Storage(region, bucket))
 *     ),
 * };
 *
 * const storageD: Decoder<Storage> = pipe(
 *   required('STORAGE_IMPL', keyOf(impls)), // must be either of 'fs' or 's3'
 *   RE.chain(cases(impls)),
 * );
 */
const cases =
    <Cases extends string, A>(f: Record<Cases, Decoder<A>>) =>
    (x: Cases): Decoder<A> =>
        f[x];

export { cases };
