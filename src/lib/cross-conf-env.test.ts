import assert from 'assert'
import { filterKeys, replaceArgv } from './cross-conf-env'

describe('cross-conf-env', () => {
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

  describe('filterKeys', () => {
    it('npm_package_config_app', () => {
      const keys = filterKeys()
      const actual = keys.some((key) => key === 'npm_package_config_app')
      assert.strictEqual(actual, true)
    })

    it('npm_package_version', () => {
      const keys = filterKeys()
      const actual = keys.some((key) => key === 'npm_package_version')
      assert.strictEqual(actual, true)
    })
  })

  describe('replaceArgv', () => {
    it('npm_package_config_app, npm_package_version', () => {
      const keys = filterKeys()
      const actual = replaceArgv(
        ['test', 'npm_package_config_app', 'npm_package_version'],
        keys
      )
      const expected = ['test', ENV_APP_NAME, process.env.npm_package_version]

      assert.deepStrictEqual(actual, expected)
    })

    it('$npm_package_config_app, $npm_package_version', () => {
      const keys = filterKeys()
      const actual = replaceArgv(
        ['test', '$npm_package_config_app', '$npm_package_version'],
        keys
      )
      const expected = ['test', ENV_APP_NAME, process.env.npm_package_version]

      assert.deepStrictEqual(actual, expected)
    })

    it('%npm_package_config_app%, %npm_package_version%', () => {
      const keys = filterKeys()
      const actual = replaceArgv(
        ['test', '%npm_package_config_app%', '%npm_package_version%'],
        keys
      )
      const expected = ['test', ENV_APP_NAME, process.env.npm_package_version]

      assert.deepStrictEqual(actual, expected)
    })

    it('param=var,other', () => {
      const keys = filterKeys()
      const actual = replaceArgv(
        [
          'test',
          'param=npm_package_config_app,other',
          'param=npm_package_version,other'
        ],
        keys
      )
      const expected = [
        'test',
        'param=' + ENV_APP_NAME + ',other',
        'param=' + process.env.npm_package_version + ',other'
      ]

      assert.deepStrictEqual(actual, expected)
    })

    it('param=$var,other', () => {
      const keys = filterKeys()
      const actual = replaceArgv(
        [
          'test',
          'param=$npm_package_config_app,other',
          'param=$npm_package_version,other'
        ],
        keys
      )
      const expected = [
        'test',
        'param=' + ENV_APP_NAME + ',other',
        'param=' + process.env.npm_package_version + ',other'
      ]

      assert.deepStrictEqual(actual, expected)
    })

    it('param=%var%,other', () => {
      const keys = filterKeys()
      const actual = replaceArgv(
        [
          'test',
          'param=%npm_package_config_app%,other',
          'param=%npm_package_version%,other'
        ],
        keys
      )
      const expected = [
        'test',
        'param=' + ENV_APP_NAME + ',other',
        'param=' + process.env.npm_package_version + ',other'
      ]

      assert.deepStrictEqual(actual, expected)
    })

    it('var:var', () => {
      const keys = filterKeys()
      const actual = replaceArgv(
        ['npm_package_config_app:npm_package_version'],
        keys
      )
      const expected = [`${ENV_APP_NAME}:${process.env.npm_package_version}`]
      assert.deepStrictEqual(actual, expected)
    })

    it('$var:$var', () => {
      const keys = filterKeys()
      const actual = replaceArgv(
        ['$npm_package_config_app:$npm_package_version'],
        keys
      )
      const expected = [`${ENV_APP_NAME}:${process.env.npm_package_version}`]
      assert.deepStrictEqual(actual, expected)
    })

    it('%var%:%var%', () => {
      const keys = filterKeys()
      const actual = replaceArgv(
        ['%npm_package_config_app%:%npm_package_version%'],
        keys
      )
      const expected = [`${ENV_APP_NAME}:${process.env.npm_package_version}`]
      assert.deepStrictEqual(actual, expected)
    })

    it('Overlapping prefix: var', () => {
      const keys = filterKeys()
      const actual = replaceArgv(
        [
          'npm_package_config_app',
          'npm_package_config_app_mode',
          'npm_package_config_appMode'
        ],
        keys
      )
      const expected = [ENV_APP_NAME, ENV_APP_MODE, ENV_APP_MODE]

      assert.deepStrictEqual(actual, expected)
    })

    it('Overlapping prefix: $var', () => {
      const keys = filterKeys()
      const actual = replaceArgv(
        [
          '$npm_package_config_app',
          '$npm_package_config_app_mode',
          '$npm_package_config_appMode'
        ],
        keys
      )
      const expected = [ENV_APP_NAME, ENV_APP_MODE, ENV_APP_MODE]

      assert.deepStrictEqual(actual, expected)
    })

    it('Overlapping prefix: %var%', () => {
      const keys = filterKeys()
      const actual = replaceArgv(
        [
          '%npm_package_config_app%',
          '%npm_package_config_app_mode%',
          '%npm_package_config_appMode%'
        ],
        keys
      )
      const expected = [ENV_APP_NAME, ENV_APP_MODE, ENV_APP_MODE]

      assert.deepStrictEqual(actual, expected)
    })

    it('Maltiple variables in an one paramter: "var1-var2", "$var1-$var2", "%var1%-%var2%"', () => {
      const keys = filterKeys()
      const actual = replaceArgv(
        [
          'npm_package_config_app-npm_package_version',
          '$npm_package_config_app-$npm_package_version',
          '%npm_package_config_app%-%npm_package_version%'
        ],
        keys
      )
      const expected = ENV_APP_NAME + '-' + process.env.npm_package_version

      assert.deepStrictEqual(actual, [expected, expected, expected])
    })

    it('npm_config: var', () => {
      const keys = filterKeys()
      const actual = replaceArgv(
        [
          'test',
          'param=npm_config_app,other',
          'param=npm_package_version,other'
        ],
        keys
      )
      const expected = [
        'test',
        'param=' + ENV_APP_NAME + ',other',
        'param=' + process.env.npm_package_version + ',other'
      ]

      assert.deepStrictEqual(actual, expected)
    })

    it('npm_config: $var', () => {
      const keys = filterKeys()
      const actual = replaceArgv(
        [
          'test',
          'param=$npm_config_app,other',
          'param=$npm_package_version,other'
        ],
        keys
      )
      const expected = [
        'test',
        'param=' + ENV_APP_NAME + ',other',
        'param=' + process.env.npm_package_version + ',other'
      ]

      assert.deepStrictEqual(actual, expected)
    })

    it('npm_config: %var%', () => {
      const keys = filterKeys()
      const actual = replaceArgv(
        [
          'test',
          'param=%npm_config_app%,other',
          'param=%npm_package_version%,other'
        ],
        keys
      )
      const expected = [
        'test',
        'param=' + ENV_APP_NAME + ',other',
        'param=' + process.env.npm_package_version + ',other'
      ]

      assert.deepStrictEqual(actual, expected)
    })
  })
})
