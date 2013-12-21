define(function(require) {
  function Tip(selector) {
    this.$el = $(selector);
  }

  Tip.prototype.show = function() {
    this.$el.top(0);
    setTimeout(function() {
      this.$el.top(200);
    }, 1000);
  }

  return Tip;
});
