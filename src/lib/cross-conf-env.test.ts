import { beforeEach, expect, test } from 'vitest'
import { filterKeys, replaceArgv } from './cross-conf-env'

const ENV_APP_NAME = 'MyApp'
const ENV_APP_MODE = 'test'
const ENV_APP_LANG = 'en-us'

beforeEach(() => {
  process.env['npm_package_config_app'] = ENV_APP_NAME
  process.env['npm_package_config_appMode'] = ENV_APP_MODE
  process.env['npm_package_config_app_mode'] = ENV_APP_MODE
  process.env['npm_package_config_lang'] = ENV_APP_LANG
  process.env['npm_config_app'] = ENV_APP_NAME
  process.env['npm_config_lang'] = ENV_APP_LANG
})

test('npm_package_config_app', () => {
  const keys = filterKeys()
  const actual = keys.some((key) => key === 'npm_package_config_app')
  expect(actual).toBe(true)
})

test('npm_package_version', () => {
  const keys = filterKeys()
  const actual = keys.some((key) => key === 'npm_package_version')
  expect(actual).toBe(true)
})

test('npm_package_config_app, npm_package_version', () => {
  const keys = filterKeys()
  const actual = replaceArgv(
    ['test', 'npm_package_config_app', 'npm_package_version'],
    keys
  )
  const expected = ['test', ENV_APP_NAME, process.env.npm_package_version]
  expect(actual).toEqual(expected)
})

test('$npm_package_config_app, $npm_package_version', () => {
  const keys = filterKeys()
  const actual = replaceArgv(
    ['test', '$npm_package_config_app', '$npm_package_version'],
    keys
  )
  const expected = ['test', ENV_APP_NAME, process.env.npm_package_version]
  expect(actual).toEqual(expected)
})

test('%npm_package_config_app%, %npm_package_version%', () => {
  const keys = filterKeys()
  const actual = replaceArgv(
    ['test', '%npm_package_config_app%', '%npm_package_version%'],
    keys
  )
  const expected = ['test', ENV_APP_NAME, process.env.npm_package_version]
  expect(actual).toEqual(expected)
})

test('param=var,other', () => {
  const keys = filterKeys()
  const actual = replaceArgv(
    [
      'test',
      'param=npm_package_config_app,other',
      'param=npm_package_version,other',
    ],
    keys
  )
  const expected = [
    'test',
    'param=' + ENV_APP_NAME + ',other',
    'param=' + process.env.npm_package_version + ',other',
  ]

  expect(actual).toEqual(expected)
})

test('param=$var,other', () => {
  const keys = filterKeys()
  const actual = replaceArgv(
    [
      'test',
      'param=$npm_package_config_app,other',
      'param=$npm_package_version,other',
    ],
    keys
  )
  const expected = [
    'test',
    'param=' + ENV_APP_NAME + ',other',
    'param=' + process.env.npm_package_version + ',other',
  ]

  expect(actual).toEqual(expected)
})

test('param=%var%,other', () => {
  const keys = filterKeys()
  const actual = replaceArgv(
    [
      'test',
      'param=%npm_package_config_app%,other',
      'param=%npm_package_version%,other',
    ],
    keys
  )
  const expected = [
    'test',
    'param=' + ENV_APP_NAME + ',other',
    'param=' + process.env.npm_package_version + ',other',
  ]

  expect(actual).toEqual(expected)
})

test('var:var', () => {
  const keys = filterKeys()
  const actual = replaceArgv(
    ['npm_package_config_app:npm_package_version'],
    keys
  )
  const expected = [`${ENV_APP_NAME}:${process.env.npm_package_version}`]

  expect(actual).toEqual(expected)
})

test('$var:$var', () => {
  const keys = filterKeys()
  const actual = replaceArgv(
    ['$npm_package_config_app:$npm_package_version'],
    keys
  )
  const expected = [`${ENV_APP_NAME}:${process.env.npm_package_version}`]

  expect(actual).toEqual(expected)
})

