import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as RE from 'fp-ts/ReaderEither';

import { ChoiceError, Decoder, MissingEnvironmentVariable, required, Variable } from '..';
import { Environment } from '../Environment';
import { DecodeFailed } from '../EnvironmentError';
import { literal, string } from '../VariableDecoder';

import { choice } from './choice';

describe(choice, () => {
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
        RE.bind('impl', () => required('STORAGE_IMPL', literal('tmpdir'))),
        RE.bind('path', () => required('STORAGE_PATH', string())),
    );

    const s3StorageD: Decoder<Storage> = pipe(
        RE.Do,
        RE.bind('impl', () => required('STORAGE_IMPL', literal('s3'))),
        RE.bind('region', () => required('AWS_S3_REGION', string())),
        RE.bind('bucket', () => required('AWS_S3_BUCKET', string())),
    );

    const storageD = choice<Storage>([tmpdirStorageD, s3StorageD]);

    test.each([
        [
            {},
            E.left(
                new ChoiceError([
                    new MissingEnvironmentVariable('STORAGE_IMPL'),
                    new MissingEnvironmentVariable('STORAGE_IMPL'),
                ]),
            ),
        ],
        [
            {
                STORAGE_IMPL: 'tmpdir',
            },
            E.left(
                new ChoiceError([
                    new MissingEnvironmentVariable('STORAGE_PATH'),
                    new DecodeFailed(new Variable('STORAGE_IMPL', 'tmpdir'), `must be exactly 's3'`),
                ]),
            ),
        ],
        [
            {
                STORAGE_IMPL: 's3',
            },
            E.left(
                new ChoiceError([
                    new DecodeFailed(new Variable('STORAGE_IMPL', 's3'), `must be exactly 'tmpdir'`),
                    new MissingEnvironmentVariable('AWS_S3_REGION'),
                ]),
            ),
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
    ])('tries the given decoders in order', (env, expected) => {
        const actual = storageD(new Environment(env));

        expect(actual).toStrictEqual(expected);
    });
});
