#!/usr/bin/env node

'use strict'

const CrossConfEnv = require('../lib/index.js')
CrossConfEnv.execute(process.argv.slice(2))
