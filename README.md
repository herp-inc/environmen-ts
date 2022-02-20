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
