import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as RE from 'fp-ts/ReaderEither';

import { Decoder, MissingEnvironmentVariable, required } from '..';
import { Environment } from '../Environment';
import { keyOf, string } from '../VariableDecoder';

import { cases } from './cases';

describe(cases, () => {
    type Storage =
        | {
              impl: 'tmpdir';
              path: string;
          }
        | {
              impl: 's3';
              region: string;
              bucket: string;
          };

    const tmpdirStorageD: Decoder<Storage> = pipe(
        RE.Do,
        RE.bind('impl', () => RE.of('tmpdir' as const)),
        RE.bind('path', () => required('STORAGE_PATH', string())),
    );

    const s3StorageD: Decoder<Storage> = pipe(
        RE.Do,
        RE.bind('impl', () => RE.of('s3' as const)),
        RE.bind('region', () => required('AWS_S3_REGION', string())),
        RE.bind('bucket', () => required('AWS_S3_BUCKET', string())),
    );

    const storageD = pipe(
        required(
            'STORAGE_IMPL',
            keyOf({
                tmpdir: null,
                s3: null,
            }),
        ),
        RE.chain(
            cases({
                tmpdir: tmpdirStorageD,
                s3: s3StorageD,
            }),
        ),
    );

    test.each([
        [{}, E.left(new MissingEnvironmentVariable('STORAGE_IMPL'))],
        [
            {
                STORAGE_IMPL: 'tmpdir',
            },
            E.left(new MissingEnvironmentVariable('STORAGE_PATH')),
        ],
        [
            {
                STORAGE_IMPL: 'tmpdir',
                STORAGE_PATH: '/tmp',
            },
            E.right({
                impl: 'tmpdir',
                path: '/tmp',
            }),
        ],
        [
            {
                STORAGE_IMPL: 's3',
            },
            E.left(new MissingEnvironmentVariable('AWS_S3_REGION')),
        ],
        [
            {
                STORAGE_IMPL: 's3',
                AWS_S3_REGION: 'ap-northeast-1',
            },
            E.left(new MissingEnvironmentVariable('AWS_S3_BUCKET')),
        ],
        [
            {
                STORAGE_IMPL: 's3',
                AWS_S3_REGION: 'ap-northeast-1',
                AWS_S3_BUCKET: 'my-bucket',
            },
            E.right({ impl: 's3', region: 'ap-northeast-1', bucket: 'my-bucket' }),
        ],
    ])('tries the given decoders in order', (env, expected) => {
        const actual = storageD(new Environment(env));

        expect(actual).toStrictEqual(expected);
    });
});
