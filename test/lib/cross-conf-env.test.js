import assert from 'assert';
import CrossConfEnv from '../../src/lib/cross-conf-env.js';

/** @test {CrossConfEnv} */
describe( 'CrossConfEnv', () => {
  const APP_NAME = 'MyApp';
  const APP_LANG = '2.0.0';

  beforeEach( () => {
    process.env.npm_package_config_app     = APP_NAME;
    process.env.npm_package_config_lang = APP_LANG;
  } );

  /** @test {CrossConfEnv#keys} */
  describe( 'keys', () => {
    it( 'npm_package_config_...', () => {
      let   exec = new CrossConfEnv();
      const keys = exec.keys.filter( ( key ) => key === 'npm_package_config_app' );
      assert( keys.length === 1 );

      exec = new CrossConfEnv( [], true );
      assert( exec.keys.length === 2 );
    } );
  } );

  /** @test {CrossConfEnv#argv} */
  describe( 'argv', () => {
    it( 'npm_package_..., replace "var", "$var", "%var%"', () => {
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

    it( 'npm_package_..., replace "param=var,var2", "param=$var,var2", "param=%var%,var2"', () => {
      let cce  = new CrossConfEnv( [ 'test', 'param=npm_package_config_app,var2', 'param=npm_package_version,var2' ] );
      assert.deepEqual( cce.argv, [ 'test', 'param=' + APP_NAME + ',var2', 'param=' + process.env.npm_package_version + ',var2' ] );

      cce  = new CrossConfEnv( [ 'test', 'param=npm_package_config_lang,var2', 'param=npm_package_name,var2' ] );
      assert.deepEqual( cce.argv, [ 'test', 'param=' + APP_LANG + ',var2', 'param=' + process.env.npm_package_name + ',var2' ] );

      cce  = new CrossConfEnv( [ 'test', 'param=$npm_package_config_app,var2', 'param=$npm_package_version,var2' ] );
      assert.deepEqual( cce.argv, [ 'test', 'param=' + APP_NAME + ',var2', 'param=' + process.env.npm_package_version + ',var2' ] );

      cce  = new CrossConfEnv( [ 'test', 'param=$npm_package_config_lang,var2', 'param=$npm_package_name,var2' ] );
      assert.deepEqual( cce.argv, [ 'test', 'param=' + APP_LANG + ',var2', 'param=' + process.env.npm_package_name + ',var2' ] );

      cce  = new CrossConfEnv( [ 'test', 'param=%npm_package_config_app%,var2', 'param=%npm_package_version%,var2' ] );
      assert.deepEqual( cce.argv, [ 'test', 'param=' + APP_NAME + ',var2', 'param=' + process.env.npm_package_version + ',var2' ] );

      cce  = new CrossConfEnv( [ 'test', 'param=%npm_package_config_lang%,var2', 'param=%npm_package_name%,var2' ] );
      assert.deepEqual( cce.argv, [ 'test', 'param=' + APP_LANG + ',var2', 'param=' + process.env.npm_package_name + ',var2' ] );
    } );

    it( 'npm_package_conf_..., replace "var", "$var", "%var%"', () => {
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

    it( 'npm_package_conf_..., replace "param=var,var2", "param=$var,var2", "param=%var%,var2"', () => {
      let cce  = new CrossConfEnv( [ 'test', 'param=npm_package_config_app,var2', 'param=npm_package_version,var2' ], true );
      assert.deepEqual( cce.argv, [ 'test', 'param=' + APP_NAME + ',var2', 'param=npm_package_version,var2' ] );

      cce  = new CrossConfEnv( [ 'test', 'param=npm_package_config_lang,var2', 'param=npm_package_name,var2' ], true );
      assert.deepEqual( cce.argv, [ 'test', 'param=' + APP_LANG + ',var2', 'param=npm_package_name,var2' ] );

      cce  = new CrossConfEnv( [ 'test', 'param=$npm_package_config_app,var2', 'param=$npm_package_version,var2' ], true );
      assert.deepEqual( cce.argv, [ 'test', 'param=' + APP_NAME + ',var2', 'param=$npm_package_version,var2' ] );

      cce  = new CrossConfEnv( [ 'test', 'param=$npm_package_config_lang,var2', 'param=$npm_package_name,var2' ], true );
      assert.deepEqual( cce.argv, [ 'test', 'param=' + APP_LANG + ',var2', 'param=$npm_package_name,var2' ] );

      cce  = new CrossConfEnv( [ 'test', 'param=%npm_package_config_app%,var2', 'param=%npm_package_version%,var2' ], true );
      assert.deepEqual( cce.argv, [ 'test', 'param=' + APP_NAME + ',var2', 'param=%npm_package_version%,var2' ] );

      cce  = new CrossConfEnv( [ 'test', 'param=%npm_package_config_lang%,var2', 'param=%npm_package_name%,var2' ], true );
      assert.deepEqual( cce.argv, [ 'test', 'param=' + APP_LANG + ',var2', 'param=%npm_package_name%,var2' ] );
    } );

    it( 'overlapping', () => {
      const cce = new CrossConfEnv( [ 'npm_package_config_app', '$npm_package_config_app', '%npm_package_config_app%' ], true );
      assert.deepEqual( cce.argv, [ APP_NAME, APP_NAME, APP_NAME ] );
    } );
  } );
} );
