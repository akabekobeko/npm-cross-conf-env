import Spawn from 'cross-spawn';

/**
 * Replace the value of the command line arguments in process.env,
 * and run the process with a replaced arguments.
 */
export default class CrossConfEnv {
  /**
   * Initialize instance.
   *
   * @param {Array.<Object>} argv              Arguments of the command line.
   * @param {Boolean}        isReplaceOnlyConf Only to select "npm_package_config_", To specify the "true".
   */
  constructor( argv = [], isReplaceOnlyConf = false ) {
    this._keys = this._filterKeys( isReplaceOnlyConf );
    this._argv = this._replaceArgv( argv );
  }

  /**
   * Get the Arguments of the command line.
   *
   * @return {Array.<Object>} argv Arguments of the command line.
   */
  get argv() {
    return this._argv;
  }

  /**
   * Gets the keys to be replace.
   *
   * @return {Array.<String>} Keys.
   */
  get keys() {
    return this._keys;
  }

  /**
   * Run the process with a replaced arguments.
   */
  run() {
    if( !( this._argv && 0 < this._argv.length ) ) { return process.exit(); }

    const argv    = this._argv.concat();
    const command = argv.shift();
    const proc    = Spawn( command, argv, { stdio: 'inherit' } );

    proc.on( 'exit', process.exit );

    return proc;
  }

  /**
   * Select the key of the value to be replaced from "process.env".
   *
   * @param {Boolean} isReplaceOnlyConf Only to select "npm_package_config_", To specify the "true".
   *
   * @return {Array.<String>} Keys.
   */
  _filterKeys( isReplaceOnlyConf ) {
    const targetPrefix = isReplaceOnlyConf ? 'npm_package_config_' : 'npm_package_';
    return Object.keys( process.env ).filter( ( key ) => {
      return ( key && typeof key === 'string' && key.indexOf( targetPrefix ) !== -1 );
    } );
  }

  /**
   * Replace the arguments in the value of "process.env".
   *
   * @param {Array.<Object>} argv Arguments of the command line.
   *
   * @return {Array.<String>} Augments.
   */
  _replaceArgv( argv ) {
    if( this._keys.length === 0 ) { return argv; }

    return argv.map( ( arg ) => {
      let newArg = arg;
      this._keys.forEach( ( key ) => {
        const pettern = '%' + key + '%|\\$' + key + '|' + key;
        const regexp  = new RegExp( pettern );
        if( regexp.test( newArg ) ) {
          newArg = newArg.replace( regexp, String( process.env[ key ] ) );
        }
      } );

      return newArg;
    } );
  }
}
