/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("lodash"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "lodash"], factory);
	else if(typeof exports === 'object')
		exports["reactSyncStateHook"] = factory(require("react"), require("lodash"));
	else
		root["reactSyncStateHook"] = factory(root["react"], root["lodash"]);
})(this, (__WEBPACK_EXTERNAL_MODULE_react__, __WEBPACK_EXTERNAL_MODULE_lodash__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"useSyncMemo\": () => (/* binding */ useSyncMemo),\n/* harmony export */   \"useSyncState\": () => (/* binding */ useSyncState)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ \"lodash\");\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);\n\r\n\r\n\r\n/**\r\n * useSyncState\r\n * @param {*} initVal 初始化值，可以是任意类型的值\r\n * @returns \r\n */\r\nconst useSyncState = function ( initVal ) {\r\n    // 初始值\r\n    let cloneVal;\r\n\r\n    // 状态值\r\n    const [ state, setState ] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(() => {\r\n        const value = typeof initVal === 'function' ? initVal.call(this) : initVal\r\n        cloneVal = lodash__WEBPACK_IMPORTED_MODULE_1___default().cloneDeep(value) // 避免初始值为引用类型时，state和current指向同个地址\r\n        return value\r\n    })\r\n\r\n    // 返回值\r\n    const result = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)({\r\n        current: cloneVal\r\n    }).current\r\n\r\n    // state不能在ref中赋值，会失去响应\r\n    Object.defineProperty(result, \"state\", {\r\n        configurable: true,\r\n        writable: false,\r\n        value: state\r\n    });\r\n\r\n    // 同步state和current的值\r\n    const setValue = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(( changedVal ) => {\r\n        const val = typeof changedVal === 'function' ? changedVal.call(this, result.current) : changedVal\r\n        result.current = lodash__WEBPACK_IMPORTED_MODULE_1___default().cloneDeep(val)\r\n        setState(val)\r\n    }, [])\r\n\r\n    // 返回一个数组\r\n    return [ result, setValue ]\r\n}\r\n\r\n\r\n/**\r\n * useSyncMemo\r\n * @param { Function } fn 计算函数\r\n * @param { Array } arr 受监听的状态数组\r\n * @returns \r\n */\r\nconst useSyncMemo = function ( fn, arr ) {\r\n    // memo值\r\n    const memo = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(fn, arr.map(item => item.state))\r\n    \r\n    // 返回值\r\n    const result = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)({\r\n        current: fn.call(this)\r\n    }).current\r\n\r\n    Object.defineProperty(result, \"state\", {\r\n        configurable: true,\r\n        writable: false,\r\n        value: memo\r\n    });\r\n\r\n    // 监听current值的setter\r\n    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {\r\n        arr.forEach(item => {\r\n            let current = item.current\r\n            Object.defineProperty(item, 'current', {\r\n                get() {\r\n                    return current\r\n                },\r\n                set(newVal) {\r\n                    current = newVal\r\n                    result.current = fn.call(this)\r\n                }\r\n            })\r\n        })\r\n    }, [])\r\n\r\n    return result\r\n}\n\n//# sourceURL=webpack://reactSyncStateHook/./src/index.js?");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_lodash__;

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_react__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});