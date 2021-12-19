import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as RE from 'fp-ts/ReaderEither';

import {
    choice,
    defaultTo,
    Environment,
    hex,
    keyOf,
    literal,
    MissingEnvironmentVariable,
    optional,
    port,
    required,
    string,
} from '.';

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
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const portD = required('PORT', port());
const logLevelD = pipe(
    optional(
        'LOG_LEVEL',
        keyOf({
            debug: null,
            info: null,
            warn: null,
            error: null,
        }),
    ),
    defaultTo<LogLevel>(() => 'info'),
);

const secretKeyBaseD = required('SECRET_KEY_BASE', hex({ length: 4 }), { sensitive: true });

const tmpdirStorageD = pipe(
    RE.Do,
    RE.bind('impl', () => required('STORAGE_IMPL', literal('tmpdir'))),
    RE.bind('path', () => required('STORAGE_PATH', string())),
);

const s3StorageD = pipe(
    RE.Do,
    RE.bind('impl', () => required('STORAGE_IMPL', literal('s3'))),
    RE.bind('region', () => required('AWS_S3_REGION', string())),
    RE.bind('bucket', () => required('AWS_S3_BUCKET', string())),
);

const storageD = choice<Storage>([tmpdirStorageD, s3StorageD]);

const configD = pipe(
    RE.Do,
    RE.bind('port', () => portD),
    RE.bind('secretKeyBase', () => secretKeyBaseD),
    RE.bind('storage', () => storageD),
    RE.bind('logLevel', () => logLevelD),
);

describe('@herp-inc/environmen-ts', () => {
    it('decodes the configuration', () => {
        const env = new Environment({
            PORT: '8080',
            SECRET_KEY_BASE: 'deadbeef',
            STORAGE_IMPL: 'tmpdir',
            STORAGE_PATH: '/tmp',
        });
        const config = configD(env);

        expect(config).toStrictEqual(
            E.right({
                logLevel: 'info',
                port: 8080,
                secretKeyBase: Buffer.from('deadbeef', 'hex'),
                storage: {
                    impl: 'tmpdir',
                    path: '/tmp',
                },
            }),
        );
    });

    it('throws MissingEnvironmentVariable', () => {
        const env = new Environment({});
        const config = configD(env);

        expect(config).toStrictEqual(E.left(new MissingEnvironmentVariable('PORT')));
    });
});
