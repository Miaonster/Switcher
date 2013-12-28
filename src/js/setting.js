var gui = require('nw.gui'),
    win = gui.Window.get();

define(function(require) {

  return {

    store: null,

    init: function() {
      this.get();
      this.initSize();
    },

    initSize: function() {
      var _this = this;

      if (this.store.size) {
        win.height = this.store.size.height;
        win.width  = this.store.size.width;
      } else {
        this.store.size = {
          height: win.height,
          width: win.width
        };
      }

      win.on('resize', function() {
        _this.store.size.height = win.height;
        _this.store.size.width  = win.width;
        _this.set();
      });
    },

    get: function() {
      try {
        this.store = JSON.parse(localStorage.getItem('setting')) || {};
      } catch(e) {
        this.store = {};
      }
    },

    set: function() {
      try {
        localStorage.setItem('setting', JSON.stringify(this.store));
      } catch(e) {
      }
    }

  };

});
