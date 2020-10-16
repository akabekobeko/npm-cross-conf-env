const crossSpawn = require('cross-spawn')

/**
 * Select the key of the value to be replaced from `process.env`.
 * @returns Keys.
 */
export const filterKeys = () => {
  return Object.keys(process.env)
    .filter((key) => {
      return (
        key &&
        typeof key === 'string' &&
        (key.indexOf('npm_package_') !== -1 ||
          key.indexOf('npm_config_') !== -1)
      )
    })
    .sort((a, b) => {
      // Processing the variables with the same prefix in the correct order.
      // "npm_package_config_NAME_NAME2" contained in "npm_package_config_NAME"
      // is in descending order by the length to prevent from being replace earlier.
      //
      return b.length - a.length
    })
}

/**
 * Replace the arguments in the value of "process.env".
 * @param argv Arguments of the command line.
 * @param keys The filtered key ( "npm_package_" or "npm_config_" ) of "process.env".
 * @returns Augments.
 */
export const replaceArgv = (argv: string[], keys: string[]) => {
  if (keys.length === 0) {
    return argv
  }

  return argv.map((arg) => {
    let newArg = arg
    keys.forEach((key) => {
      const pettern = '%' + key + '%|\\$' + key + '|' + key
      const regexp = new RegExp(pettern, 'g')
      if (regexp.test(newArg)) {
        newArg = newArg.replace(regexp, String(process.env[key]))
      }
    })

    return newArg
  })
}

/**
 * Replace the value of the command line arguments in process.env, and run the process with a replaced arguments.
 * @param argv Arguments of the command line.
 * @returns Process.
 */
export const crossConfEnv = (argv: string[]) => {
  const newArgv = replaceArgv(argv, filterKeys())
  if (!(newArgv && 0 < newArgv.length)) {
    return process.exit()
  }

  const command = newArgv.shift()
  const proc = crossSpawn(command, newArgv, { stdio: 'inherit' })
  proc.on('exit', process.exit)

  return proc
}
