"use strict";

const XlsxExtractor = require( 'xlsx-extractor' );

const extractor = new XlsxExtractor( '../test/data/sample.xlsx' );
const tasks     = [];
for( let i = 1, max = extractor.count; i <= max; ++i ) {
  tasks.push( extractor.extract( i ) );
}

Promise
.all( tasks )
.then( ( results ) => {
  console.log( JSON.stringify( results, null, '  ' ) + '\n' );
} )
.catch( ( err ) => {
  console.error( err );
} );
