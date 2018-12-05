var events = [];
var onceEvent = {};

var EventBus = {
  /**
   * add event
   */
  on: function on(eventName, fn) {
    console.log('注册')
    events.push({
      name: eventName,
      fn: fn
    });
  },

  /**
   * emit event
   */
  emit: function emit(eventName) {
    console.log('通知 ' + arguments[0])
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    console.log('events.length ' + events.length)
    try {
      for (var _iterator = events[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _event = _step.value;
        if (_event.name === arguments[0]) {
          if (args.length > 0) {
            _event.fn.apply(_event.fn, args);
          } else {
            _event.fn.apply(_event.fn, []);
          }
        } 
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  },

  /**
   * off event by fn or by name
   */
  off: function off(eventName) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    switch (args.length) {
      case 1:
        {
          if (typeof args[0] === 'function') {
            events = events.filter(function(e) {
              return e.fn !== args[0] || e.name !== eventName;
            });
          } else {
            // filter same namespace event
            events = events.filter(function(e) {
              return e.name !== eventName;
            });
          }
          break;
        }
      case 2:
        {
          // filter same namespace with function
          events = events.filter(function(e) {
            return e.fn !== args[0] || e.name !== eventName;
          });
          break;
        }
      default:
        {
          events = events.filter(function(e) {
            return e.name !== eventName;
          });
        }
    }
  }
};

module.exports = EventBus;