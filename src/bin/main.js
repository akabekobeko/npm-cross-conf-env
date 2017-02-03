#!/usr/bin/env node

'use strict';

const CrossConfEnv = require( '../lib/main.js' );

CrossConfEnv.execute( process.argv.slice( 2 ) );
