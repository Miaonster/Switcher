define(function(require, exports) {

  exports.init = function($) {

      $.fn.rename = function(options) {
        var $this = this;

        function startRename() {
          var selection,
              range,
              element = $this.get(0);

          $this.attr('contenteditable', true);
          selection = window.getSelection();
          range = window.document.createRange();
          range.selectNodeContents(element);
          selection.removeAllRanges();
          selection.addRange(range);
        }

        function stopRename() {
          $this.attr('contenteditable', false);
          $this.off('blur', blurCallback);
          $this.off('keydown', keydownCallback);
          if (options.stop) {
            options.stop.call($this);
          }
        }

        function keydownCallback(e) {
          if (e.keyCode === 27 || e.keyCode === 13) {
            $this.trigger('blur');
          }
        }

        function blurCallback() {
          stopRename();
        }

        startRename();

        this.on('blur', blurCallback);
        this.on('keydown', keydownCallback);

        return this;
      }

  };

});
