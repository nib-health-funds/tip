var offset = require('offset');

/**
 * Merges the keys
 * @returns {Object}
 */
function merge() {
  var merged = {};
  for (var i=0; i<arguments.length; ++i) {
    for (var key in arguments[i]) {
      merged[key] = arguments[i][key];
    }
  }
  return merged;
}

/**
 * Find the immediate parent which contains `position: relative`
 * @param   {HTMLElement} el
 * @returns {HTMLElement}
 */
function offsetParent(el) {

  //IE8-9 returns body as the offsetParent if the element is hidden, so ignore the provided offsetParent if it is the body and our
  //  loop below to find the correct one (if it is actually body the below loop will still work)
  if (el.offsetParent &&  el.offsetParent !== document.body) {
    return el.offsetParent;
  }

  //because when el has `display: none` or `position: fixed` then `offsetParent` returns null -- should we calc the position when the tip is displayed instead??
  while (el.parentNode !== document.body && el.parentNode !== document.rootElement) {
    el = el.parentNode;
    var style = window.getComputedStyle ? window.getComputedStyle(el) : el.currentStyle;
    if (style.position != 'static') {
      return el;
    }
  }
  return document.body;
}


/**
 * Create a tip
 * @constructor
 * @param   {Object}  options
 * @param   {Object}  options.classes
 */
function Tip(options) {
  var self = this;

  //merge the default options
  this.options = merge(Tip.defaults, options);

  //init the default values
  this._visible   = false;
  this._parent    = null;
  this._target    = null;
  this._position  = null;

  //create the element and add it to the body
  this.el = document.createElement('div');
  this.el.classList.add(this.options.classes.el);
  this.el.classList.add(this.options.classes.hide);
  document.body.appendChild(this.el);

  //set the direction
  this.direction(this.options.direction);

  /**
   * Reposition the tip
   */
  function reposition() {
    if (self._visible && self._target) {
      self.positionAt(self._target, self._position);
    }
  }

  //reposition the tip when the user stops resizing the window
  window.addEventListener('resize', function() {
    if (self.resizeTimeout) {
      clearTimeout(self.resizeTimeout);
    }
    self.resizeTimeout = setTimeout(reposition, 100);
  });

}

/**
 * The default options
 * @type  {Object}
 */
Tip.defaults = {
  direction:    'up',
  classes: {
    el:         'tip',
    show:       '',
    hide:       'tip--hidden',
    direction:  'tip--direction-',
    position:   'tip--position-'
  }
};

Tip.prototype = {

  /**
   * Make the tip a child
   * @param   {HTMLElement}     parent
   * @returns {Tip}
   */
  prependTo: function(parent) {
    parent.insertBefore(this.el, parent.firstChild);
    this._parent = parent;
    return this;
  },

  /**
   * Show the tip
   * @returns {Tip}
   */
  show: function() {
    this._visible = true;
    if (this.options.classes.hide) this.el.classList.remove(this.options.classes.hide);
    if (this.options.classes.show) this.el.classList.add(this.options.classes.show);
    return this;
  },

  /**
   * Hide the tip
   * @returns {Tip}
   */
  hide: function() {
    this._visible = false;
    if (this.options.classes.show) this.el.classList.remove(this.options.classes.show);
    if (this.options.classes.hide) this.el.classList.add(this.options.classes.hide);
    return this;
  },

  /**
   * Set the direction of the tip
   * @param   {String} direction
   * @returns {Tip}
   */
  direction: function(direction) {

    switch (direction) {

      case 'up':
      case 'down':
      case 'left':
      case 'right':
        break;

      default:
        throw new Error('Invalid direction "'+direction+'"');

    }

    //set the direction class
    this.el.classList.remove(this.options.classes.direction+this._direction);
    this.el.classList.add(this.options.classes.direction+direction);

    //save the direction
    this._direction = direction;
    return this;
  },

  /**
   * Position the element at X and Y co-ordinates - co-ordinates are relative to the document
   * @param   {Number}        x
   * @param   {Number}        y
   * @returns {Tip}
   */
  position: function(x, y) {

    if (this._parent) {
      var parentOffset = offset(offsetParent(this.el));
      x = x - parentOffset.left;
      y = y - parentOffset.top;
    }

    this.el.style.left  = x+'px';
    this.el.style.top   = y+'px';


    //remove the position class
    if (this._position) {
      this.el.classList.remove(this.options.classes.position+this._position);
    }

    //clear any saved position
    this._target    = null;
    this._position  = null;
    return this;
  },

  /**
   * Position the element relative to the target
   * @param   {HTMLElement}   target
   * @param   {String}        position
   * @returns {Tip}
   */
  positionAt: function(target, position) {
    var
      targetOffset  = offset(target),
      left      = targetOffset.left,
      top       = targetOffset.top
    ;

    //determine the pixel tip position
    switch (position) {

      case 'top':
        left  += target.offsetWidth/2;
        break;

      case 'bottom':
        left  += target.offsetWidth/2;
        top   += target.offsetHeight;
        break;

      case 'left':
        top   += target.offsetHeight/2;
        break;

      case 'right':
        left  += target.offsetWidth;
        top   += target.offsetHeight/2;
        break;

      default:
        throw new Error('Invalid position "'+position+'"');

    }

    //position the tip at the x, y co-ordinate
    this.position(left, top);

    //set the position class
    if (this._position) {
      this.el.classList.remove(this.options.classes.position+this._position);
    }
    this.el.classList.add(this.options.classes.position+position);

    //save the position
    this._target    = target;
    this._position  = position;
    return this;
  }

};

module.exports = Tip;