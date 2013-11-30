CodeMirror.defineMode('hosts', function(config) {

  function tokenBase(stream, state) {
    var sol = stream.sol();
    var ch = stream.next();

    if (sol && ch === '#') {
      stream.skipToEnd();
      return 'comment';
    }

    /*if (sol && /\d/.test(ch)) {
      stream.eatWhile(/[\d\.]/);
      return 'number';
    }

    if (/\w/.test(ch)) {
      stream.skipToEnd();
      return 'keyword';
    }*/

  }

  function tokenize(stream, state) {
    return tokenBase(stream, state);
  };

  return {
    token: function(stream, state) {
      if (stream.eatSpace()) return null;
      return tokenize(stream, state);
    }
  };

});
