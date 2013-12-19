// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
define(function(require) {
  return function (str, data) {
      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      var fn = new Function("obj",
              "var p=[],print=function(){p.push.apply(p,arguments);};" +

              // Introduce the data as local variables using with(){}
              "with(obj){p.push('" +

              // Convert the template into pure JavaScript
              str
                  .replace(/[\r\t\n]/g, " ")
                  .split("<%").join("\t")
                  .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                  .replace(/\t=(.*?)%>/g, "',$1,'")
                  .split("\t").join("');")
                  .split("%>").join("p.push('")
                  .split("\r").join("\\'") +
              "');}return p.join('');");

      // Provide some basic currying to the user
      return data ? fn( data ) : fn;
  };

});
