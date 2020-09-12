# cross-conf-env

[![Support Node of LTS](https://img.shields.io/badge/node-LTS-brightgreen.svg)](https://nodejs.org/)
[![npm version](https://badge.fury.io/js/cross-conf-env.svg)](https://badge.fury.io/js/cross-conf-env)
[![Build Status](https://travis-ci.org/akabekobeko/npm-cross-conf-env.svg?branch=master)](https://travis-ci.org/akabekobeko/npm-cross-conf-env)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue)](https://github.com/akabekobeko/npm-cross-conf-env/blob/master/LICENSE)

To cross-platform the `config` and `root` variable reference of package.json in npm-scripts.

## Installation

This npm is installed on npm-scripts only a so `devDependencies`.

```
$ npm install --save--dev cross-conf-env
```

## Usage

To the `config` of package.json to set the value.

```js
{
  "name": "sample",
  "version": "1.0.0",
  "config": {
    "app": "MyApp"
  },
  "scripts": {
    "var": "cross-conf-env echo npm_package_config_app npm_package_version",
    "var:bash": "cross-conf-env echo $npm_package_config_app $npm_package_version",
    "var:win": "cross-conf-env echo %npm_package_config_app% %npm_package_version%",
    "var:cross": "cross-conf-env echo npm_package_config app-npm_package_version",
    "var:cross-multiple": "cross-conf-env echo npm_package_config_app-npm_package_version"
  },
  "devDependencies": {
    "cross-conf-env": "^1.0.6"
  }
}
```

Value of `npm_package_config_` or `npm_package_` will be executed after being replaced.

```
$ npm run var

MyApp 1.0.0

$ npm run var:bash

MyApp 1.0.0

$ npm run var:win

MyApp 1.0.0

$ npm run var:cross

MyApp 1.0.0

$ npm run var:cross-multiple

MyApp-1.0.0
```

The format of the environment variable in npm-scripts are different for each platform. **OS X** or **Linux** (bash) is `$variable`, **Windows** (cmd.exe or PowerShell) is `%variable%`.

It supports all of the format by using this npm in npm-scripts, format that support is below.

| Platform                            | Format                                                                           |
| :---------------------------------- | :------------------------------------------------------------------------------- |
| **OS X**, **Linux** (bash)          | `$npm_package_` or `$npm_package_config_`                                        |
| **Windows** (cmd.exe or PowerShell) | `%npm_package_%` or `%npm_package_config_%`                                      |
| `cross-conf-env` original           | `npm_package_` or `npm_package_config_`, without special charactors (`$` or `%`) |

npm-scripts environment variable that has been expanded by the execution platform is used as it is. Otherwise, to expand the `cross-conf-env`.

Definition of npm-scripts:

```
cross-conf-env command param1 param2 ...etc
```

# Limitations

`cross-conf-env` converts the value specified in `process.env`.
It will not work if run from pipe in npm-scripts.

```json
{
  "config": {
    "app": "MyApp",
    "test": "Test"
  },
  "scripts": {
    "pipe": "cross-conf-env echo npm_package_config_var | cross-conf-env echo keep npm_package_config_test"
  }
}
```

results:

```
$ npm run pipe

Test
echo: write: Broken pipe
```

If concatenating npm-scripts we recommend [npm-run-all](https://www.npmjs.com/package/npm-run-all) rather than pipe. If it is `npm-run-all` can concatenate npm-scripts to cross platforms, and `cross-conf-env` will work as well.

# ChangeLog

- [CHANGELOG](CHANGELOG.md)
