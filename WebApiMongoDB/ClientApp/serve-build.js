const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 44482;
const buildDir = path.join( __dirname, "build" );

const contentTypes = {
  ".css": "text/css",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon",
  ".map": "application/json; charset=utf-8"
};

const sendFile = ( res, filePath ) =>
{
  fs.readFile( filePath, ( error, data ) =>
  {
    if ( error )
    {
      res.writeHead( 500, { "Content-Type": "text/plain; charset=utf-8" } );
      res.end( "Unable to load the app." );
      return;
    }

    const ext = path.extname( filePath ).toLowerCase();
    res.writeHead( 200, {
      "Content-Type": contentTypes[ext] || "application/octet-stream",
      "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=31536000"
    } );
    res.end( data );
  } );
};

http.createServer( ( req, res ) =>
{
  const requestPath = decodeURIComponent( ( req.url || "/" ).split( "?" )[0] );
  const safePath = path.normalize( requestPath ).replace( /^(\.\.[/\\])+/, "" );
  let filePath = path.join( buildDir, safePath === path.sep ? "index.html" : safePath );

  fs.stat( filePath, ( statError, stats ) =>
  {
    if ( !statError && stats.isDirectory() )
    {
      filePath = path.join( filePath, "index.html" );
    }

    fs.access( filePath, fs.constants.F_OK, accessError =>
    {
      if ( accessError )
      {
        sendFile( res, path.join( buildDir, "index.html" ) );
        return;
      }

      sendFile( res, filePath );
    } );
  } );
} ).listen( port, () =>
{
  console.log( `School app is available at http://localhost:${port}` );
} );
