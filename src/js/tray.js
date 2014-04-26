var fs = require('fs'),
    gui = require('nw.gui');

define(function(require) {

  function menuClickHandler() {
    //hosts
  }

  return {
    tray: null,

    init: function() {
      this.initTray();
      this.initEvent();
    },

    initTray: function() {
      var that = this,
          menu = new gui.Menu(),
          config;

      this.resetMenu(menu);

      config = {
        icon: 'img/app-gray.png',
        menu: menu
      };

      this.tray = new gui.Tray(config);
    },

    initEvent: function() {
      var that = this;

      e.on('change.hosts', function() {
        that.resetMenu();
      });
    },

    resetMenu: function(menu) {
      menu = menu || this.tray.menu;

      while(menu.items && menu.items.length) {
        menu.removeAt(0);
      }

      hosts.hosts.forEach(function(host) {
        var item,
            conf = {
              label: host.name,
              type: host.custom ? 'checkbox' : 'normal',
              checked: !!host.using
            };

        item = new gui.MenuItem(conf);
        item.click = menuClickHandler;
        item.uid = host.id;

        menu.append(item);
      });
    }
  };

});