test('%var%:%var%', () => {
  const keys = filterKeys()
  const actual = replaceArgv(
    ['%npm_package_config_app%:%npm_package_version%'],
    keys
  )
  const expected = [`${ENV_APP_NAME}:${process.env.npm_package_version}`]

  expect(actual).toEqual(expected)
})

test('two variables', () => {
  const keys = filterKeys()
  const actual = replaceArgv(['npm_package_version:npm_package_version'], keys)
  const expected = [
    `${process.env.npm_package_version}:${process.env.npm_package_version}`,
  ]
  expect(actual).toEqual(expected)
})

test('two $variables', () => {
  const keys = filterKeys()
  const actual = replaceArgv(
    ['$npm_package_version:$npm_package_version'],
    keys
  )
  const expected = [
    `${process.env.npm_package_version}:${process.env.npm_package_version}`,
  ]

  expect(actual).toEqual(expected)
})

test('two %variables%', () => {
  const keys = filterKeys()
  const actual = replaceArgv(
    ['%npm_package_version%:%npm_package_version%'],
    keys
  )
  const expected = [
    `${process.env.npm_package_version}:${process.env.npm_package_version}`,
  ]
  expect(actual).toEqual(expected)
})

test('Overlapping prefix: var', () => {
  const keys = filterKeys()
  const actual = replaceArgv(
    [
      'npm_package_config_app',
      'npm_package_config_app_mode',
      'npm_package_config_appMode',
    ],
    keys
  )
  const expected = [ENV_APP_NAME, ENV_APP_MODE, ENV_APP_MODE]

  expect(actual).toEqual(expected)
})

test('Overlapping prefix: $var', () => {
  const keys = filterKeys()
  const actual = replaceArgv(
    [
      '$npm_package_config_app',
      '$npm_package_config_app_mode',
      '$npm_package_config_appMode',
    ],
    keys
  )
  const expected = [ENV_APP_NAME, ENV_APP_MODE, ENV_APP_MODE]

  expect(actual).toEqual(expected)
})

test('Overlapping prefix: %var%', () => {
  const keys = filterKeys()
  const actual = replaceArgv(
    [
      '%npm_package_config_app%',
      '%npm_package_config_app_mode%',
      '%npm_package_config_appMode%',
    ],
    keys
  )
  const expected = [ENV_APP_NAME, ENV_APP_MODE, ENV_APP_MODE]

  expect(actual).toEqual(expected)
})

test('Maltiple variables in an one paramter: "var1-var2", "$var1-$var2", "%var1%-%var2%"', () => {
  const keys = filterKeys()
  const actual = replaceArgv(
    [
      'npm_package_config_app-npm_package_version',
      '$npm_package_config_app-$npm_package_version',
      '%npm_package_config_app%-%npm_package_version%',
    ],
    keys
  )
  const expected = ENV_APP_NAME + '-' + process.env.npm_package_version

  expect(actual).toEqual([expected, expected, expected])
})

test('npm_config: var', () => {
  const keys = filterKeys()
  const actual = replaceArgv(
    ['test', 'param=npm_config_app,other', 'param=npm_package_version,other'],
    keys
  )
  const expected = [
    'test',
    'param=' + ENV_APP_NAME + ',other',
    'param=' + process.env.npm_package_version + ',other',
  ]

  expect(actual).toEqual(expected)
})

test('npm_config: $var', () => {
  const keys = filterKeys()
  const actual = replaceArgv(
    ['test', 'param=$npm_config_app,other', 'param=$npm_package_version,other'],
    keys
  )
  const expected = [
    'test',
    'param=' + ENV_APP_NAME + ',other',
    'param=' + process.env.npm_package_version + ',other',
  ]

  expect(actual).toEqual(expected)
})

test('npm_config: %var%', () => {
  const keys = filterKeys()
  const actual = replaceArgv(
    [
      'test',
      'param=%npm_config_app%,other',
      'param=%npm_package_version%,other',
    ],
    keys
  )
  const expected = [
    'test',
    'param=' + ENV_APP_NAME + ',other',
    'param=' + process.env.npm_package_version + ',other',
  ]

  expect(actual).toEqual(expected)
})
