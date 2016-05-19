import CrossConfEnv from './cross-conf-env.js';

/**
 * Replace the value of the command line arguments in process.env,
 * and run the process with a replaced arguments.
 *
 * @param {Array.<Object>} argv Arguments of the command line.
 */
module.exports = ( argv ) => {
  const exec = new CrossConfEnv( argv );
  exec.run();
};
