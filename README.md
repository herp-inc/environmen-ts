# `@herp-inc/environmen-ts` [![npm](https://img.shields.io/npm/v/@herp-inc/environmen-ts)](https://www.npmjs.com/package/@herp-inc/environmen-ts)

A composable environment variable decoder library

## Configuration made easy

Configure your [twelve-factor app](https://12factor.net/) via environment variables, using the simple, concise, and type-safe API.

- **Composable**: Decode your configuration painlessly. A complex decoder can be made up of a smaller ones, making it enjoyable to combine multiple variables.
- **Batteries included**: Don't reinvent the wheel anymore. Various kinds of ready-made decoders are available. Common strategies such as switching the implementation depending on the value of a specific variable can be easily achived.
- **Made for production apps**: Know what's happening on deployments. Increase the observability by logging everything.

## Installation

Note that the following packages are peer dependencies of this library, which need to be installed separately.

| Package                                        | Version   |
| ---------------------------------------------- | --------- |
| [`fp-ts`](https://www.npmjs.com/package/fp-ts) | `^2.11.0` |

```sh
$ yarn add @herp-inc/environmen-ts
```

## Example

```typescript
import {
  defaultTo,
  Environment,
  EnvironmentError,
  hex,
  keyOf,
  optional,
  port,
  required,
} from '@herp-inc/environmen-ts';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as RE from 'fp-ts/ReaderEither';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type Config = {
  logLevel: LogLevel;
  port: number;
  secretKeyBase: Buffer;
};

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

const secretKeyBaseD = required('SECRET_KEY_BASE', hex({ length: 32 }), {
  // You can optionally mark a variable to be sensitive so that it will not be logged.
  sensitive: true,
});

const configD = pipe(
  RE.Do,
  RE.bind('port', () => portD),
  RE.bind('logLevel', () => logLevelD),
  RE.bind('secretKeyBase', () => secretKeyBaseD),
);

const env = new Environment(process.env);

const config: E.Either<EnvironmentError, Config> = configD(env);

// Check out what's found and what's missing.
for (const log of env.logs()) {
  logger.info(log);
}
```

## Core concepts

### `Environment`

The `Environment` class represents a set of environment variables.

```typescript
const env = new Environment(process.env);
```

Its main use is to be an argument of a `Decoder`.

```typescript
let configD: Decoder<Config>;
const config: Either<EnvironmentError, Config> = configD(env);
```

Each access to an environment variable is internally tracked, so that you can easily inspect it later on.

```typescript
for (const log of env.logs()) {
  logger.info(log);
}
```

### `VariableDecoder`

Every environment variable is a mere string, hence it must be decoded into some value in order to play with it. A `VariableDecoder<A>` is defined as `ReaderEither<Variable, EnvironmentError, A>`, that is, a function that takes a `Variable` and returns either of `EnvironmentError` of `A`. (Here you can think a `Variable` to be a key-value pair of an environment variable.)

For an instance, `port` is a variable decoder for a TCP/IP port number. See [`src/VariableDecoder/`](./src/VariableDecoder) for the full list of built-in variable decoders.

A variable decoder can be turned into an _environment decoder_ by passing it to `required`/`optional` function.

```typescript
const portD: Decoder<number> = required('PORT', port());
```

### `Decoder`

The `EnvironmentDecoder<A>` (or simply `Decoder<A>`, for short) is defined as `ReaderEither<Environment, EnvironmentError, A>`, that is, a function that takes an `Environment` and returns either of `EnvironmentError` or `A`.

You can compose multiple environment decoders to build a more complex one.

#### Combining multiple variables with `Do` notation

```typescript
const mysqlClientD: Decoder<MySQLClient> = pipe(
  RE.Do,
  RE.bind('host', () => required('MYSQL_HOST', string())),
  RE.bind('port', () => required('MYSQL_PORT', port())),
  RE.bind('user', () => required('MYSQL_USER', string())),
  RE.bind('password', () => required('MYSQL_PASSWORD', string(), { sensitive: true })),
  RE.map(({ host, port, user, password }) => new MySQLClient(host, port, user, password)),
);
```

#### Trying multiple strategies sequentially with `choice`

```typescript
type Intercom = {
  appID: string;
  secretKey: string;
};

const intercomD: Decoder<Option<Intercom>> = choice([
  pipe(
    RE.Do,
    RE.bind('appID', () => required('INTERCOM_APP_ID', string())),
    RE.bind('secretKey', () => required('INTERCOM_SECRET_KEY', string(), { sensitive: true })),
    RE.map(O.some),
  ),
  RE.of(O.none),
]);
```

#### Switching the implementation depending on the value of a specific environment variable with `cases`

```typescript
const impls = {
  fs: pipe(
    RE.Do,
    RE.bind('path', () => required('STORAGE_PATH', string())),
    RE.map(({ path }) => new FSStorage(path)),
  ),
  s3: pipe(
    RE.Do,
    RE.bind('region', () => required('AWS_S3_REGION', string())),
    RE.bind('bucket', () => required('AWS_S3_BUCKET', string())),
    RE.map(({ region, bucket }) => new S3Storage(region, bucket)),
  ),
};

const storageD: Decoder<Storage> = pipe(
  required('STORAGE_IMPL', keyOf(impls)), // must be either of 'fs' or 's3'
  RE.chain(cases(impls)),
);
```
