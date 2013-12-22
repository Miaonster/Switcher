define(function(require, exports) {
  function Tip(options) {
    var _this = this;

    this.$el = $(options.selector);

    this.$el.find('[data-role]').each(function(index) {
      var $this = $(this);
      _this[ '$' + $this.data('role') ] = $this;
    });

    for (var index in options) {
      this[index] = options[index];
    }

    if ($.isFunction(this._init)) {
      this._init();
    }
  }

  Tip.prototype.show = function() {
    this.$el.animate({
      top: 0
    }, 'fast');

    return this;
  };

  Tip.prototype.hide = function() {
    this.$el.animate({
      top: -200
    }, 'fast');
    return this;
  };

  Tip.prototype.wait = function() {
    var _this = this;

    setTimeout(function() {
      _this.hide();
    }, 1000);
    return this;
  };

  exports.pass = new Tip({

    selector: '.js-pass',

    _init: function() {
      var _this = this;

      this.$password.on('keydown', function(e) {
        if (e.keyCode === 13) {
          _this.hide();
          _this.done($(this).val());
        }
      });

      this.$ok.on('click', function() {
        _this.hide();
        _this.done(_this.$password.val());
      });

      this.$cancel.on('click', function() {
        _this.hide();
      });
    },

    drop: function(done) {
      this.show();
      this.$password.focus();
      this.done = done;
    },

    rise: function() {
      this.hide();
    }

  });

  exports.text = new Tip({
    selector: '.js-text',

    text: function(text) {
      this.$text.text(text)
      return this;
    },

    drop: function(done) {
      var _this = this;

      //this.show().wait(1000).hide();
      this.show();

      setTimeout(function() {
        _this.hide();
      }, 1200);

      return this;
    }

  });
});
