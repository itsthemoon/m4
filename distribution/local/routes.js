/* eslint-disable */

/*
ATTENTION: This is an obfuscated file. You do not need to understand it.
Do NOT edit this file directly. Use it as a black box.

If you notice any issues with using this file, please contact the TAs.
*/
function _0x3585(_0x319d0d, _0x2352b2) {
  const _0x5e23e1 = _0x5e23();
  return (
    (_0x3585 = function (_0x358509, _0x1446ed) {
      _0x358509 = _0x358509 - 0x19a;
      let _0x103f73 = _0x5e23e1[_0x358509];
      return _0x103f73;
    }),
    _0x3585(_0x319d0d, _0x2352b2)
  );
}
const _0x391ef9 = _0x3585;
function _0x5e23() {
  const _0x43f16e = [
    'KvCZC',
    '9124556dClhCs',
    'mem',
    'ezFnz',
    'Service\x20',
    '3026112AglXbw',
    'toLocal',
    '23766OtLTpT',
    '9508aiASnL',
    'get',
    'routes',
    '6735832utTckH',
    'gossip',
    '1531755cdnFGY',
    '101SOMdKE',
    'groups',
    '9150RifxaO',
    'OBNoE',
    'status',
    '2380VwHScE',
    'comm',
    '4869OoxdWc',
    'store',
  ];
  _0x5e23 = function () {
    return _0x43f16e;
  };
  return _0x5e23();
}
(function (_0xf1b18, _0x4e04c2) {
  const _0x55a2e5 = _0x3585,
    _0x15c864 = _0xf1b18();
  while (!![]) {
    try {
      const _0x3536dd =
        (-parseInt(_0x55a2e5(0x19b)) / 0x1) *
          (-parseInt(_0x55a2e5(0x1ac)) / 0x2) +
        -parseInt(_0x55a2e5(0x19a)) / 0x3 +
        parseInt(_0x55a2e5(0x1a9)) / 0x4 +
        (-parseInt(_0x55a2e5(0x1a0)) / 0x5) *
          (-parseInt(_0x55a2e5(0x1ab)) / 0x6) +
        -parseInt(_0x55a2e5(0x1a5)) / 0x7 +
        -parseInt(_0x55a2e5(0x1af)) / 0x8 +
        (parseInt(_0x55a2e5(0x1a2)) / 0x9) * (parseInt(_0x55a2e5(0x19d)) / 0xa);
      if (_0x3536dd === _0x4e04c2) break;
      else _0x15c864['push'](_0x15c864['shift']());
    } catch (_0x2904dd) {
      _0x15c864['push'](_0x15c864['shift']());
    }
  }
})(_0x5e23, 0xeaa25);
const routesStore = new Map(),
  routes = {};
(routes[_0x391ef9(0x1ad)] = function (_0x1992a0, _0x332d72) {
  const _0xe2e8af = _0x391ef9,
    _0x29f9ca = {
      ezFnz: function (_0x327bcb, _0x18462b) {
        return _0x327bcb in _0x18462b;
      },
      OBNoE: function (_0x67add1, _0x12a78c, _0x5ed8f9) {
        return _0x67add1(_0x12a78c, _0x5ed8f9);
      },
      KvCZC: function (_0x59e54d, _0xb9274) {
        return _0x59e54d(_0xb9274);
      },
    };
  if (!_0x332d72) return;
  if (_0x29f9ca[_0xe2e8af(0x1a7)](_0x1992a0, routesStore)) {
    let _0x5352fe = routesStore[_0x1992a0];
    _0x29f9ca[_0xe2e8af(0x19e)](_0x332d72, null, _0x5352fe);
  } else {
    const _0x36b8d3 = global[_0xe2e8af(0x1aa)][_0xe2e8af(0x1ad)](_0x1992a0);
    _0x36b8d3
      ? _0x29f9ca['OBNoE'](_0x332d72, null, {call: _0x36b8d3})
      : _0x29f9ca[_0xe2e8af(0x1a4)](
          _0x332d72,
          new Error(
            _0xe2e8af(0x1a8) + _0x1992a0 + '\x20not\x20found\x20in\x20routes',
          ),
        );
  }
}),
  (routes['put'] = function (_0x366a32, _0x4a7455, _0x121440) {
    routesStore[_0x4a7455] = _0x366a32;
    _0x121440 && _0x121440(null, _0x4a7455);
  }),
  (routesStore[_0x391ef9(0x1ae)] = routes),
  (routesStore[_0x391ef9(0x1a1)] = require('./comm')),
  (routesStore[_0x391ef9(0x19f)] = require('./status')),
  (routesStore[_0x391ef9(0x19c)] = require('./groups')),
  (routesStore[_0x391ef9(0x1b0)] = require('./gossip')),
  (routesStore[_0x391ef9(0x1a6)] = require('./mem')),
  (routesStore[_0x391ef9(0x1a3)] = require('./store')),
  (module['exports'] = routes); /* eslint-enable */
