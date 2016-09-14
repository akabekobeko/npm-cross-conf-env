# Examples for cross-conf-env

## Installation

```
$ npm install
```

## Usage

Simple:

```
$ npm start

keep MyApp MyApp MyApp 1.0.0 1.0.0 1.0.0
```

With [npm-run-all](https://www.npmjs.com/package/npm-run-all):

```
$ npm run task:a-all

keep MyApp

1.0.0
```

Multiple variables in an one paramter:

```
$ npm run task:b

MyApp-1.0.0
```

[npm_config](https://docs.npmjs.com/misc/config)

```
$ npm run task:c-all

Foo Bar Baz
```

## License

MIT
