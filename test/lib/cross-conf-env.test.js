import assert from 'assert';
import CrossConfEnv from '../../src/lib/cross-conf-env.js';

/** @test {CrossConfEnv} */
describe( 'CrossConfEnv', () => {
  const APP_NAME = 'MyApp';
  const APP_LANG = '2.0.0';

  beforeEach( () => {
    process.env.npm_package_config_app  = APP_NAME;
    process.env.npm_package_config_lang = APP_LANG;
  } );

  /** @test {CrossConfEnv#keys} */
  describe( 'keys', () => {
    it( 'npm_package_config', () => {
      let   exec = new CrossConfEnv();
      const keys = exec.keys.filter( ( key ) => key === 'npm_package_config_app' );
      assert( keys.length === 1 );

      exec = new CrossConfEnv( [], true );
      assert( exec.keys.length === 2 );
    } );
  } );

  /** @test {CrossConfEnv#argv} */
  describe( 'argv', () => {
    it( 'npm_package: "var", "$var", "%var%"', () => {
      let cce  = new CrossConfEnv( [ 'test', 'npm_package_config_app', 'npm_package_version' ] );
      assert.deepEqual( cce.argv, [ 'test', APP_NAME, process.env.npm_package_version ] );

      cce  = new CrossConfEnv( [ 'test', 'npm_package_config_lang', 'npm_package_name' ] );
      assert.deepEqual( cce.argv, [ 'test', APP_LANG, process.env.npm_package_name ] );

      cce  = new CrossConfEnv( [ 'test', '$npm_package_config_app', '$npm_package_version' ] );
      assert.deepEqual( cce.argv, [ 'test', APP_NAME, process.env.npm_package_version ] );

      cce  = new CrossConfEnv( [ 'test', '$npm_package_config_lang', '$npm_package_name' ] );
      assert.deepEqual( cce.argv, [ 'test', APP_LANG, process.env.npm_package_name ] );

      cce  = new CrossConfEnv( [ 'test', '%npm_package_config_app%', '%npm_package_version%' ] );
      assert.deepEqual( cce.argv, [ 'test', APP_NAME, process.env.npm_package_version ] );

      cce  = new CrossConfEnv( [ 'test', '%npm_package_config_lang%', '%npm_package_name%' ] );
      assert.deepEqual( cce.argv, [ 'test', APP_LANG, process.env.npm_package_name ] );
    } );

    it( 'npm_package: "param=var,other", "param=$var,other", "param=%var%,other"', () => {
      let cce  = new CrossConfEnv( [ 'test', 'param=npm_package_config_app,other', 'param=npm_package_version,other' ] );
      assert.deepEqual( cce.argv, [ 'test', 'param=' + APP_NAME + ',other', 'param=' + process.env.npm_package_version + ',other' ] );

      cce  = new CrossConfEnv( [ 'test', 'param=npm_package_config_lang,other', 'param=npm_package_name,other' ] );
      assert.deepEqual( cce.argv, [ 'test', 'param=' + APP_LANG + ',other', 'param=' + process.env.npm_package_name + ',other' ] );

      cce  = new CrossConfEnv( [ 'test', 'param=$npm_package_config_app,other', 'param=$npm_package_version,other' ] );
      assert.deepEqual( cce.argv, [ 'test', 'param=' + APP_NAME + ',other', 'param=' + process.env.npm_package_version + ',other' ] );

      cce  = new CrossConfEnv( [ 'test', 'param=$npm_package_config_lang,other', 'param=$npm_package_name,other' ] );
      assert.deepEqual( cce.argv, [ 'test', 'param=' + APP_LANG + ',other', 'param=' + process.env.npm_package_name + ',other' ] );

      cce  = new CrossConfEnv( [ 'test', 'param=%npm_package_config_app%,other', 'param=%npm_package_version%,other' ] );
      assert.deepEqual( cce.argv, [ 'test', 'param=' + APP_NAME + ',other', 'param=' + process.env.npm_package_version + ',other' ] );

      cce  = new CrossConfEnv( [ 'test', 'param=%npm_package_config_lang%,other', 'param=%npm_package_name%,other' ] );
      assert.deepEqual( cce.argv, [ 'test', 'param=' + APP_LANG + ',other', 'param=' + process.env.npm_package_name + ',other' ] );
    } );

    it( 'npm_package_config: "var", "$var", "%var%"', () => {
      let cce  = new CrossConfEnv( [ 'test', 'npm_package_config_app' ], true );
      assert.deepEqual( cce.argv, [ 'test', APP_NAME ] );

      cce  = new CrossConfEnv( [ 'test', 'npm_package_config_lang' ], true );
      assert.deepEqual( cce.argv, [ 'test', APP_LANG ] );

      cce  = new CrossConfEnv( [ 'test', '$npm_package_config_app' ], true );
      assert.deepEqual( cce.argv, [ 'test', APP_NAME ] );

      cce  = new CrossConfEnv( [ 'test', '$npm_package_config_lang' ], true );
      assert.deepEqual( cce.argv, [ 'test', APP_LANG ] );

      cce  = new CrossConfEnv( [ 'test', '%npm_package_config_app%' ], true );
      assert.deepEqual( cce.argv, [ 'test', APP_NAME ] );

      cce  = new CrossConfEnv( [ 'test', '%npm_package_config_lang%' ], true );
      assert.deepEqual( cce.argv, [ 'test', APP_LANG ] );
    } );

    it( 'npm_package_config: "param=var,other", "param=$var,other", "param=%var%,other"', () => {
      let cce  = new CrossConfEnv( [ 'test', 'param=npm_package_config_app,other', 'param=npm_package_version,other' ], true );
      assert.deepEqual( cce.argv, [ 'test', 'param=' + APP_NAME + ',other', 'param=npm_package_version,other' ] );

      cce  = new CrossConfEnv( [ 'test', 'param=npm_package_config_lang,other', 'param=npm_package_name,other' ], true );
      assert.deepEqual( cce.argv, [ 'test', 'param=' + APP_LANG + ',other', 'param=npm_package_name,other' ] );

      cce  = new CrossConfEnv( [ 'test', 'param=$npm_package_config_app,other', 'param=$npm_package_version,other' ], true );
      assert.deepEqual( cce.argv, [ 'test', 'param=' + APP_NAME + ',other', 'param=$npm_package_version,other' ] );

      cce  = new CrossConfEnv( [ 'test', 'param=$npm_package_config_lang,other', 'param=$npm_package_name,other' ], true );
      assert.deepEqual( cce.argv, [ 'test', 'param=' + APP_LANG + ',other', 'param=$npm_package_name,other' ] );

      cce  = new CrossConfEnv( [ 'test', 'param=%npm_package_config_app%,other', 'param=%npm_package_version%,other' ], true );
      assert.deepEqual( cce.argv, [ 'test', 'param=' + APP_NAME + ',other', 'param=%npm_package_version%,other' ] );

      cce  = new CrossConfEnv( [ 'test', 'param=%npm_package_config_lang%,other', 'param=%npm_package_name%,other' ], true );
      assert.deepEqual( cce.argv, [ 'test', 'param=' + APP_LANG + ',other', 'param=%npm_package_name%,other' ] );
    } );

    it( 'Overlapping', () => {
      const cce = new CrossConfEnv( [ 'npm_package_config_app', '$npm_package_config_app', '%npm_package_config_app%' ], true );
      assert.deepEqual( cce.argv, [ APP_NAME, APP_NAME, APP_NAME ] );
    } );

    it( 'Maltiple variables in an one paramter: "var-var2", "$var-$var2", "%var%-%var2%"', () => {
      const cce = new CrossConfEnv( [ 'npm_package_config_app-npm_package_version', '$npm_package_config_app-$npm_package_version', '%npm_package_config_app%-%npm_package_version%' ] );
      const expected = APP_NAME + '-' + process.env.npm_package_version;
      assert.deepEqual( cce.argv, [ expected, expected, expected ] );
    } );
  } );
} );
