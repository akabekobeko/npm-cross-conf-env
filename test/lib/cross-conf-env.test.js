import assert from 'assert';
import CrossConfEnv from '../../src/lib/cross-conf-env.js';

/** @test {CrossConfEnv} */
describe( 'CrossConfEnv', () => {
  const ENV_APP_NAME  = 'MyApp';
  const ENV_APP_MODE  = 'test';
  const ENV_APP_LANG  = 'en-us';

  // The number that defines the "npm_package_config_NAME" in "beforeEach"
  const ENV_COUNT = 4;

  beforeEach( () => {
    process.env.npm_package_config_app      = ENV_APP_NAME;
    process.env.npm_package_config_appMode  = ENV_APP_MODE;
    process.env.npm_package_config_app_mode = ENV_APP_MODE;
    process.env.npm_package_config_lang     = ENV_APP_LANG;
  } );

  /** @test {CrossConfEnv#keys} */
  describe( 'keys', () => {
    it( 'npm_package_config', () => {
      let   exec = new CrossConfEnv();
      const keys = exec.keys.filter( ( key ) => key === 'npm_package_config_app' );
      assert( keys.length === 1 );

      // npm_package_config only
      exec = new CrossConfEnv( [], true );
      assert( exec.keys.length === ENV_COUNT );
    } );
  } );

  /** @test {CrossConfEnv#argv} */
  describe( 'argv', () => {
    it( 'npm_package_NAME & npm_package_config_NAME: "var", "$var", "%var%"', () => {
      const expected1 = [ 'test', ENV_APP_NAME, process.env.npm_package_version ];
      const expected2 = [ 'test', ENV_APP_LANG, process.env.npm_package_name ];

      let cce  = new CrossConfEnv( [ 'test', 'npm_package_config_app', 'npm_package_version' ] );
      assert.deepEqual( cce.argv, expected1 );

      cce  = new CrossConfEnv( [ 'test', 'npm_package_config_lang', 'npm_package_name' ] );
      assert.deepEqual( cce.argv, expected2 );

      cce  = new CrossConfEnv( [ 'test', '$npm_package_config_app', '$npm_package_version' ] );
      assert.deepEqual( cce.argv, expected1 );

      cce  = new CrossConfEnv( [ 'test', '$npm_package_config_lang', '$npm_package_name' ] );
      assert.deepEqual( cce.argv, expected2 );

      cce  = new CrossConfEnv( [ 'test', '%npm_package_config_app%', '%npm_package_version%' ] );
      assert.deepEqual( cce.argv, expected1 );

      cce  = new CrossConfEnv( [ 'test', '%npm_package_config_lang%', '%npm_package_name%' ] );
      assert.deepEqual( cce.argv, expected2 );
    } );

    it( 'npm_package_NAME & npm_package_config_NAME with other: "param=var,other", "param=$var,other", "param=%var%,other"', () => {
      const expected1 = [ 'test', 'param=' + ENV_APP_NAME + ',other', 'param=' + process.env.npm_package_version + ',other' ];
      const expected2 = [ 'test', 'param=' + ENV_APP_LANG + ',other', 'param=' + process.env.npm_package_name + ',other' ];

      let cce  = new CrossConfEnv( [ 'test', 'param=npm_package_config_app,other', 'param=npm_package_version,other' ] );
      assert.deepEqual( cce.argv, expected1 );

      cce  = new CrossConfEnv( [ 'test', 'param=npm_package_config_lang,other', 'param=npm_package_name,other' ] );
      assert.deepEqual( cce.argv, expected2 );

      cce  = new CrossConfEnv( [ 'test', 'param=$npm_package_config_app,other', 'param=$npm_package_version,other' ] );
      assert.deepEqual( cce.argv, expected1 );

      cce  = new CrossConfEnv( [ 'test', 'param=$npm_package_config_lang,other', 'param=$npm_package_name,other' ] );
      assert.deepEqual( cce.argv, expected2 );

      cce  = new CrossConfEnv( [ 'test', 'param=%npm_package_config_app%,other', 'param=%npm_package_version%,other' ] );
      assert.deepEqual( cce.argv, expected1 );

      cce  = new CrossConfEnv( [ 'test', 'param=%npm_package_config_lang%,other', 'param=%npm_package_name%,other' ] );
      assert.deepEqual( cce.argv, expected2 );
    } );

    it( 'npm_package_config_NAME: "var", "$var", "%var%"', () => {
      const expected1 = [ 'test', ENV_APP_NAME ];
      const expected2 = [ 'test', ENV_APP_LANG ];

      let cce  = new CrossConfEnv( [ 'test', 'npm_package_config_app' ] );
      assert.deepEqual( cce.argv, expected1 );

      cce  = new CrossConfEnv( [ 'test', 'npm_package_config_lang' ] );
      assert.deepEqual( cce.argv, expected2 );

      cce  = new CrossConfEnv( [ 'test', '$npm_package_config_app' ] );
      assert.deepEqual( cce.argv, expected1 );

      cce  = new CrossConfEnv( [ 'test', '$npm_package_config_lang' ] );
      assert.deepEqual( cce.argv, expected2 );

      cce  = new CrossConfEnv( [ 'test', '%npm_package_config_app%' ] );
      assert.deepEqual( cce.argv, expected1 );

      cce  = new CrossConfEnv( [ 'test', '%npm_package_config_lang%' ] );
      assert.deepEqual( cce.argv, expected2 );
    } );

    it( 'without "npm_package_NAME": "param=var,other", "param=$var,other", "param=%var%,other"', () => {
      let cce  = new CrossConfEnv( [ 'test', 'param=npm_package_config_app,other', 'param=npm_package_version,other' ], true );
      assert.deepEqual( cce.argv, [ 'test', 'param=' + ENV_APP_NAME + ',other', 'param=npm_package_version,other' ] );

      cce  = new CrossConfEnv( [ 'test', 'param=npm_package_config_lang,other', 'param=npm_package_name,other' ], true );
      assert.deepEqual( cce.argv, [ 'test', 'param=' + ENV_APP_LANG + ',other', 'param=npm_package_name,other' ] );

      cce  = new CrossConfEnv( [ 'test', 'param=$npm_package_config_app,other', 'param=$npm_package_version,other' ], true );
      assert.deepEqual( cce.argv, [ 'test', 'param=' + ENV_APP_NAME + ',other', 'param=$npm_package_version,other' ] );

      cce  = new CrossConfEnv( [ 'test', 'param=$npm_package_config_lang,other', 'param=$npm_package_name,other' ], true );
      assert.deepEqual( cce.argv, [ 'test', 'param=' + ENV_APP_LANG + ',other', 'param=$npm_package_name,other' ] );

      cce  = new CrossConfEnv( [ 'test', 'param=%npm_package_config_app%,other', 'param=%npm_package_version%,other' ], true );
      assert.deepEqual( cce.argv, [ 'test', 'param=' + ENV_APP_NAME + ',other', 'param=%npm_package_version%,other' ] );

      cce  = new CrossConfEnv( [ 'test', 'param=%npm_package_config_lang%,other', 'param=%npm_package_name%,other' ], true );
      assert.deepEqual( cce.argv, [ 'test', 'param=' + ENV_APP_LANG + ',other', 'param=%npm_package_name%,other' ] );
    } );

    it( 'Overlapping', () => {
      const cce = new CrossConfEnv( [ 'npm_package_config_app', '$npm_package_config_app', '%npm_package_config_app%' ] );
      assert.deepEqual( cce.argv, [ ENV_APP_NAME, ENV_APP_NAME, ENV_APP_NAME ] );
    } );

    it( 'Overlapping prefix', () => {
      const expected = [ ENV_APP_NAME, ENV_APP_MODE, ENV_APP_MODE ];

      let cce = new CrossConfEnv( [ 'npm_package_config_app', 'npm_package_config_app_mode', 'npm_package_config_appMode' ] );
      assert.deepEqual( cce.argv, expected );

      cce = new CrossConfEnv( [ '$npm_package_config_app', '$npm_package_config_app_mode', '$npm_package_config_appMode' ] );
      assert.deepEqual( cce.argv, expected );

      cce = new CrossConfEnv( [ '%npm_package_config_app%', '%npm_package_config_app_mode%', '%npm_package_config_appMode%' ] );
      assert.deepEqual( cce.argv, expected );
    } );

    it( 'Maltiple variables in an one paramter: "var1-var2", "$var1-$var2", "%var1%-%var2%"', () => {
      const cce = new CrossConfEnv( [ 'npm_package_config_app-npm_package_version', '$npm_package_config_app-$npm_package_version', '%npm_package_config_app%-%npm_package_version%' ] );
      const expected = ENV_APP_NAME + '-' + process.env.npm_package_version;
      assert.deepEqual( cce.argv, [ expected, expected, expected ] );
    } );
  } );
} );
