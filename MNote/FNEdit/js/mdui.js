/*!
 * mdui v0.4.1 (https://mdui.org)
 * Copyright 2016-2018 zdhxiong
 * Licensed under MIT
 */
/* jshint ignore:start */
; (function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.mdui = factory());
}(this, (function () {
    'use strict';

    /* jshint ignore:end */
    var mdui = {};

    /**
     * =============================================================================
     * ************   ����������������޸�   ************
     * =============================================================================
     */

    /**
     * requestAnimationFrame
     * cancelAnimationFrame
     */
    (function () {
        var lastTime = 0;

        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = window.webkitRequestAnimationFrame;
            window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
        }

        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function (callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));

                var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                }, timeToCall);

                lastTime = currTime + timeToCall;
                return id;
            };
        }

        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
        }
    })();


    /**
     * =============================================================================
     * ************   JavaScript ���߿⣬�﷨�� jQuery ����   ************
     * =============================================================================
     */
    /* jshint ignore:start */
    var $ = (function (window, document, undefined) {
        'use strict';
        /* jshint ignore:end */


        var emptyArray = [];
        var slice = emptyArray.slice;
        var concat = emptyArray.concat;
        var isArray = Array.isArray;

        var documentElement = document.documentElement;

        /**
         * �Ƿ��������������
         * @param obj
         * @returns {boolean}
         */
        function isArrayLike(obj) {
            return typeof obj.length === 'number';
        }

        /**
         * ѭ����������
         * @param obj
         * @param callback
         * @returns {*}
         */
        function each(obj, callback) {
            var i;
            var prop;

            if (isArrayLike(obj)) {
                for (i = 0; i < obj.length; i++) {
                    if (callback.call(obj[i], i, obj[i]) === false) {
                        return obj;
                    }
                }
            } else {
                for (prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        if (callback.call(obj[prop], prop, obj[prop]) === false) {
                            return obj;
                        }
                    }
                }
            }

            return obj;
        }

        function map(elems, callback) {
            var value;
            var ret = [];

            each(elems, function (i, elem) {
                value = callback(elem, i);
                if (value !== null && value !== undefined) {
                    ret.push(value);
                }
            });

            return concat.apply([], ret);
        }

        /**
         * �Ѷ���ϲ�����һ�������У������ص�һ������
         * @param first
         * @param second
         * @returns {*}
         */
        function merge(first, second) {
            each(second, function (i, val) {
                first.push(val);
            });

            return first;
        }

        /**
         * ����ȥ�غ������
         * @param arr
         * @returns {Array}
         */
        function unique(arr) {
            var unique = [];
            for (var i = 0; i < arr.length; i++) {
                if (unique.indexOf(arr[i]) === -1) {
                    unique.push(arr[i]);
                }
            }

            return unique;
        }

        /**
         * �Ƿ��� null
         * @param obj
         * @returns {boolean}
         */
        function isNull(obj) {
            return obj === null;
        }

        /**
         * �ж�һ���ڵ���
         * @param ele
         * @param name
         * @returns {boolean}
         */
        function nodeName(ele, name) {
            return ele.nodeName && ele.nodeName.toLowerCase() === name.toLowerCase();
        }

        function isFunction(fn) {
            return typeof fn === 'function';
        }

        function isString(obj) {
            return typeof obj === 'string';
        }

        function isObject(obj) {
            return typeof obj === 'object';
        }

        /**
         * ��ȥ null ��� object ����
         * @param obj
         * @returns {*|boolean}
         */
        function isObjectLike(obj) {
            return isObject(obj) && !isNull(obj);
        }

        function isWindow(win) {
            return win && win === win.window;
        }

        function isDocument(doc) {
            return doc && doc.nodeType === doc.DOCUMENT_NODE;
        }

        var elementDisplay = {};

        /**
         * ��ȡԪ�ص�Ĭ�� display ��ʽֵ������ .show() ����
         * @param nodeName
         * @returns {*}
         */
        function defaultDisplay(nodeName) {
            var element;
            var display;

            if (!elementDisplay[nodeName]) {
                element = document.createElement(nodeName);
                document.body.appendChild(element);
                display = getComputedStyle(element, '').getPropertyValue('display');
                element.parentNode.removeChild(element);
                if (display === 'none') {
                    display = 'block';
                }

                elementDisplay[nodeName] = display;
            }

            return elementDisplay[nodeName];
        }


        var JQ = function (arr) {
            var _this = this;

            for (var i = 0; i < arr.length; i++) {
                _this[i] = arr[i];
            }

            _this.length = arr.length;

            return this;
        };

        /**
         * @param selector {String|Function|Node|Window|NodeList|Array|JQ=}
         * @returns {JQ}
         */
        var $ = function (selector) {
            var arr = [];
            var i = 0;

            if (!selector) {
                return new JQ(arr);
            }

            if (selector instanceof JQ) {
                return selector;
            }

            if (isString(selector)) {
                var els;
                var tempParent;
                selector = selector.trim();

                // ���� HTML �ַ���
                if (selector[0] === '<' && selector[selector.length - 1] === '>') {
                    // HTML
                    var toCreate = 'div';
                    if (selector.indexOf('<li') === 0) {
                        toCreate = 'ul';
                    }

                    if (selector.indexOf('<tr') === 0) {
                        toCreate = 'tbody';
                    }

                    if (selector.indexOf('<td') === 0 || selector.indexOf('<th') === 0) {
                        toCreate = 'tr';
                    }

                    if (selector.indexOf('<tbody') === 0) {
                        toCreate = 'table';
                    }

                    if (selector.indexOf('<option') === 0) {
                        toCreate = 'select';
                    }

                    tempParent = document.createElement(toCreate);
                    tempParent.innerHTML = selector;
                    for (i = 0; i < tempParent.childNodes.length; i++) {
                        arr.push(tempParent.childNodes[i]);
                    }
                }

                // ѡ����
                else {

                    // id ѡ����
                    if (selector[0] === '#' && !selector.match(/[ .<>:~]/)) {
                        els = [document.getElementById(selector.slice(1))];
                    }

                    // ����ѡ����
                    else {
                        els = document.querySelectorAll(selector);
                    }

                    for (i = 0; i < els.length; i++) {
                        if (els[i]) {
                            arr.push(els[i]);
                        }
                    }
                }
            }

            // function
            else if (isFunction(selector)) {
                return $(document).ready(selector);
            }

            // Node
            else if (selector.nodeType || selector === window || selector === document) {
                arr.push(selector);
            }

            // NodeList
            else if (selector.length > 0 && selector[0].nodeType) {
                for (i = 0; i < selector.length; i++) {
                    arr.push(selector[i]);
                }
            }

            return new JQ(arr);
        };

        $.fn = JQ.prototype;

        /**
         * ��չ������ԭ������
         * @param obj
         */
        $.extend = $.fn.extend = function (obj) {
            if (obj === undefined) {
                return this;
            }

            var length = arguments.length;
            var prop;
            var i;
            var options;

            // $.extend(obj)
            if (length === 1) {
                for (prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        this[prop] = obj[prop];
                    }
                }

                return this;
            }

            // $.extend({}, defaults[, obj])
            for (i = 1; i < length; i++) {
                options = arguments[i];
                for (prop in options) {
                    if (options.hasOwnProperty(prop)) {
                        obj[prop] = options[prop];
                    }
                }
            }

            return obj;
        };

        $.extend({

            /**
             * ��������
             * @param obj {String|Array|Object}
             * @param callback {Function}
             * @returns {Array|Object}
             */
            each: each,

            /**
             * �ϲ��������飬���صĽ�����޸ĵ�һ�����������
             * @param first {Array}
             * @param second {Array}
             * @returns {Array}
             */
            merge: merge,

            /**
             * ɾ���������ظ�Ԫ��
             * @param arr {Array}
             * @returns {Array}
             */
            unique: unique,

            /**
             * ͨ�����������еĽڵ����ͨ����������һ���µ����飬null �� undefined �������˵���
             * @param elems
             * @param callback
             * @returns {Array}
             */
            map: map,

            /**
             * һ�� DOM �ڵ��Ƿ������һ�� DOM �ڵ�
             * @param parent {Node} ���ڵ�
             * @param node {Node} �ӽڵ�
             * @returns {Boolean}
             */
            contains: function (parent, node) {
                if (parent && !node) {
                    return documentElement.contains(parent);
                }

                return parent !== node && parent.contains(node);
            },

            /**
             * �������������л�
             * @param obj
             * @returns {String}
             */
            param: function (obj) {
                if (!isObjectLike(obj)) {
                    return '';
                }

                var args = [];
                each(obj, function (key, value) {
                    destructure(key, value);
                });

                return args.join('&');

                function destructure(key, value) {
                    var keyTmp;

                    if (isObjectLike(value)) {
                        each(value, function (i, v) {
                            if (isArray(value) && !isObjectLike(v)) {
                                keyTmp = '';
                            } else {
                                keyTmp = i;
                            }

                            destructure(key + '[' + keyTmp + ']', v);
                        });
                    } else {
                        if (!isNull(value) && value !== '') {
                            keyTmp = '=' + encodeURIComponent(value);
                        } else {
                            keyTmp = '';
                        }

                        args.push(encodeURIComponent(key) + keyTmp);
                    }
                }
            },
        });

        $.fn.extend({

            /**
             * ��������
             * @param callback {Function}
             * @return {JQ}
             */
            each: function (callback) {
                return each(this, callback);
            },

            /**
             * ͨ�����������еĽڵ����ͨ����������һ���µĶ���null �� undefined �������˵���
             * @param callback {Function}
             * @returns {JQ}
             */
            map: function (callback) {
                return new JQ(map(this, function (el, i) {
                    return callback.call(el, i, el);
                }));
            },

            /**
             * ��ȡָ�� DOM Ԫ�أ�û�� index ����ʱ����ȡ���� DOM ������
             * @param index {Number=}
             * @returns {Node|Array}
             */
            get: function (index) {
                return index === undefined ?
                    slice.call(this) :
                    this[index >= 0 ? index : index + this.length];
            },

            /**
             * array����ȡ�ķ�������start��ʼ�����end ָ������ȡ������endλ�õ�Ԫ�ء�
             * @param argument {start, end}
             * @returns {JQ}
             */
            slice: function (argument) {
                return new JQ(slice.apply(this, arguments));
            },

            /**
             * ɸѡԪ�ؼ���
             * @param selector {String|JQ|Node|Function}
             * @returns {JQ}
             */
            filter: function (selector) {
                if (isFunction(selector)) {
                    return this.map(function (index, ele) {
                        return selector.call(ele, index, ele) ? ele : undefined;
                    });
                } else {
                    var $selector = $(selector);
                    return this.map(function (index, ele) {
                        return $selector.index(ele) > -1 ? ele : undefined;
                    });
                }
            },

            /**
             * ��Ԫ�ؼ�����ɾ��ָ����Ԫ��
             * @param selector {String|Node|JQ|Function}
             * @return {JQ}
             */
            not: function (selector) {
                var $excludes = this.filter(selector);
                return this.map(function (index, ele) {
                    return $excludes.index(ele) > -1 ? undefined : ele;
                });
            },

            /**
             * ��ȡԪ������� document ��ƫ��
             * @returns {Object}
             */
            offset: function () {
                if (this[0]) {
                    var offset = this[0].getBoundingClientRect();
                    return {
                        left: offset.left + window.pageXOffset,
                        top: offset.top + window.pageYOffset,
                        width: offset.width,
                        height: offset.height,
                    };
                }

                return null;
            },

            /**
             * ������������ڶ�λ�ĸ�Ԫ��
             * @returns {*|JQ}
             */
            offsetParent: function () {
                return this.map(function () {
                    var offsetParent = this.offsetParent;

                    while (offsetParent && $(offsetParent).css('position') === 'static') {
                        offsetParent = offsetParent.offsetParent;
                    }

                    return offsetParent || documentElement;
                });
            },

            /**
             * ��ȡԪ������ڸ�Ԫ�ص�ƫ��
             * @return {Object}
             */
            position: function () {
                var _this = this;

                if (!_this[0]) {
                    return null;
                }

                var offsetParent;
                var offset;
                var parentOffset = {
                    top: 0,
                    left: 0,
                };

                if (_this.css('position') === 'fixed') {
                    offset = _this[0].getBoundingClientRect();
                } else {
                    offsetParent = _this.offsetParent();
                    offset = _this.offset();
                    if (!nodeName(offsetParent[0], 'html')) {
                        parentOffset = offsetParent.offset();
                    }

                    parentOffset = {
                        top: parentOffset.top + offsetParent.css('borderTopWidth'),
                        left: parentOffset.left + offsetParent.css('borderLeftWidth'),
                    };
                }

                return {
                    top: offset.top - parentOffset.top - _this.css('marginTop'),
                    left: offset.left - parentOffset.left - _this.css('marginLeft'),
                    width: offset.width,
                    height: offset.height,
                };
            },

            /**
             * ��ʾָ��Ԫ��
             * @returns {JQ}
             */
            show: function () {
                return this.each(function () {
                    if (this.style.display === 'none') {
                        this.style.display = '';
                    }

                    if (window.getComputedStyle(this, '').getPropertyValue('display') === 'none') {
                        this.style.display = defaultDisplay(this.nodeName);
                    }
                });
            },

            /**
             * ����ָ��Ԫ��
             * @returns {JQ}
             */
            hide: function () {
                return this.each(function () {
                    this.style.display = 'none';
                });
            },

            /**
             * �л�Ԫ�ص���ʾ״̬
             * @returns {JQ}
             */
            toggle: function () {
                return this.each(function () {
                    this.style.display = this.style.display === 'none' ? '' : 'none';
                });
            },

            /**
             * �Ƿ���ָ���� CSS ��
             * @param className {String}
             * @returns {boolean}
             */
            hasClass: function (className) {
                if (!this[0] || !className) {
                    return false;
                }

                return this[0].classList.contains(className);
            },

            /**
             * �Ƴ�ָ������
             * @param attr {String}
             * @returns {JQ}
             */
            removeAttr: function (attr) {
                return this.each(function () {
                    this.removeAttribute(attr);
                });
            },

            /**
             * ɾ������ֵ
             * @param name {String}
             * @returns {JQ}
             */
            removeProp: function (name) {
                return this.each(function () {
                    try {
                        delete this[name];
                    } catch (e) { }
                });
            },

            /**
             * ��ȡ��ǰ�����е�n��Ԫ��
             * @param index {Number}
             * @returns {JQ}
             */
            eq: function (index) {
                var ret = index === -1 ? this.slice(index) : this.slice(index, +index + 1);
                return new JQ(ret);
            },

            /**
             * ��ȡ�����е�һ��Ԫ��
             * @returns {JQ}
             */
            first: function () {
                return this.eq(0);
            },

            /**
             * ��ȡ���������һ��Ԫ��
             * @returns {JQ}
             */
            last: function () {
                return this.eq(-1);
            },

            /**
             * ��ȡһ��Ԫ�ص�λ�á�
             * �� ele ����û�и���ʱ�����ص�ǰԪ�����ֵܽڵ��е�λ�á�
             * �и����� ele ����ʱ������ ele Ԫ���ڵ�ǰ�����е�λ��
             * @param ele {Selector|Node=}
             * @returns {Number}
             */
            index: function (ele) {
                if (!ele) {
                    // ��ȡ��ǰ JQ ����ĵ�һ��Ԫ����ͬ��Ԫ���е�λ��
                    return this.eq(0).parent().children().get().indexOf(this[0]);
                } else if (isString(ele)) {
                    // ���ص�ǰ JQ ����ĵ�һ��Ԫ����ָ��ѡ������Ӧ��Ԫ���е�λ��
                    return $(ele).eq(0).parent().children().get().indexOf(this[0]);
                } else {
                    // ����ָ��Ԫ���ڵ�ǰ JQ �����е�λ��
                    return this.get().indexOf(ele);
                }
            },

            /**
             * ����ѡ������DOMԪ�ػ� JQ ���������ƥ��Ԫ�ؼ��ϣ�
             * �������������һ��Ԫ�ط�����������ı��ʽ�ͷ���true
             * @param selector {String|Node|NodeList|Array|JQ|Window}
             * @returns boolean
             */
            is: function (selector) {
                var _this = this[0];

                if (!_this || selector === undefined || selector === null) {
                    return false;
                }

                var $compareWith;
                var i;
                if (isString(selector)) {
                    if (_this === document || _this === window) {
                        return false;
                    }

                    var matchesSelector =
                        _this.matches ||
                        _this.matchesSelector ||
                        _this.webkitMatchesSelector ||
                        _this.mozMatchesSelector ||
                        _this.oMatchesSelector ||
                        _this.msMatchesSelector;

                    return matchesSelector.call(_this, selector);
                } else if (selector === document || selector === window) {
                    return _this === selector;
                } else {
                    if (selector.nodeType || isArrayLike(selector)) {
                        $compareWith = selector.nodeType ? [selector] : selector;
                        for (i = 0; i < $compareWith.length; i++) {
                            if ($compareWith[i] === _this) {
                                return true;
                            }
                        }

                        return false;
                    }

                    return false;
                }
            },

            /**
             * ���� CSS ѡ�����ҵ�����ڵ�ļ���
             * @param selector {String}
             * @returns {JQ}
             */
            find: function (selector) {
                var foundElements = [];

                this.each(function (i, _this) {
                    merge(foundElements, _this.querySelectorAll(selector));
                });

                return new JQ(foundElements);
            },

            /**
             * �ҵ�ֱ����Ԫ�ص�Ԫ�ؼ���
             * @param selector {String=}
             * @returns {JQ}
             */
            children: function (selector) {
                var children = [];
                this.each(function (i, _this) {
                    each(_this.childNodes, function (i, childNode) {
                        if (childNode.nodeType !== 1) {
                            return true;
                        }

                        if (!selector || (selector && $(childNode).is(selector))) {
                            children.push(childNode);
                        }
                    });
                });

                return new JQ(unique(children));
            },

            /**
             * ��������ָ����Ԫ�ص�Ԫ�أ�ȥ��������ָ����Ԫ�ص�Ԫ��
             * @param selector {String|Node|JQ|NodeList|Array}
             * @return {JQ}
             */
            has: function (selector) {
                var $targets = isString(selector) ? this.find(selector) : $(selector);
                var len = $targets.length;
                return this.filter(function () {
                    for (var i = 0; i < len; i++) {
                        if ($.contains(this, $targets[i])) {
                            return true;
                        }
                    }
                });
            },

            /**
             * ȡ��ͬ��Ԫ�صļ���
             * @param selector {String=}
             * @returns {JQ}
             */
            siblings: function (selector) {
                return this.prevAll(selector).add(this.nextAll(selector));
            },

            /**
             * ��������ƥ�䵽�ĸ��ڵ㣬�������ڵ�
             * @param selector {String}
             * @returns {JQ}
             */
            closest: function (selector) {
                var _this = this;

                if (!_this.is(selector)) {
                    _this = _this.parents(selector).eq(0);
                }

                return _this;
            },

            /**
             * ɾ������ƥ���Ԫ��
             * @returns {JQ}
             */
            remove: function () {
                return this.each(function (i, _this) {
                    if (_this.parentNode) {
                        _this.parentNode.removeChild(_this);
                    }
                });
            },

            /**
             * ���ƥ���Ԫ�ص���ǰ������
             * @param selector {String|JQ}
             * @returns {JQ}
             */
            add: function (selector) {
                return new JQ(unique(merge(this.get(), $(selector))));
            },

            /**
             * ɾ���ӽڵ�
             * @returns {JQ}
             */
            empty: function () {
                return this.each(function () {
                    this.innerHTML = '';
                });
            },

            /**
             * ͨ����ȿ�¡�����Ƽ����е�����Ԫ�ء�
             * (ͨ��ԭ�� cloneNode ������ȿ�¡�����Ƽ����е�����Ԫ�ء��˷������������ݺ��¼���������Ƶ��µ�Ԫ�ء�����jquery������һ��������ȷ���Ƿ������ݺ��¼�������ͬ��)
             * @returns {JQ}
             */
            clone: function () {
                return this.map(function () {
                    return this.cloneNode(true);
                });
            },

            /**
             * ����Ԫ���滻��ǰԪ��
             * @param newContent {String|Node|NodeList|JQ}
             * @returns {JQ}
             */
            replaceWith: function (newContent) {
                return this.before(newContent).remove();
            },

            /**
             * ����Ԫ�ص�ֵ��ϳɼ�ֵ������
             * @returns {Array}
             */
            serializeArray: function () {
                var result = [];
                var $ele;
                var type;
                var ele = this[0];

                if (!ele || !ele.elements) {
                    return result;
                }

                $(slice.call(ele.elements)).each(function () {
                    $ele = $(this);
                    type = $ele.attr('type');
                    if (
                        this.nodeName.toLowerCase() !== 'fieldset' &&
                        !this.disabled &&
                        ['submit', 'reset', 'button'].indexOf(type) === -1 &&
                        (['radio', 'checkbox'].indexOf(type) === -1 || this.checked)
                    ) {
                        result.push({
                            name: $ele.attr('name'),
                            value: $ele.val(),
                        });
                    }
                });

                return result;
            },

            /**
             * ����Ԫ�ػ�������л�
             * @returns {String}
             */
            serialize: function () {
                var result = [];
                each(this.serializeArray(), function (i, elm) {
                    result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value));
                });

                return result.join('&');
            },
        });

        /**
         * val - ��ȡ������Ԫ�ص�ֵ
         * @param value {String=}
         * @return {*|JQ}
         */
        /**
         * html - ��ȡ������Ԫ�ص� HTML
         * @param value {String=}
         * @return {*|JQ}
         */
        /**
         * text - ��ȡ������Ԫ�ص�����
         * @param value {String=}
         * @return {*|JQ}
         */
        each(['val', 'html', 'text'], function (nameIndex, name) {
            var props = {
                0: 'value',
                1: 'innerHTML',
                2: 'textContent',
            };

            var defaults = {
                0: undefined,
                1: undefined,
                2: null,
            };

            $.fn[name] = function (value) {
                if (value === undefined) {
                    // ��ȡֵ
                    return this[0] ? this[0][props[nameIndex]] : defaults[nameIndex];
                } else {
                    // ����ֵ
                    return this.each(function (i, ele) {
                        ele[props[nameIndex]] = value;
                    });
                }
            };
        });

        /**
         * attr - ��ȡ������Ԫ�ص�����ֵ
         * @param {name|props|key,value=}
         * @return {String|JQ}
         */
        /**
         * prop - ��ȡ������Ԫ�ص�����ֵ
         * @param {name|props|key,value=}
         * @return {String|JQ}
         */
        /**
         * css - ��ȡ������Ԫ�ص���ʽ
         * @param {name|props|key,value=}
         * @return {String|JQ}
         */
        each(['attr', 'prop', 'css'], function (nameIndex, name) {
            var set = function (ele, key, value) {
                if (nameIndex === 0) {
                    ele.setAttribute(key, value);
                } else if (nameIndex === 1) {
                    ele[key] = value;
                } else {
                    ele.style[key] = value;
                }
            };

            var get = function (ele, key) {
                if (!ele) {
                    return undefined;
                }

                var value;
                if (nameIndex === 0) {
                    value = ele.getAttribute(key);
                } else if (nameIndex === 1) {
                    value = ele[key];
                } else {
                    value = window.getComputedStyle(ele, null).getPropertyValue(key);
                }

                return value;
            };

            $.fn[name] = function (key, value) {
                var argLength = arguments.length;

                if (argLength === 1 && isString(key)) {
                    // ��ȡֵ
                    return get(this[0], key);
                } else {
                    // ����ֵ
                    return this.each(function (i, ele) {
                        if (argLength === 2) {
                            set(ele, key, value);
                        } else {
                            each(key, function (k, v) {
                                set(ele, k, v);
                            });
                        }
                    });
                }
            };
        });

        /**
         * addClass - ��� CSS �࣬��������ÿո�ָ�
         * @param className {String}
         * @return {JQ}
         */
        /**
         * removeClass - �Ƴ� CSS �࣬��������ÿո�ָ�
         * @param className {String}
         * @return {JQ}
         */
        /**
         * toggleClass - �л� CSS ��������������ÿո�ָ�
         * @param className {String}
         * @return {JQ}
         */
        each(['add', 'remove', 'toggle'], function (nameIndex, name) {
            $.fn[name + 'Class'] = function (className) {
                if (!className) {
                    return this;
                }

                var classes = className.split(' ');
                return this.each(function (i, ele) {
                    each(classes, function (j, cls) {
                        ele.classList[name](cls);
                    });
                });
            };
        });

        /**
         * width - ��ȡԪ�صĿ��
         * @return {Number}
         */
        /**
         * height - ��ȡԪ�صĸ߶�
         * @return {Number}
         */
        each({
            Width: 'width',
            Height: 'height',
        }, function (prop, name) {
            $.fn[name] = function (val) {
                if (val === undefined) {
                    // ��ȡ
                    var ele = this[0];

                    if (isWindow(ele)) {
                        return ele['inner' + prop];
                    }

                    if (isDocument(ele)) {
                        return ele.documentElement['scroll' + prop];
                    }

                    var $ele = $(ele);

                    // IE10��IE11 �� box-sizing:border-box ʱ��������� padding �� border����������޸�
                    var IEFixValue = 0;
                    var isWidth = name === 'width';
                    if ('ActiveXObject' in window) { // �ж��� IE �����
                        if ($ele.css('box-sizing') === 'border-box') {
                            IEFixValue =
                                parseFloat($ele.css('padding-' + (isWidth ? 'left' : 'top'))) +
                                parseFloat($ele.css('padding-' + (isWidth ? 'right' : 'bottom'))) +
                                parseFloat($ele.css('border-' + (isWidth ? 'left' : 'top') + '-width')) +
                                parseFloat($ele.css('border-' + (isWidth ? 'right' : 'bottom') + '-width'));
                        }
                    }

                    return parseFloat($(ele).css(name)) + IEFixValue;
                } else {
                    // ����
                    if (!isNaN(Number(val)) && val !== '') {
                        val += 'px';
                    }

                    return this.css(name, val);
                }
            };
        });

        /**
         * innerWidth - ��ȡԪ�صĿ�ȣ������ڱ߾�
         * @return {Number}
         */
        /**
         * innerHeight - ��ȡԪ�صĸ߶ȣ������ڱ߾�
         * @return {Number}
         */
        each({
            Width: 'width',
            Height: 'height',
        }, function (prop, name) {
            $.fn['inner' + prop] = function () {
                var value = this[name]();
                var $ele = $(this[0]);

                if ($ele.css('box-sizing') !== 'border-box') {
                    value += parseFloat($ele.css('padding-' + (name === 'width' ? 'left' : 'top')));
                    value += parseFloat($ele.css('padding-' + (name === 'width' ? 'right' : 'bottom')));
                }

                return value;
            };
        });

        var dir = function (nodes, selector, nameIndex, node) {
            var ret = [];
            var ele;
            nodes.each(function (j, _this) {
                ele = _this[node];
                while (ele) {
                    if (nameIndex === 2) {
                        // prevUntil
                        if (!selector || (selector && $(ele).is(selector))) {
                            break;
                        }

                        ret.push(ele);
                    } else if (nameIndex === 0) {
                        // prev
                        if (!selector || (selector && $(ele).is(selector))) {
                            ret.push(ele);
                        }

                        break;
                    } else {
                        // prevAll
                        if (!selector || (selector && $(ele).is(selector))) {
                            ret.push(ele);
                        }
                    }

                    ele = ele[node];
                }
            });

            return new JQ(unique(ret));
        };

        /**
         * prev - ȡ��ǰһ��ƥ���Ԫ��
         * @param selector {String=}
         * @return {JQ}
         */
        /**
         * prevAll - ȡ��ǰ������ƥ���Ԫ��
         * @param selector {String=}
         * @return {JQ}
         */
        /**
         * prevUntil - ȡ��ǰ�������Ԫ�أ�ֱ������ƥ���Ԫ�أ�������ƥ���Ԫ��
         * @param selector {String=}
         * @return {JQ}
         */
        each(['', 'All', 'Until'], function (nameIndex, name) {
            $.fn['prev' + name] = function (selector) {

                // prevAll��prevUntil ��Ҫ��Ԫ�ص�˳�������Ա�� jQuery �Ľ��һ��
                var $nodes = nameIndex === 0 ? this : $(this.get().reverse());
                return dir($nodes, selector, nameIndex, 'previousElementSibling');
            };
        });

        /**
         * next - ȡ�ú�һ��ƥ���Ԫ��
         * @param selector {String=}
         * @return {JQ}
         */
        /**
         * nextAll - ȡ�ú�������ƥ���Ԫ��
         * @param selector {String=}
         * @return {JQ}
         */
        /**
         * nextUntil - ȡ�ú�������ƥ���Ԫ�أ�ֱ������ƥ���Ԫ�أ�������ƥ���Ԫ��
         * @param selector {String=}
         * @return {JQ}
         */
        each(['', 'All', 'Until'], function (nameIndex, name) {
            $.fn['next' + name] = function (selector) {
                return dir(this, selector, nameIndex, 'nextElementSibling');
            };
        });

        /**
         * parent - ȡ��ƥ���ֱ�Ӹ�Ԫ��
         * @param selector {String=}
         * @return {JQ}
         */
        /**
         * parents - ȡ������ƥ��ĸ�Ԫ��
         * @param selector {String=}
         * @return {JQ}
         */
        /**
         * parentUntil - ȡ�����еĸ�Ԫ�أ�ֱ������ƥ���Ԫ�أ�������ƥ���Ԫ��
         * @param selector {String=}
         * @return {JQ}
         */
        each(['', 's', 'sUntil'], function (nameIndex, name) {
            $.fn['parent' + name] = function (selector) {

                // parents��parentsUntil ��Ҫ��Ԫ�ص�˳�������Ա�� jQuery �Ľ��һ��
                var $nodes = nameIndex === 0 ? this : $(this.get().reverse());
                return dir($nodes, selector, nameIndex, 'parentNode');
            };
        });

        /**
         * append - ��Ԫ���ڲ�׷������
         * @param newChild {String|Node|NodeList|JQ}
         * @return {JQ}
         */
        /**
         * prepend - ��Ԫ���ڲ�ǰ������
         * @param newChild {String|Node|NodeList|JQ}
         * @return {JQ}
         */
        each(['append', 'prepend'], function (nameIndex, name) {
            $.fn[name] = function (newChild) {
                var newChilds;
                var copyByClone = this.length > 1;

                if (isString(newChild)) {
                    var tempDiv = document.createElement('div');
                    tempDiv.innerHTML = newChild;
                    newChilds = slice.call(tempDiv.childNodes);
                } else {
                    newChilds = $(newChild).get();
                }

                if (nameIndex === 1) {
                    // prepend
                    newChilds.reverse();
                }

                return this.each(function (i, _this) {
                    each(newChilds, function (j, child) {
                        // һ��Ԫ��Ҫͬʱ׷�ӵ����Ԫ���У���Ҫ�ȸ���һ�ݣ�Ȼ��׷��
                        if (copyByClone && i > 0) {
                            child = child.cloneNode(true);
                        }

                        if (nameIndex === 0) {
                            // append
                            _this.appendChild(child);
                        } else {
                            // prepend
                            _this.insertBefore(child, _this.childNodes[0]);
                        }
                    });
                });
            };
        });

        /**
         * insertBefore - ���뵽ָ��Ԫ�ص�ǰ��
         * @param selector {String|Node|NodeList|JQ}
         * @return {JQ}
         */
        /**
         * insertAfter - ���뵽ָ��Ԫ�صĺ���
         * @param selector {String|Node|NodeList|JQ}
         * @return {JQ}
         */
        each(['insertBefore', 'insertAfter'], function (nameIndex, name) {
            $.fn[name] = function (selector) {
                var $ele = $(selector);
                return this.each(function (i, _this) {
                    $ele.each(function (j, ele) {
                        ele.parentNode.insertBefore(
                            $ele.length === 1 ? _this : _this.cloneNode(true),
                            nameIndex === 0 ? ele : ele.nextSibling
                        );
                    });
                });
            };
        });

        /**
         * appendTo - ׷�ӵ�ָ��Ԫ������
         * @param selector {String|Node|NodeList|JQ}
         * @return {JQ}
         */
        /**
         * prependTo - ǰ�õ�ָ��Ԫ���ڲ�
         * @param selector {String|Node|NodeList|JQ}
         * @return {JQ}
         */
        /**
         * before - ���뵽ָ��Ԫ��ǰ��
         * @param selector {String|Node|NodeList|JQ}
         * @return {JQ}
         */
        /**
         * after - ���뵽ָ��Ԫ�غ���
         * @param selector {String|Node|NodeList|JQ}
         * @return {JQ}
         */
        /**
         * replaceAll - �滻��ָ��Ԫ��
         * @param selector {String|Node|NodeList|JQ}
         * @return {JQ}
         */
        each({
            appendTo: 'append',
            prependTo: 'prepend',
            before: 'insertBefore',
            after: 'insertAfter',
            replaceAll: 'replaceWith',
        }, function (name, original) {
            $.fn[name] = function (selector) {
                $(selector)[original](this);
                return this;
            };
        });



        (function () {
            var dataNS = 'mduiElementDataStorage';

            $.extend({
                /**
                 * ��ָ��Ԫ���ϴ洢���ݣ����ָ��Ԫ���϶�ȡ����
                 * @param ele ���룬 DOM Ԫ��
                 * @param key ���룬����
                 * @param value ��ѡ��ֵ
                 */
                data: function (ele, key, value) {
                    var data = {};

                    if (value !== undefined) {
                        // ���� key��value ����ֵ
                        data[key] = value;
                    } else if (isObjectLike(key)) {
                        // ���ݼ�ֵ������ֵ
                        data = key;
                    } else if (key === undefined) {
                        // ��ȡ����ֵ
                        var result = {};
                        each(ele.attributes, function (i, attribute) {
                            var name = attribute.name;
                            if (name.indexOf('data-') === 0) {
                                var prop = name.slice(5).replace(/-./g, function (u) {
                                    // ���תΪ�շ巨
                                    return u.charAt(1).toUpperCase();
                                });

                                result[prop] = attribute.value;
                            }
                        });

                        if (ele[dataNS]) {
                            each(ele[dataNS], function (k, v) {
                                result[k] = v;
                            });
                        }

                        return result;
                    } else {
                        // ��ȡָ��ֵ
                        if (ele[dataNS] && (key in ele[dataNS])) {
                            return ele[dataNS][key];
                        } else {
                            var dataKey = ele.getAttribute('data-' + key);
                            if (dataKey) {
                                return dataKey;
                            } else {
                                return undefined;
                            }
                        }
                    }

                    // ����ֵ
                    if (!ele[dataNS]) {
                        ele[dataNS] = {};
                    }

                    each(data, function (k, v) {
                        ele[dataNS][k] = v;
                    });
                },

                /**
                 * �Ƴ�ָ��Ԫ���ϴ�ŵ�����
                 * @param ele ���룬DOM Ԫ��
                 * @param key ���룬����
                 */
                removeData: function (ele, key) {
                    if (ele[dataNS] && ele[dataNS][key]) {
                        ele[dataNS][key] = null;
                        delete ele.mduiElementDataStorage[key];
                    }
                },

            });

            $.fn.extend({

                /**
                 * ��Ԫ���϶�ȡ����������
                 * @param key ����
                 * @param value
                 * @returns {*}
                 */
                data: function (key, value) {
                    if (value === undefined) {
                        if (isObjectLike(key)) {

                            // ͬʱ���ö��ֵ
                            return this.each(function (i, ele) {
                                $.data(ele, key);
                            });
                        } else if (this[0]) {

                            // ��ȡֵ
                            return $.data(this[0], key);
                        } else {
                            return undefined;
                        }
                    } else {
                        // ����ֵ
                        return this.each(function (i, ele) {
                            $.data(ele, key, value);
                        });
                    }
                },

                /**
                 * �Ƴ�Ԫ���ϴ洢������
                 * @param key ����
                 * @returns {*}
                 */
                removeData: function (key) {
                    return this.each(function (i, ele) {
                        $.removeData(ele, key);
                    });
                },

            });
        })();


        (function () {
            // �洢�¼�
            var handlers = {
                // i: { // Ԫ��ID
                //   j: { // �¼�ID
                //     e: �¼���
                //     fn: �¼�������
                //     i: �¼�ID
                //     proxy:
                //     sel: ѡ����
                //   }
                // }
            };

            // Ԫ��ID
            var _elementId = 1;

            var fnFalse = function () {
                return false;
            };

            $.fn.extend({
                /**
                 * DOM ������Ϻ���õĺ���
                 * @param callback
                 * @returns {ready}
                 */
                ready: function (callback) {
                    if (/complete|loaded|interactive/.test(document.readyState) && document.body) {
                        callback($);
                    } else {
                        document.addEventListener('DOMContentLoaded', function () {
                            callback($);
                        }, false);
                    }

                    return this;
                },

                /**
                 * ���¼�
                 *
                 * $().on({eventName: fn}, selector, data);
                 * $().on({eventName: fn}, selector)
                 * $().on({eventName: fn})
                 * $().on(eventName, selector, data, fn);
                 * $().on(eventName, selector, fn);
                 * $().on(eventName, data, fn);
                 * $().on(eventName, fn);
                 * $().on(eventName, false);
                 *
                 * @param eventName
                 * @param selector
                 * @param data
                 * @param callback
                 * @param one �Ƿ��� one ������ֻ�� JQ �ڲ�ʹ��
                 * @returns
                 */
                on: function (eventName, selector, data, callback, one) {
                    var _this = this;

                    // Ĭ��
                    // $().on(event, selector, data, callback)

                    // event ʹ�� �¼�:���� ��ֵ��
                    // event = {
                    //   'event1': callback1,
                    //   'event2': callback2
                    // }
                    //
                    // $().on(event, selector, data)
                    if (eventName && !isString(eventName)) {
                        each(eventName, function (type, fn) {
                            _this.on(type, selector, data, fn);
                        });

                        return _this;
                    }

                    // selector ������
                    // $().on(event, data, callback)
                    if (!isString(selector) && !isFunction(callback) && callback !== false) {
                        callback = data;
                        data = selector;
                        selector = undefined;
                    }

                    // data ������
                    // $().on(event, callback)
                    if (isFunction(data) || data === false) {
                        callback = data;
                        data = undefined;
                    }

                    // callback Ϊ false
                    // $().on(event, false)
                    if (callback === false) {
                        callback = fnFalse;
                    }

                    if (one === 1) {
                        var origCallback = callback;
                        callback = function () {
                            _this.off(eventName, selector, callback);
                            return origCallback.apply(this, arguments);
                        };
                    }

                    return this.each(function () {
                        add(this, eventName, callback, data, selector);
                    });
                },

                /**
                 * ���¼���ֻ����һ��
                 * @param eventName
                 * @param selector
                 * @param data
                 * @param callback
                 */
                one: function (eventName, selector, data, callback) {
                    var _this = this;

                    if (!isString(eventName)) {
                        each(eventName, function (type, fn) {
                            type.split(' ').forEach(function (eName) {
                                _this.on(eName, selector, data, fn, 1);
                            });
                        });
                    } else {
                        eventName.split(' ').forEach(function (eName) {
                            _this.on(eName, selector, data, callback, 1);
                        });
                    }

                    return this;
                },

                /**
                 * ȡ�����¼�
                 *
                 * $().off(eventName, selector);
                 * $().off(eventName, callback);
                 * $().off(eventName, false);
                 *
                 */
                off: function (eventName, selector, callback) {
                    var _this = this;

                    // event ʹ�� �¼�:���� ��ֵ��
                    // event = {
                    //   'event1': callback1,
                    //   'event2': callback2
                    // }
                    //
                    // $().off(event, selector)
                    if (eventName && !isString(eventName)) {
                        each(eventName, function (type, fn) {
                            _this.off(type, selector, fn);
                        });

                        return _this;
                    }

                    // selector ������
                    // $().off(event, callback)
                    if (!isString(selector) && !isFunction(callback) && callback !== false) {
                        callback = selector;
                        selector = undefined;
                    }

                    // callback Ϊ false
                    // $().off(event, false)
                    if (callback === false) {
                        callback = fnFalse;
                    }

                    return _this.each(function () {
                        remove(this, eventName, callback, selector);
                    });
                },

                /**
                 * ����һ���¼�
                 * @param eventName
                 * @param data
                 * @returns {*|JQ}
                 */
                trigger: function (eventName, data) {
                    if (!isString(eventName)) {
                        return;
                    }

                    var isMouseEvent = ['click', 'mousedown', 'mouseup', 'mousemove'].indexOf(eventName) > -1;

                    var evt;

                    if (isMouseEvent) {
                        // Note: MouseEvent �޷����� detail ����
                        try {
                            evt = new MouseEvent(eventName, {
                                bubbles: true,
                                cancelable: true,
                            });
                        } catch (e) {
                            evt = document.createEvent('MouseEvent');
                            evt.initMouseEvent(eventName, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                        }
                    } else {
                        try {
                            evt = new CustomEvent(eventName, {
                                detail: data,
                                bubbles: true,
                                cancelable: true,
                            });
                        } catch (e) {
                            evt = document.createEvent('CustomEvent');
                            evt.initCustomEvent(eventName, true, true, data);
                        }
                    }

                    evt._detail = data;

                    return this.each(function () {
                        this.dispatchEvent(evt);
                    });
                },
            });

            /**
             * ����¼�����
             * @param element
             * @param eventName
             * @param func
             * @param data
             * @param selector
             */
            function add(element, eventName, func, data, selector) {
                var elementId = getElementId(element);
                if (!handlers[elementId]) {
                    handlers[elementId] = [];
                }

                // ���� data.useCapture ������ useCapture: true
                var useCapture = false;
                if (isObjectLike(data) && data.useCapture) {
                    useCapture = true;
                }

                eventName.split(' ').forEach(function (event) {

                    var handler = {
                        e: event,
                        fn: func,
                        sel: selector,
                        i: handlers[elementId].length,
                    };

                    var callFn = function (e, ele) {
                        // ��Ϊ����¼�ģ���¼��� detail ������ֻ���ģ������ e._detail �д洢����
                        var result = func.apply(ele, e._detail === undefined ? [e] : [e].concat(e._detail));

                        if (result === false) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    };

                    var proxyfn = handler.proxy = function (e) {
                        e._data = data;

                        // �¼�����
                        if (selector) {
                            $(element).find(selector).get().reverse().forEach(function (ele) {
                                if (ele === e.target || $.contains(ele, e.target)) {
                                    callFn(e, ele);
                                }
                            });
                        }

                        // ��ʹ���¼�����
                        else {
                            callFn(e, element);
                        }
                    };

                    handlers[elementId].push(handler);
                    element.addEventListener(handler.e, proxyfn, useCapture);
                });
            }

            /**
             * �Ƴ��¼�����
             * @param element
             * @param eventName
             * @param func
             * @param selector
             */
            function remove(element, eventName, func, selector) {
                (eventName || '').split(' ').forEach(function (event) {
                    getHandlers(element, event, func, selector).forEach(function (handler) {
                        delete handlers[getElementId(element)][handler.i];
                        element.removeEventListener(handler.e, handler.proxy, false);
                    });
                });
            }

            /**
             * ΪԪ�ظ���һ��Ψһ��ID
             * @param element
             * @returns {number|*}
             */
            function getElementId(element) {
                return element._elementId || (element._elementId = _elementId++);
            }

            /**
             * ��ȡƥ����¼�
             * @param element
             * @param eventName
             * @param func
             * @param selector
             * @returns {Array.<T>}
             */
            function getHandlers(element, eventName, func, selector) {
                return (handlers[getElementId(element)] || []).filter(function (handler) {

                    return handler &&
                        (!eventName || handler.e === eventName) &&
                        (!func || handler.fn.toString() === func.toString()) &&
                        (!selector || handler.sel === selector);
                });
            }

        })();


        (function () {
            var globalOptions = {};
            var jsonpID = 0;

            // ȫ���¼���
            var ajaxEvent = {
                ajaxStart: 'start.mdui.ajax',
                ajaxSuccess: 'success.mdui.ajax',
                ajaxError: 'error.mdui.ajax',
                ajaxComplete: 'complete.mdui.ajax',
            };

            /**
             * �жϴ����󷽷��Ƿ�ͨ����ѯ�ַ����ύ����
             * @param method ���󷽷�����д
             * @returns {boolean}
             */
            var isQueryStringData = function (method) {
                return ['GET', 'HEAD'].indexOf(method) >= 0;
            };

            /**
             * ��Ӳ����� URL �ϣ��� URL �в����� ? ʱ���Զ��ѵ�һ�� & �滻Ϊ ?
             * @param url
             * @param query ���� key=value
             * @returns {string}
             */
            var appendQuery = function (url, query) {
                return (url + '&' + query).replace(/[&?]{1,2}/, '?');
            };

            $.extend({

                /**
                 * Ϊ ajax ��������ȫ�����ò���
                 * @param options
                 */
                ajaxSetup: function (options) {
                    $.extend(globalOptions, options || {});
                },

                /**
                 * ���� ajax ����
                 * @param options
                 */
                ajax: function (options) {

                    // ���ò���
                    var defaults = {
                        method: 'GET',         // ����ʽ
                        data: false,           // ��������ݣ���ѯ�ַ��������
                        processData: true,     // �Ƿ������ת��Ϊ��ѯ�ַ������ͣ�Ϊ false ʱ�������Զ�ת����
                        async: true,           // �Ƿ�Ϊ�첽����
                        cache: true,           // �Ƿ�ӻ����ж�ȡ��ֻ�� GET/HEAD ������Ч��dataType Ϊ jsonp ʱΪ false
                        username: '',          // HTTP ������֤���û���
                        password: '',          // HTTP ������֤������
                        headers: {},           // һ����ֵ�ԣ���������һ����
                        xhrFields: {},         // ���� XHR ����
                        statusCode: {},        // һ�� HTTP ����ͺ����Ķ���
                        dataType: 'text',      // Ԥ�ڷ��������ص��������� text��json��jsonp
                        jsonp: 'callback',     // jsonp ����Ļص���������
                        jsonpCallback: function () {  // ��string �� Function��ʹ��ָ���Ļص������������Զ����ɵĻص�������
                            return 'mduijsonp_' + Date.now() + '_' + (jsonpID += 1);
                        },

                        contentType: 'application/x-www-form-urlencoded', // ������Ϣ��������ʱ���ݱ�������
                        timeout: 0,            // ��������ʱʱ�䣨���룩
                        global: true,          // �Ƿ��� document �ϴ���ȫ�� ajax �¼�
                        // beforeSend:    function (XMLHttpRequest) ������ǰִ�У����� false ��ȡ������ ajax ����
                        // success:       function (data, textStatus, XMLHttpRequest) ����ɹ�ʱ����
                        // error:         function (XMLHttpRequest, textStatus) ����ʧ��ʱ����
                        // statusCode:    {404: function ()}
                        //                200-299֮���״̬���ʾ�ɹ��������� success �ص�һ��������״̬���ʾʧ�ܣ������� error �ص�һ��
                        // complete:      function (XMLHttpRequest, textStatus) ������ɺ�ص����� (����ɹ���ʧ��֮�������)
                    };

                    // �ص�����
                    var callbacks = [
                        'beforeSend',
                        'success',
                        'error',
                        'statusCode',
                        'complete',
                    ];

                    // �Ƿ���ȡ������
                    var isCanceled = false;

                    // ����ȫ������
                    var globals = globalOptions;

                    // �¼�����
                    var eventParams = {};

                    // �ϲ�ȫ�ֲ�����Ĭ�ϲ�����ȫ�ֻص�����������
                    each(globals, function (key, value) {
                        if (callbacks.indexOf(key) < 0) {
                            defaults[key] = value;
                        }
                    });

                    // �����ϲ�
                    options = $.extend({}, defaults, options);

                    /**
                     * ����ȫ���¼�
                     * @param event string �¼���
                     * @param xhr XMLHttpRequest �¼�����
                     */
                    function triggerEvent(event, xhr) {
                        if (options.global) {
                            $(document).trigger(event, xhr);
                        }
                    }

                    /**
                     * ���� XHR �ص����¼�
                     * @param callback string �ص���������
                     */
                    function triggerCallback(callback) {
                        var a = arguments;
                        var result1;
                        var result2;

                        if (callback) {
                            // ȫ�ֻص�
                            if (callback in globals) {
                                result1 = globals[callback](a[1], a[2], a[3], a[4]);
                            }

                            // �Զ���ص�
                            if (options[callback]) {
                                result2 = options[callback](a[1], a[2], a[3], a[4]);
                            }

                            // beforeSend �ص����� false ʱȡ�� ajax ����
                            if (callback === 'beforeSend' && (result1 === false || result2 === false)) {
                                isCanceled = true;
                            }
                        }
                    }

                    // ����ʽתΪ��д
                    var method = options.method = options.method.toUpperCase();

                    // Ĭ��ʹ�õ�ǰҳ�� URL
                    if (!options.url) {
                        options.url = window.location.toString();
                    }

                    // ��Ҫ���͵�����
                    // GET/HEAD ����� processData Ϊ true ʱ��ת��Ϊ��ѯ�ַ�����ʽ�������ʽ��ת��
                    var sendData;
                    if (
                        (isQueryStringData(method) || options.processData) &&
                        options.data &&
                        [ArrayBuffer, Blob, Document, FormData].indexOf(options.data.constructor) < 0
                    ) {
                        sendData = isString(options.data) ? options.data : $.param(options.data);
                    } else {
                        sendData = options.data;
                    }

                    // ���� GET��HEAD ���͵����󣬰� data ������ӵ� URL ��
                    if (isQueryStringData(method) && sendData) {
                        // ��ѯ�ַ���ƴ�ӵ� URL ��
                        options.url = appendQuery(options.url, sendData);
                        sendData = null;
                    }

                    // JSONP
                    if (options.dataType === 'jsonp') {
                        // URL ������Զ����ɵĻص�������
                        var callbackName = isFunction(options.jsonpCallback) ?
                            options.jsonpCallback() :
                            options.jsonpCallback;
                        var requestUrl = appendQuery(options.url, options.jsonp + '=' + callbackName);

                        eventParams.options = options;

                        triggerEvent(ajaxEvent.ajaxStart, eventParams);
                        triggerCallback('beforeSend', null);

                        if (isCanceled) {
                            return;
                        }

                        var abortTimeout;

                        // ���� script
                        var script = document.createElement('script');
                        script.type = 'text/javascript';

                        // ���� script ʧ��
                        script.onerror = function () {
                            if (abortTimeout) {
                                clearTimeout(abortTimeout);
                            }

                            triggerEvent(ajaxEvent.ajaxError, eventParams);
                            triggerCallback('error', null, 'scripterror');

                            triggerEvent(ajaxEvent.ajaxComplete, eventParams);
                            triggerCallback('complete', null, 'scripterror');
                        };

                        script.src = requestUrl;

                        // ����
                        window[callbackName] = function (data) {
                            if (abortTimeout) {
                                clearTimeout(abortTimeout);
                            }

                            eventParams.data = data;

                            triggerEvent(ajaxEvent.ajaxSuccess, eventParams);
                            triggerCallback('success', data, 'success', null);

                            $(script).remove();
                            script = null;
                            delete window[callbackName];
                        };

                        $('head').append(script);

                        if (options.timeout > 0) {
                            abortTimeout = setTimeout(function () {
                                $(script).remove();
                                script = null;

                                triggerEvent(ajaxEvent.ajaxError, eventParams);
                                triggerCallback('error', null, 'timeout');
                            }, options.timeout);
                        }

                        return;
                    }

                    // GET/HEAD ����Ļ��洦��
                    if (isQueryStringData(method) && !options.cache) {
                        options.url = appendQuery(options.url, '_=' + Date.now());
                    }

                    // ���� XHR
                    var xhr = new XMLHttpRequest();

                    xhr.open(method, options.url, options.async, options.username, options.password);

                    if (sendData && !isQueryStringData(method) && options.contentType !== false || options.contentType) {
                        xhr.setRequestHeader('Content-Type', options.contentType);
                    }

                    // ���� Accept
                    if (options.dataType === 'json') {
                        xhr.setRequestHeader('Accept', 'application/json, text/javascript');
                    }

                    // ��� headers
                    if (options.headers) {
                        each(options.headers, function (key, value) {
                            xhr.setRequestHeader(key, value);
                        });
                    }

                    // ����Ƿ��ǿ�������
                    if (options.crossDomain === undefined) {
                        options.crossDomain =
                            /^([\w-]+:)?\/\/([^\/]+)/.test(options.url) &&
                            RegExp.$2 !== window.location.host;
                    }

                    if (!options.crossDomain) {
                        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                    }

                    if (options.xhrFields) {
                        each(options.xhrFields, function (key, value) {
                            xhr[key] = value;
                        });
                    }

                    eventParams.xhr = xhr;
                    eventParams.options = options;

                    var xhrTimeout;

                    xhr.onload = function () {
                        if (xhrTimeout) {
                            clearTimeout(xhrTimeout);
                        }

                        // �����ɹ�����������ַ���
                        var textStatus;

                        // AJAX ���ص� HTTP ��Ӧ���Ƿ��ʾ�ɹ�
                        var isHttpStatusSuccess = (xhr.status >= 200 && xhr.status < 300) || xhr.status === 0;

                        if (isHttpStatusSuccess) {

                            if (xhr.status === 204 || method === 'HEAD') {
                                textStatus = 'nocontent';
                            } else if (xhr.status === 304) {
                                textStatus = 'notmodified';
                            } else {
                                textStatus = 'success';
                            }

                            var responseData;
                            if (options.dataType === 'json') {
                                try {
                                    eventParams.data = responseData = JSON.parse(xhr.responseText);
                                } catch (err) {
                                    textStatus = 'parsererror';

                                    triggerEvent(ajaxEvent.ajaxError, eventParams);
                                    triggerCallback('error', xhr, textStatus);
                                }

                                if (textStatus !== 'parsererror') {
                                    triggerEvent(ajaxEvent.ajaxSuccess, eventParams);
                                    triggerCallback('success', responseData, textStatus, xhr);
                                }
                            } else {
                                eventParams.data = responseData =
                                    xhr.responseType === 'text' || xhr.responseType === '' ?
                                        xhr.responseText :
                                        xhr.response;

                                triggerEvent(ajaxEvent.ajaxSuccess, eventParams);
                                triggerCallback('success', responseData, textStatus, xhr);
                            }
                        } else {
                            textStatus = 'error';

                            triggerEvent(ajaxEvent.ajaxError, eventParams);
                            triggerCallback('error', xhr, textStatus);
                        }

                        // statusCode
                        each([globals.statusCode, options.statusCode], function (i, func) {
                            if (func && func[xhr.status]) {
                                if (isHttpStatusSuccess) {
                                    func[xhr.status](responseData, textStatus, xhr);
                                } else {
                                    func[xhr.status](xhr, textStatus);
                                }
                            }
                        });

                        triggerEvent(ajaxEvent.ajaxComplete, eventParams);
                        triggerCallback('complete', xhr, textStatus);
                    };

                    xhr.onerror = function () {
                        if (xhrTimeout) {
                            clearTimeout(xhrTimeout);
                        }

                        triggerEvent(ajaxEvent.ajaxError, eventParams);
                        triggerCallback('error', xhr, xhr.statusText);

                        triggerEvent(ajaxEvent.ajaxComplete, eventParams);
                        triggerCallback('complete', xhr, 'error');
                    };

                    xhr.onabort = function () {
                        var textStatus = 'abort';

                        if (xhrTimeout) {
                            textStatus = 'timeout';
                            clearTimeout(xhrTimeout);
                        }

                        triggerEvent(ajaxEvent.ajaxError, eventParams);
                        triggerCallback('error', xhr, textStatus);

                        triggerEvent(ajaxEvent.ajaxComplete, eventParams);
                        triggerCallback('complete', xhr, textStatus);
                    };

                    // ajax start �ص�
                    triggerEvent(ajaxEvent.ajaxStart, eventParams);
                    triggerCallback('beforeSend', xhr);

                    if (isCanceled) {
                        return xhr;
                    }

                    // Timeout
                    if (options.timeout > 0) {
                        xhrTimeout = setTimeout(function () {
                            xhr.abort();
                        }, options.timeout);
                    }

                    // ���� XHR
                    xhr.send(sendData);

                    return xhr;
                },
            });

            // ����ȫ���¼�
            //
            // ͨ�� $(document).on('success.mdui.ajax', function (event, params) {}) ����ʱ��������������
            // event: �¼�����
            // params: {
            //   xhr: XMLHttpRequest ����
            //   options: ajax ��������ò���
            //   data: ajax ���󷵻ص�����
            // }

            // ȫ�� Ajax �¼���ݷ���
            // $(document).ajaxStart(function (event, xhr, options) {})
            // $(document).ajaxSuccess(function (event, xhr, options, data) {})
            // $(document).ajaxError(function (event, xhr, options) {})
            // $(document).ajaxComplete(function (event, xhr, options) {})
            each(ajaxEvent, function (name, eventName) {
                $.fn[name] = function (fn) {
                    return this.on(eventName, function (e, params) {
                        fn(e, params.xhr, params.options, params.data);
                    });
                };
            });
        })();


        /* jshint ignore:start */
        return $;
    })(window, document);
    /* jshint ignore:end */


    /**
     * =============================================================================
     * ************   ����ȫ�ֱ���   ************
     * =============================================================================
     */

    var $document = $(document);
    var $window = $(window);

    /**
     * ���� -- ��ǰ���е� api �� jquery ��һ�������Բ������ mdui.JQ ��
     */
    var queue = {};
    (function () {
        var queueData = [];

        /**
         * д�����
         * @param queueName ������
         * @param func ���������ò���Ϊ��ʱ���������ж���
         */
        queue.queue = function (queueName, func) {
            if (queueData[queueName] === undefined) {
                queueData[queueName] = [];
            }

            if (func === undefined) {
                return queueData[queueName];
            }

            queueData[queueName].push(func);
        };

        /**
         * �Ӷ������Ƴ���һ����������ִ�иú���
         * @param queueName
         */
        queue.dequeue = function (queueName) {
            if (queueData[queueName] !== undefined && queueData[queueName].length) {
                (queueData[queueName].shift())();
            }
        };

    })();

    /**
     * touch �¼���� 500ms �ڽ��� mousedown �¼�
     *
     * ��֧�ִ��ص���Ļ���¼�˳��Ϊ mousedown -> mouseup -> click
     * ֧�ִ��ص���Ļ���¼�˳��Ϊ touchstart -> touchend -> mousedown -> mouseup -> click
     */
    var TouchHandler = {
        touches: 0,

        /**
         * ���¼��Ƿ�����
         * ��ִ���¼�ǰ���ø÷����ж��¼��Ƿ����ִ��
         * @param e
         * @returns {boolean}
         */
        isAllow: function (e) {
            var allow = true;

            if (
                TouchHandler.touches &&
                [
                    'mousedown',
                    'mouseup',
                    'mousemove',
                    'click',
                    'mouseover',
                    'mouseout',
                    'mouseenter',
                    'mouseleave',
                ].indexOf(e.type) > -1
            ) {
                // ������ touch �¼�����ֹ����¼�
                allow = false;
            }

            return allow;
        },

        /**
         * �� touchstart �� touchmove��touchend��touchcancel �¼��е��ø÷���ע���¼�
         * @param e
         */
        register: function (e) {
            if (e.type === 'touchstart') {
                // ������ touch �¼�
                TouchHandler.touches += 1;
            } else if (['touchmove', 'touchend', 'touchcancel'].indexOf(e.type) > -1) {
                // touch �¼����� 500ms ����������¼�����ֹ
                setTimeout(function () {
                    if (TouchHandler.touches) {
                        TouchHandler.touches -= 1;
                    }
                }, 500);
            }
        },

        start: 'touchstart mousedown',
        move: 'touchmove mousemove',
        end: 'touchend mouseup',
        cancel: 'touchcancel mouseleave',
        unlock: 'touchend touchmove touchcancel',
    };

    // �����¼�
    // ��ÿһ���¼��ж�ʹ�� TouchHandler.isAllow(e) �ж��¼��Ƿ��ִ��
    // �� touchstart �� touchmove��touchend��touchcancel
    // (function () {
    //
    //   $document
    //     .on(TouchHandler.start, function (e) {
    //       if (!TouchHandler.isAllow(e)) {
    //         return;
    //       }
    //       TouchHandler.register(e);
    //       console.log(e.type);
    //     })
    //     .on(TouchHandler.move, function (e) {
    //       if (!TouchHandler.isAllow(e)) {
    //         return;
    //       }
    //       console.log(e.type);
    //     })
    //     .on(TouchHandler.end, function (e) {
    //       if (!TouchHandler.isAllow(e)) {
    //         return;
    //       }
    //       console.log(e.type);
    //     })
    //     .on(TouchHandler.unlock, TouchHandler.register);
    // })();

    $(function () {
        // ����ҳ��������ֱ��ִ��css����
        // https://css-tricks.com/transitions-only-after-page-load/

        setTimeout(function () {
            $('body').addClass('mdui-loaded');
        }, 0);
    });


    /**
     * =============================================================================
     * ************   MDUI �ڲ�ʹ�õĺ���   ************
     * =============================================================================
     */

    /**
     * ���� DATA API �Ĳ���
     * @param str
     * @returns {*}
     */
    var parseOptions = function (str) {
        var options = {};

        if (str === null || !str) {
            return options;
        }

        if (typeof str === 'object') {
            return str;
        }

        /* jshint ignore:start */
        var start = str.indexOf('{');
        try {
            options = (new Function('',
                'var json = ' + str.substr(start) +
                '; return JSON.parse(JSON.stringify(json));'))();
        } catch (e) {
        }
        /* jshint ignore:end */

        return options;
    };

    /**
     * ��������¼�
     * @param eventName �¼���
     * @param pluginName �����
     * @param inst ���ʵ��
     * @param trigger �ڸ�Ԫ���ϴ���
     * @param obj �¼�����
     */
    var componentEvent = function (eventName, pluginName, inst, trigger, obj) {
        if (!obj) {
            obj = {};
        }

        obj.inst = inst;

        var fullEventName = eventName + '.mdui.' + pluginName;

        // jQuery �¼�
        if (typeof jQuery !== 'undefined') {
            jQuery(trigger).trigger(fullEventName, obj);
        }

        // JQ �¼�
        $(trigger).trigger(fullEventName, obj);
    };


    /**
     * =============================================================================
     * ************   ���ŵĳ��÷���   ************
     * =============================================================================
     */

    $.fn.extend({

        /**
         * ִ��ǿ���ػ�
         */
        reflow: function () {
            return this.each(function () {
                return this.clientLeft;
            });
        },

        /**
         * ���� transition ʱ��
         * @param duration
         */
        transition: function (duration) {
            if (typeof duration !== 'string') {
                duration = duration + 'ms';
            }

            return this.each(function () {
                this.style.webkitTransitionDuration = duration;
                this.style.transitionDuration = duration;
            });
        },

        /**
         * transition ���������ص�
         * @param callback
         * @returns {transitionEnd}
         */
        transitionEnd: function (callback) {
            var events = [
                'webkitTransitionEnd',
                'transitionend',
            ];
            var i;
            var _this = this;

            function fireCallBack(e) {
                if (e.target !== this) {
                    return;
                }

                callback.call(this, e);

                for (i = 0; i < events.length; i++) {
                    _this.off(events[i], fireCallBack);
                }
            }

            if (callback) {
                for (i = 0; i < events.length; i++) {
                    _this.on(events[i], fireCallBack);
                }
            }

            return this;
        },

        /**
         * ���� transform-origin ����
         * @param transformOrigin
         */
        transformOrigin: function (transformOrigin) {
            return this.each(function () {
                this.style.webkitTransformOrigin = transformOrigin;
                this.style.transformOrigin = transformOrigin;
            });
        },

        /**
         * ���� transform ����
         * @param transform
         */
        transform: function (transform) {
            return this.each(function () {
                this.style.webkitTransform = transform;
                this.style.transform = transform;
            });
        },

    });

    $.extend({
        /**
         * ��������ʾ����
         * @param zIndex ���ֲ�� z-index
         */
        showOverlay: function (zIndex) {
            var $overlay = $('.mdui-overlay');

            if ($overlay.length) {
                $overlay.data('isDeleted', 0);

                if (zIndex !== undefined) {
                    $overlay.css('z-index', zIndex);
                }
            } else {
                if (zIndex === undefined) {
                    zIndex = 2000;
                }

                $overlay = $('<div class="mdui-overlay">')
                    .appendTo(document.body)
                    .reflow()
                    .css('z-index', zIndex);
            }

            var level = $overlay.data('overlay-level') || 0;
            return $overlay
                .data('overlay-level', ++level)
                .addClass('mdui-overlay-show');
        },

        /**
         * �������ֲ�
         * @param force �Ƿ�ǿ����������
         */
        hideOverlay: function (force) {
            var $overlay = $('.mdui-overlay');

            if (!$overlay.length) {
                return;
            }

            var level = force ? 1 : $overlay.data('overlay-level');
            if (level > 1) {
                $overlay.data('overlay-level', --level);
                return;
            }

            $overlay
                .data('overlay-level', 0)
                .removeClass('mdui-overlay-show')
                .data('isDeleted', 1)
                .transitionEnd(function () {
                    if ($overlay.data('isDeleted')) {
                        $overlay.remove();
                    }
                });
        },

        /**
         * ������Ļ
         */
        lockScreen: function () {
            var $body = $('body');

            // ��ֱ�Ӱ� body ��Ϊ box-sizing: border-box��������Ⱦȫ����ʽ
            var newBodyWidth = $body.width();

            $body
                .addClass('mdui-locked')
                .width(newBodyWidth);

            var level = $body.data('lockscreen-level') || 0;
            $body.data('lockscreen-level', ++level);
        },

        /**
         * �����Ļ����
         * @param force �Ƿ�ǿ�ƽ�����Ļ
         */
        unlockScreen: function (force) {
            var $body = $('body');

            var level = force ? 1 : $body.data('lockscreen-level');
            if (level > 1) {
                $body.data('lockscreen-level', --level);
                return;
            }

            $body
                .data('lockscreen-level', 0)
                .removeClass('mdui-locked')
                .width('');
        },

        /**
         * ��������
         * @param fn
         * @param delay
         * @returns {Function}
         */
        throttle: function (fn, delay) {
            var timer = null;
            if (!delay || delay < 16) {
                delay = 16;
            }

            return function () {
                var _this = this;
                var args = arguments;

                if (timer === null) {
                    timer = setTimeout(function () {
                        fn.apply(_this, args);
                        timer = null;
                    }, delay);
                }
            };
        },
    });

    /**
     * ����Ψһ id
     * @param string name id�����ƣ��������ƶ��ڵ�guid�����ڣ��������µ�guid�����أ����Ѵ��ڣ��򷵻�ԭ��guid
     * @returns {string}
     */
    (function () {
        var GUID = {};

        $.extend({
            guid: function (name) {
                if (typeof name !== 'undefined' && typeof GUID[name] !== 'undefined') {
                    return GUID[name];
                }

                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }

                var guid = s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();

                if (typeof name !== 'undefined') {
                    GUID[name] = guid;
                }

                return guid;
            },
        });
    })();


    /**
     * =============================================================================
     * ************   Mutation   ************
     * =============================================================================
     */

    (function () {
        /**
         * API ��ʼ������, �� DOM ͻ���ٴ�ִ�д���ĳ�ʼ������. ʹ�÷���:
         *
         * 1. ������� API ִ�г�ʼ������, selector ����Ϊ�ַ���.
         *    mdui.mutation(selector, apiInit);
         *    mutation ��ִ�� $(selector).each(apiInit)
         *
         * 2. ͻ��ʱ, �ٴ�ִ�д���ĳ�ʼ������
         *    mdui.mutation()        �ȼ� $(document).mutation()
         *    $(selector).mutation() �� selector �ڵ��ڽ��� API ��ʼ��
         *
         * ԭ��:
         *
         *    mutation ִ���� $().data('mdui.mutation', [selector]).
         *    ��Ԫ�ر��ع�ʱ, �����ݻᶪʧ, �ɴ��ж��Ƿ�ͻ��.
         *
         * ��ʾ:
         *
         *    ���� Drawer ����ʹ��ί���¼����.
         *    ���� Collapse ��Ҫ֪�� DOM ����ͻ��, ���ٴν��г�ʼ��.
         */
        var entries = {};

        function mutation(selector, apiInit, that, i, item) {
            var $this = $(that);
            var m = $this.data('mdui.mutation');

            if (!m) {
                m = [];
                $this.data('mdui.mutation', m);
            }

            if (m.indexOf(selector) === -1) {
                m.push(selector);
                apiInit.call(that, i, item);
            }
        }

        $.fn.extend({
            mutation: function () {
                return this.each(function (i, item) {
                    var $this = $(this);
                    $.each(entries, function (selector, apiInit) {
                        if ($this.is(selector)) {
                            mutation(selector, apiInit, $this[0], i, item);
                        }

                        $this.find(selector).each(function (i, item) {
                            mutation(selector, apiInit, this, i, item);
                        });
                    });
                });
            },
        });

        mdui.mutation = function (selector, apiInit) {
            if (typeof selector !== 'string' || typeof apiInit !== 'function') {
                $(document).mutation();
                return;
            }

            entries[selector] = apiInit;
            $(selector).each(function (i, item) {
                mutation(selector, apiInit, this, i, item);
            });
        };

    })();


    /**
     * =============================================================================
     * ************   Headroom.js   ************
     * =============================================================================
     */

    mdui.Headroom = (function () {

        /**
         * Ĭ�ϲ���
         * @type {{}}
         */
        var DEFAULT = {
            tolerance: 5,                                 // �������������پ��뿪ʼ���ػ���ʾԪ�أ�{down: num, up: num}��������
            offset: 0,                                    // ��ҳ�涥�����پ����ڹ�����������Ԫ��
            initialClass: 'mdui-headroom',                // ��ʼ��ʱ��ӵ���
            pinnedClass: 'mdui-headroom-pinned-top',      // Ԫ�ع̶�ʱ��ӵ���
            unpinnedClass: 'mdui-headroom-unpinned-top',  // Ԫ������ʱ��ӵ���
        };

        /**
         * Headroom
         * @param selector
         * @param opts
         * @constructor
         */
        function Headroom(selector, opts) {
            var _this = this;

            _this.$headroom = $(selector).eq(0);
            if (!_this.$headroom.length) {
                return;
            }

            // ��ͨ���Զ�������ʵ�������������ظ�ʵ����
            var oldInst = _this.$headroom.data('mdui.headroom');
            if (oldInst) {
                return oldInst;
            }

            _this.options = $.extend({}, DEFAULT, (opts || {}));

            // ��ֵתΪ {down: bum, up: num}
            var tolerance = _this.options.tolerance;
            if (tolerance !== Object(tolerance)) {
                _this.options.tolerance = {
                    down: tolerance,
                    up: tolerance,
                };
            }

            _this._init();
        }

        /**
         * ��ʼ��
         * @private
         */
        Headroom.prototype._init = function () {
            var _this = this;

            _this.state = 'pinned';
            _this.$headroom
                .addClass(_this.options.initialClass)
                .removeClass(_this.options.pinnedClass + ' ' + _this.options.unpinnedClass);

            _this.inited = false;
            _this.lastScrollY = 0;

            _this._attachEvent();
        };

        /**
         * ���������¼�
         * @private
         */
        Headroom.prototype._attachEvent = function () {
            var _this = this;

            if (!_this.inited) {
                _this.lastScrollY = window.pageYOffset;
                _this.inited = true;

                $window.on('scroll', function () {
                    _this._scroll();
                });
            }
        };

        /**
         * ����ʱ�Ĵ���
         * @private
         */
        Headroom.prototype._scroll = function () {
            var _this = this;
            _this.rafId = window.requestAnimationFrame(function () {
                var currentScrollY = window.pageYOffset;
                var direction = currentScrollY > _this.lastScrollY ? 'down' : 'up';
                var toleranceExceeded =
                    Math.abs(currentScrollY - _this.lastScrollY) >=
                    _this.options.tolerance[direction];

                if (
                    currentScrollY > _this.lastScrollY &&
                    currentScrollY >= _this.options.offset &&
                    toleranceExceeded) {
                    _this.unpin();
                } else if (
                    (currentScrollY < _this.lastScrollY && toleranceExceeded) ||
                    currentScrollY <= _this.options.offset
                ) {
                    _this.pin();
                }

                _this.lastScrollY = currentScrollY;
            });
        };

        /**
         * ���������ص�
         * @param inst
         */
        var transitionEnd = function (inst) {
            if (inst.state === 'pinning') {
                inst.state = 'pinned';
                componentEvent('pinned', 'headroom', inst, inst.$headroom);
            }

            if (inst.state === 'unpinning') {
                inst.state = 'unpinned';
                componentEvent('unpinned', 'headroom', inst, inst.$headroom);
            }
        };

        /**
         * �̶�ס
         */
        Headroom.prototype.pin = function () {
            var _this = this;

            if (
                _this.state === 'pinning' ||
                _this.state === 'pinned' ||
                !_this.$headroom.hasClass(_this.options.initialClass)
            ) {
                return;
            }

            componentEvent('pin', 'headroom', _this, _this.$headroom);

            _this.state = 'pinning';

            _this.$headroom
                .removeClass(_this.options.unpinnedClass)
                .addClass(_this.options.pinnedClass)
                .transitionEnd(function () {
                    transitionEnd(_this);
                });
        };

        /**
         * ���̶�ס
         */
        Headroom.prototype.unpin = function () {
            var _this = this;

            if (
                _this.state === 'unpinning' ||
                _this.state === 'unpinned' ||
                !_this.$headroom.hasClass(_this.options.initialClass)
            ) {
                return;
            }

            componentEvent('unpin', 'headroom', _this, _this.$headroom);

            _this.state = 'unpinning';

            _this.$headroom
                .removeClass(_this.options.pinnedClass)
                .addClass(_this.options.unpinnedClass)
                .transitionEnd(function () {
                    transitionEnd(_this);
                });
        };

        /**
         * ����
         */
        Headroom.prototype.enable = function () {
            var _this = this;

            if (!_this.inited) {
                _this._init();
            }
        };

        /**
         * ����
         */
        Headroom.prototype.disable = function () {
            var _this = this;

            if (_this.inited) {
                _this.inited = false;
                _this.$headroom
                    .removeClass([
                        _this.options.initialClass,
                        _this.options.pinnedClass,
                        _this.options.unpinnedClass,
                    ].join(' '));

                $window.off('scroll', function () {
                    _this._scroll();
                });

                window.cancelAnimationFrame(_this.rafId);
            }
        };

        /**
         * ��ȡ��ǰ״̬ pinning | pinned | unpinning | unpinned
         */
        Headroom.prototype.getState = function () {
            return this.state;
        };

        return Headroom;

    })();


    /**
     * =============================================================================
     * ************   Headroom �Զ������� API   ************
     * =============================================================================
     */

    $(function () {
        mdui.mutation('[mdui-headroom]', function () {
            var $this = $(this);
            var options = parseOptions($this.attr('mdui-headroom'));

            var inst = $this.data('mdui.headroom');
            if (!inst) {
                inst = new mdui.Headroom($this, options);
                $this.data('mdui.headroom', inst);
            }
        });
    });


    /**
     * =============================================================================
     * ************   �� Collapse�� Panel ���õ��۵����ݿ���   ************
     * =============================================================================
     */
    var CollapsePrivate = (function () {

        /**
         * Ĭ�ϲ���
         */
        var DEFAULT = {
            accordion: false,                             // �Ƿ�ʹ���ַ���Ч��
        };

        /**
         * �۵����ݿ�
         * @param selector
         * @param opts
         * @param namespace
         * @constructor
         */
        function Collapse(selector, opts, namespace) {
            var _this = this;

            // �����ռ�
            _this.ns = namespace;

            // ����
            var classpPefix = 'mdui-' + _this.ns + '-item';
            _this.class_item = classpPefix;
            _this.class_item_open = classpPefix + '-open';
            _this.class_header = classpPefix + '-header';
            _this.class_body = classpPefix + '-body';

            // �۵����Ԫ��
            _this.$collapse = $(selector).eq(0);
            if (!_this.$collapse.length) {
                return;
            }

            // ��ͨ���Զ�������ʵ�������������ظ�ʵ����
            var oldInst = _this.$collapse.data('mdui.' + _this.ns);
            if (oldInst) {
                return oldInst;
            }

            _this.options = $.extend({}, DEFAULT, (opts || {}));

            _this.$collapse.on('click', '.' + _this.class_header, function () {
                var $item = $(this).parent('.' + _this.class_item);
                if (_this.$collapse.children($item).length) {
                    _this.toggle($item);
                }
            });

            // �󶨹رհ�ť
            _this.$collapse.on('click', '[mdui-' + _this.ns + '-item-close]', function () {
                var $item = $(this).parents('.' + _this.class_item).eq(0);
                if (_this._isOpen($item)) {
                    _this.close($item);
                }
            });
        }

        /**
         * ָ�� item �Ƿ��ڴ�״̬
         * @param $item
         * @returns {boolean}
         * @private
         */
        Collapse.prototype._isOpen = function ($item) {
            return $item.hasClass(this.class_item_open);
        };

        /**
         * ��ȡָ�� item
         * @param item
         * @returns {*}
         * @private
         */
        Collapse.prototype._getItem = function (item) {
            var _this = this;

            if (parseInt(item) === item) {
                // item ��������
                return _this.$collapse.children('.' + _this.class_item).eq(item);
            }

            return $(item).eq(0);
        };

        /**
         * ���������ص�
         * @param inst
         * @param $content
         * @param $item
         */
        var transitionEnd = function (inst, $content, $item) {
            if (inst._isOpen($item)) {
                $content
                    .transition(0)
                    .height('auto')
                    .reflow()
                    .transition('');

                componentEvent('opened', inst.ns, inst, $item[0]);
            } else {
                $content.height('');

                componentEvent('closed', inst.ns, inst, $item[0]);
            }
        };

        /**
         * ��ָ�������
         * @param item �����������Ż� DOM Ԫ�ػ� CSS ѡ����
         */
        Collapse.prototype.open = function (item) {
            var _this = this;
            var $item = _this._getItem(item);

            if (_this._isOpen($item)) {
                return;
            }

            // �ر�������
            if (_this.options.accordion) {
                _this.$collapse.children('.' + _this.class_item_open).each(function () {
                    var $tmpItem = $(this);

                    if ($tmpItem !== $item) {
                        _this.close($tmpItem);
                    }
                });
            }

            var $content = $item.children('.' + _this.class_body);

            $content
                .height($content[0].scrollHeight)
                .transitionEnd(function () {
                    transitionEnd(_this, $content, $item);
                });

            componentEvent('open', _this.ns, _this, $item[0]);

            $item.addClass(_this.class_item_open);
        };

        /**
         * �ر�ָ����
         * @param item �����������Ż� DOM Ԫ�ػ� CSS ѡ����
         */
        Collapse.prototype.close = function (item) {
            var _this = this;
            var $item = _this._getItem(item);

            if (!_this._isOpen($item)) {
                return;
            }

            var $content = $item.children('.' + _this.class_body);

            componentEvent('close', _this.ns, _this, $item[0]);

            $item.removeClass(_this.class_item_open);

            $content
                .transition(0)
                .height($content[0].scrollHeight)
                .reflow()
                .transition('')
                .height('')
                .transitionEnd(function () {
                    transitionEnd(_this, $content, $item);
                });
        };

        /**
         * �л�ָ�����״̬
         * @param item �����������Ż� DOM Ԫ�ػ� CSS ѡ������ JQ ����
         */
        Collapse.prototype.toggle = function (item) {
            var _this = this;
            var $item = _this._getItem(item);

            if (_this._isOpen($item)) {
                _this.close($item);
            } else {
                _this.open($item);
            }
        };

        /**
         * ��������
         */
        Collapse.prototype.openAll = function () {
            var _this = this;

            _this.$collapse.children('.' + _this.class_item).each(function () {
                var $tmpItem = $(this);

                if (!_this._isOpen($tmpItem)) {
                    _this.open($tmpItem);
                }
            });
        };

        /**
         * �ر�������
         */
        Collapse.prototype.closeAll = function () {
            var _this = this;

            _this.$collapse.children('.' + _this.class_item).each(function () {
                var $tmpItem = $(this);

                if (_this._isOpen($tmpItem)) {
                    _this.close($tmpItem);
                }
            });
        };

        return Collapse;
    })();

    /**
     * =============================================================================
     * ************   Collapse �۵����ݿ���   ************
     * =============================================================================
     */
    mdui.Collapse = (function () {

        function Collapse(selector, opts) {
            return new CollapsePrivate(selector, opts, 'collapse');
        }

        return Collapse;
    })();


    /**
     * =============================================================================
     * ************   Collapse �Զ�������   ************
     * =============================================================================
     */

    $(function () {
        mdui.mutation('[mdui-collapse]', function () {
            var $target = $(this);

            var inst = $target.data('mdui.collapse');
            if (!inst) {
                var options = parseOptions($target.attr('mdui-collapse'));
                inst = new mdui.Collapse($target, options);
                $target.data('mdui.collapse', inst);
            }
        });
    });


    /**
     * =============================================================================
     * ************   Table ���   ************
     * =============================================================================
     */

    (function () {

        /**
         * ���� checkbox �� HTML �ṹ
         * @param tag
         * @returns {string}
         */
        var checkboxHTML = function (tag) {
            return '<' + tag + ' class="mdui-table-cell-checkbox">' +
                '<label class="mdui-checkbox">' +
                '<input type="checkbox"/>' +
                '<i class="mdui-checkbox-icon"></i>' +
                '</label>' +
                '</' + tag + '>';
        };

        /**
         * Table ���
         * @param selector
         * @constructor
         */
        function Table(selector) {
            var _this = this;

            _this.$table = $(selector).eq(0);

            if (!_this.$table.length) {
                return;
            }

            _this.init();
        }

        /**
         * ��ʼ��
         */
        Table.prototype.init = function () {
            var _this = this;

            _this.$thRow = _this.$table.find('thead tr');
            _this.$tdRows = _this.$table.find('tbody tr');
            _this.$tdCheckboxs = $();
            _this.selectable = _this.$table.hasClass('mdui-table-selectable');
            _this.selectedRow = 0;

            _this._updateThCheckbox();
            _this._updateTdCheckbox();
            _this._updateNumericCol();
        };

        /**
         * ���±���е� checkbox
         */
        Table.prototype._updateTdCheckbox = function () {
            var _this = this;

            _this.$tdRows.each(function () {
                var $tdRow = $(this);

                // �Ƴ��ɵ� checkbox
                $tdRow.find('.mdui-table-cell-checkbox').remove();

                if (!_this.selectable) {
                    return;
                }

                // ���� DOM
                var $checkbox = $(checkboxHTML('td'))
                    .prependTo($tdRow)
                    .find('input[type="checkbox"]');

                // Ĭ��ѡ�е���
                if ($tdRow.hasClass('mdui-table-row-selected')) {
                    $checkbox[0].checked = true;
                    _this.selectedRow++;
                }

                // �����ж�ѡ�к�ѡ�б�ͷ�����򣬲�ѡ�б�ͷ
                _this.$thCheckbox[0].checked = _this.selectedRow === _this.$tdRows.length;

                // ���¼�
                $checkbox.on('change', function () {
                    if ($checkbox[0].checked) {
                        $tdRow.addClass('mdui-table-row-selected');
                        _this.selectedRow++;
                    } else {
                        $tdRow.removeClass('mdui-table-row-selected');
                        _this.selectedRow--;
                    }

                    // �����ж�ѡ�к�ѡ�б�ͷ�����򣬲�ѡ�б�ͷ
                    _this.$thCheckbox[0].checked = _this.selectedRow === _this.$tdRows.length;
                });

                _this.$tdCheckboxs = _this.$tdCheckboxs.add($checkbox);
            });
        };

        /**
         * ���±�ͷ�� checkbox
         */
        Table.prototype._updateThCheckbox = function () {
            var _this = this;

            // �Ƴ��ɵ� checkbox
            _this.$thRow.find('.mdui-table-cell-checkbox').remove();

            if (!_this.selectable) {
                return;
            }

            _this.$thCheckbox = $(checkboxHTML('th'))
                .prependTo(_this.$thRow)
                .find('input[type="checkbox"]')
                .on('change', function () {

                    var isCheckedAll = _this.$thCheckbox[0].checked;
                    _this.selectedRow = isCheckedAll ? _this.$tdRows.length : 0;

                    _this.$tdCheckboxs.each(function (i, checkbox) {
                        checkbox.checked = isCheckedAll;
                    });

                    _this.$tdRows.each(function (i, row) {
                        $(row)[isCheckedAll ? 'addClass' : 'removeClass']('mdui-table-row-selected');
                    });

                });
        };

        /**
         * ������ֵ��
         */
        Table.prototype._updateNumericCol = function () {
            var _this = this;
            var $th;
            var $tdRow;

            _this.$thRow.find('th').each(function (i, th) {
                $th = $(th);

                _this.$tdRows.each(function () {
                    $tdRow = $(this);
                    var method = $th.hasClass('mdui-table-col-numeric') ? 'addClass' : 'removeClass';
                    $tdRow.find('td').eq(i)[method]('mdui-table-col-numeric');
                });
            });
        };

        /**
         * ��ʼ�����
         */
        mdui.mutation('.mdui-table', function () {
            var $table = $(this);
            if (!$table.data('mdui.table')) {
                $table.data('mdui.table', new Table($table));
            }
        });

        /**
         * ���±��
         */
        mdui.updateTables = function () {
            $(arguments.length ? arguments[0] : '.mdui-table').each(function () {
                var $table = $(this);
                var inst = $table.data('mdui.table');

                if (inst) {
                    inst.init();
                } else {
                    $table.data('mdui.table', new Table($table));
                }
            });
        };

    })();


    /**
     * =============================================================================
     * ************   ����   ************
     * =============================================================================
     *
     * Inspired by https://github.com/nolimits4web/Framework7/blob/master/src/js/fast-clicks.js
     * https://github.com/nolimits4web/Framework7/blob/master/LICENSE
     *
     * Inspired by https://github.com/fians/Waves
     */

    (function () {

        var Ripple = {

            /**
             * ��ʱ��������ָ����ʱҲ������������λ�����룩
             */
            delay: 200,

            /**
             * ��ʾ��������
             * @param e
             * @param $ripple
             */
            show: function (e, $ripple) {

                // ����Ҽ�����������
                if (e.button === 2) {
                    return;
                }

                // ���λ������
                var tmp;
                if ('touches' in e && e.touches.length) {
                    tmp = e.touches[0];
                } else {
                    tmp = e;
                }

                var touchStartX = tmp.pageX;
                var touchStartY = tmp.pageY;

                // ����λ��
                var offset = $ripple.offset();
                var center = {
                    x: touchStartX - offset.left,
                    y: touchStartY - offset.top,
                };

                var height = $ripple.innerHeight();
                var width = $ripple.innerWidth();
                var diameter = Math.max(
                    Math.pow((Math.pow(height, 2) + Math.pow(width, 2)), 0.5), 48
                );

                // ������ɢ����
                var translate =
                    'translate3d(' + (-center.x + width / 2) + 'px, ' + (-center.y + height / 2) + 'px, 0) ' +
                    'scale(1)';

                // ������ DOM �ṹ
                $('<div class="mdui-ripple-wave" style="' +
                    'width: ' + diameter + 'px; ' +
                    'height: ' + diameter + 'px; ' +
                    'margin-top:-' + diameter / 2 + 'px; ' +
                    'margin-left:-' + diameter / 2 + 'px; ' +
                    'left:' + center.x + 'px; ' +
                    'top:' + center.y + 'px;">' +
                    '</div>')

                    // ���涯��Ч��
                    .data('translate', translate)

                    .prependTo($ripple)
                    .reflow()
                    .transform(translate);
            },

            /**
             * ������������
             */
            hide: function (e, element) {
                var $ripple = $(element || this);

                $ripple.children('.mdui-ripple-wave').each(function () {
                    removeRipple($(this));
                });

                $ripple.off('touchmove touchend touchcancel mousemove mouseup mouseleave', Ripple.hide);
            },
        };

        /**
         * ���ز��Ƴ�����
         * @param $wave
         */
        function removeRipple($wave) {
            if (!$wave.length || $wave.data('isRemoved')) {
                return;
            }

            $wave.data('isRemoved', true);

            var removeTimeout = setTimeout(function () {
                $wave.remove();
            }, 400);

            var translate = $wave.data('translate');

            $wave
                .addClass('mdui-ripple-wave-fill')
                .transform(translate.replace('scale(1)', 'scale(1.01)'))
                .transitionEnd(function () {
                    clearTimeout(removeTimeout);

                    $wave
                        .addClass('mdui-ripple-wave-out')
                        .transform(translate.replace('scale(1)', 'scale(1.01)'));

                    removeTimeout = setTimeout(function () {
                        $wave.remove();
                    }, 700);

                    setTimeout(function () {
                        $wave.transitionEnd(function () {
                            clearTimeout(removeTimeout);
                            $wave.remove();
                        });
                    }, 0);
                });
        }

        /**
         * ��ʾ���������� touchend ���¼�
         * @param e
         */
        function showRipple(e) {
            if (!TouchHandler.isAllow(e)) {
                return;
            }

            TouchHandler.register(e);

            // Chrome 59 ���������ʱ������ document �ϴ����¼�
            if (e.target === document) {
                return;
            }

            var $ripple;
            var $target = $(e.target);

            // ��ȡ�� .mdui-ripple ���Ԫ��
            if ($target.hasClass('mdui-ripple')) {
                $ripple = $target;
            } else {
                $ripple = $target.parents('.mdui-ripple').eq(0);
            }

            if ($ripple.length) {

                // ����״̬��Ԫ���ϲ���������Ч��
                if ($ripple[0].disabled || $ripple.attr('disabled') !== null) {
                    return;
                }

                if (e.type === 'touchstart') {
                    var hidden = false;

                    // toucstart ����ָ��ʱ���ʼ��������
                    var timer = setTimeout(function () {
                        timer = null;
                        Ripple.show(e, $ripple);
                    }, Ripple.delay);

                    var hideRipple = function (hideEvent) {
                        // �����ָû���ƶ���������������û�п�ʼ����ʼ��������
                        if (timer) {
                            clearTimeout(timer);
                            timer = null;
                            Ripple.show(e, $ripple);
                        }

                        if (!hidden) {
                            hidden = true;
                            Ripple.hide(hideEvent, $ripple);
                        }
                    };

                    // ��ָ�ƶ����Ƴ���������
                    var touchMove = function (moveEvent) {
                        if (timer) {
                            clearTimeout(timer);
                            timer = null;
                        }

                        hideRipple(moveEvent);
                    };

                    $ripple
                        .on('touchmove', touchMove)
                        .on('touchend touchcancel', hideRipple);

                } else {
                    Ripple.show(e, $ripple);
                    $ripple.on('touchmove touchend touchcancel mousemove mouseup mouseleave', Ripple.hide);
                }
            }
        }

        // ��ʼ���󶨵��¼�
        $document
            .on(TouchHandler.start, showRipple)
            .on(TouchHandler.unlock, TouchHandler.register);
    })();


    /**
     * =============================================================================
     * ************   Text Field �ı���   ************
     * =============================================================================
     */

    (function () {

        var getProp = function (obj, prop) {
            return (
                typeof obj === 'object' &&
                obj !== null &&
                obj[prop] !== undefined &&
                obj[prop]
            ) ? obj[prop] : false;
        };

        /**
         * ������¼�
         * @param e
         */
        var inputEvent = function (e) {
            var input = e.target;
            var $input = $(input);
            var event = e.type;
            var value = $input.val();

            // reInit Ϊ true ʱ����Ҫ���³�ʼ���ı���
            var reInit = getProp(e.detail, 'reInit');

            // domLoadedEvent Ϊ true ʱ��Ϊ DOM ������Ϻ��Զ��������¼�
            var domLoadedEvent = getProp(e.detail, 'domLoadedEvent');

            // �ı�������
            var type = $input.attr('type') || '';
            if (['checkbox', 'button', 'submit', 'range', 'radio', 'image'].indexOf(type) >= 0) {
                return;
            }

            var $textField = $input.parent('.mdui-textfield');

            // ������Ƿ�۽�
            if (event === 'focus') {
                $textField.addClass('mdui-textfield-focus');
            }

            if (event === 'blur') {
                $textField.removeClass('mdui-textfield-focus');
            }

            // ������Ƿ�Ϊ��
            if (event === 'blur' || event === 'input') {
                $textField[(value && value !== '') ? 'addClass' : 'removeClass']('mdui-textfield-not-empty');
            }

            // ������Ƿ����
            $textField[input.disabled ? 'addClass' : 'removeClass']('mdui-textfield-disabled');

            // ����֤
            if ((event === 'input' || event === 'blur') && !domLoadedEvent) {
                if (input.validity) {
                    var method = input.validity.valid ? 'removeClass' : 'addClass';
                    $textField[method]('mdui-textfield-invalid-html5');
                }
            }

            // textarea �߶��Զ�����
            if (e.target.nodeName.toLowerCase() === 'textarea') {

                // IE bug��textarea ��ֵ��Ϊ������У�������������ʱ��textarea �ĸ߶Ȳ�׼ȷ
                //         ��ʱ���ڼ���߶�ǰ����ֵ�Ŀ�ͷ����һ���ո񣬼�������Ƴ��ո�
                var inputValue = $input.val();
                var hasExtraSpace = false;
                if (inputValue.replace(/[\r\n]/g, '') === '') {
                    $input.val(' ' + inputValue);
                    hasExtraSpace = true;
                }

                // ���� textarea �߶�
                $input.height('');
                var height = $input.height();
                var scrollHeight = input.scrollHeight;

                if (scrollHeight > height) {
                    $input.height(scrollHeight);
                }

                // �����꣬��ԭ textarea ��ֵ
                if (hasExtraSpace) {
                    $input.val(inputValue);
                }
            }

            // ʵʱ����ͳ��
            if (reInit) {
                $textField
                    .find('.mdui-textfield-counter')
                    .remove();
            }

            var maxlength = $input.attr('maxlength');
            if (maxlength) {
                if (reInit || domLoadedEvent) {
                    $('<div class="mdui-textfield-counter">' +
                        '<span class="mdui-textfield-counter-inputed"></span> / ' + maxlength +
                        '</div>').appendTo($textField);
                }

                // �ַ����ȣ�ȷ��ͳ�Ʒ�ʽ�� maxlength һ��
                var inputed = value.length + value.split('\n').length - 1;
                $textField.find('.mdui-textfield-counter-inputed').text(inputed.toString());
            }

            // �� �����ı���������ʾ������ͳ�� ʱ�������ı���ײ��ڱ߾�
            if (
                $textField.find('.mdui-textfield-helper').length ||
                $textField.find('.mdui-textfield-error').length ||
                maxlength
            ) {
                $textField.addClass('mdui-textfield-has-bottom');
            }
        };

        // ���¼�
        $document.on('input focus blur', '.mdui-textfield-input', { useCapture: true }, inputEvent);

        // ��չ���ı���չ��
        $document.on('click', '.mdui-textfield-expandable .mdui-textfield-icon', function () {
            $(this)

                // չ���ı���
                .parents('.mdui-textfield')
                .addClass('mdui-textfield-expanded')

                // �۽��������
                .find('.mdui-textfield-input')[0].focus();
        });

        // ��չ���ı���ر�
        $document.on('click', '.mdui-textfield-expanded .mdui-textfield-close', function () {
            $(this)

                // �ر��ı���
                .parents('.mdui-textfield')
                .removeClass('mdui-textfield-expanded')

                // ��������
                .find('.mdui-textfield-input')
                .val('');
        });

        /**
         * ͨ�� JS �����˱����ݣ���Ҫ���½��б�����
         * @param- ��������� .mdui-textfield ���ڵ� DOM Ԫ�أ�����¸��ı��򣻷��򣬸��������ı���
         */
        mdui.updateTextFields = function () {
            $(arguments.length ? arguments[0] : '.mdui-textfield').each(function () {
                $(this)
                    .find('.mdui-textfield-input')
                    .trigger('input', {
                        reInit: true,
                    });
            });
        };

        /**
         * ��ʼ���ı���
         */
        mdui.mutation('.mdui-textfield', function () {
            $(this)
                .find('.mdui-textfield-input')
                .trigger('input', {
                    domLoadedEvent: true,
                });
        });

    })();


    /**
     * =============================================================================
     * ************   Slider ����   ************
     * =============================================================================
     */

    (function () {

        /**
         * �����ֵ������޸Ļ�����ʽ
         * @param $slider
         */
        var updateValueStyle = function ($slider) {
            var data = $slider.data();

            var $track = data.$track;
            var $fill = data.$fill;
            var $thumb = data.$thumb;
            var $input = data.$input;
            var min = data.min;
            var max = data.max;
            var isDisabled = data.disabled;
            var isDiscrete = data.discrete;
            var $thumbText = data.$thumbText;
            var value = $input.val();
            var percent = (value - min) / (max - min) * 100;

            $fill.width(percent + '%');
            $track.width((100 - percent) + '%');

            if (isDisabled) {
                $fill.css('padding-right', '6px');
                $track.css('padding-left', '6px');
            }

            $thumb.css('left', percent + '%');

            if (isDiscrete) {
                $thumbText.text(value);
            }

            $slider[parseFloat(percent) === 0 ? 'addClass' : 'removeClass']('mdui-slider-zero');
        };

        /**
         * ���³�ʼ��
         * @param $slider
         */
        var reInit = function ($slider) {
            var $track = $('<div class="mdui-slider-track"></div>');
            var $fill = $('<div class="mdui-slider-fill"></div>');
            var $thumb = $('<div class="mdui-slider-thumb"></div>');
            var $input = $slider.find('input[type="range"]');

            // ����״̬
            var isDisabled = $input[0].disabled;
            $slider[isDisabled ? 'addClass' : 'removeClass']('mdui-slider-disabled');

            // ������� HTML
            $slider.find('.mdui-slider-track').remove();
            $slider.find('.mdui-slider-fill').remove();
            $slider.find('.mdui-slider-thumb').remove();
            $slider.append($track).append($fill).append($thumb);

            // �����ͻ���
            var isDiscrete = $slider.hasClass('mdui-slider-discrete');

            var $thumbText;
            if (isDiscrete) {
                $thumbText = $('<span></span>');
                $thumb.empty().append($thumbText);
            }

            $slider.data({
                $track: $track,
                $fill: $fill,
                $thumb: $thumb,
                $input: $input,
                min: $input.attr('min'),    // ������Сֵ
                max: $input.attr('max'),    // �������ֵ
                disabled: isDisabled,       // �Ƿ����״̬
                discrete: isDiscrete,       // �Ƿ��Ǽ����ͻ���
                $thumbText: $thumbText,      // �����ͻ������ֵ
            });

            // ����Ĭ��ֵ
            updateValueStyle($slider);
        };

        var rangeSelector = '.mdui-slider input[type="range"]';

        $document

            // ���������¼�
            .on('input change', rangeSelector, function () {
                var $slider = $(this).parent();
                updateValueStyle($slider);
            })

            // ��ʼ���������¼�
            .on(TouchHandler.start, rangeSelector, function (e) {
                if (!TouchHandler.isAllow(e)) {
                    return;
                }

                TouchHandler.register(e);

                if (!this.disabled) {
                    var $slider = $(this).parent();
                    $slider.addClass('mdui-slider-focus');
                }
            })

            // �������������¼�
            .on(TouchHandler.end, rangeSelector, function (e) {
                if (!TouchHandler.isAllow(e)) {
                    return;
                }

                if (!this.disabled) {
                    var $slider = $(this).parent();
                    $slider.removeClass('mdui-slider-focus');
                }
            })

            .on(TouchHandler.unlock, rangeSelector, TouchHandler.register);

        /**
         * ҳ���������Զ���ʼ����δ��ʼ��ʱ�����Ե��ø÷�����ʼ����
         */
        mdui.mutation('.mdui-slider', function () {
            reInit($(this));
        });

        /**
         * ���³�ʼ�����飨ǿ�����³�ʼ����
         */
        mdui.updateSliders = function () {
            $(arguments.length ? arguments[0] : '.mdui-slider').each(function () {
                reInit($(this));
            });
        };
    })();


    /**
     * =============================================================================
     * ************   Fab ����������ť   ************
     * =============================================================================
     */

    mdui.Fab = (function () {

        /**
         * Ĭ�ϲ���
         * @type {{}}
         */
        var DEFAULT = {
            trigger: 'hover',      // ������ʽ ['hover', 'click']
        };

        /**
         * ����������ťʵ��
         * @param selector ѡ������ HTML �ַ����� DOM Ԫ�ػ� JQ ����
         * @param opts
         * @constructor
         */
        function Fab(selector, opts) {
            var _this = this;

            _this.$fab = $(selector).eq(0);
            if (!_this.$fab.length) {
                return;
            }

            // ��ͨ�� data ����ʵ�������������ظ�ʵ����
            var oldInst = _this.$fab.data('mdui.fab');
            if (oldInst) {
                return oldInst;
            }

            _this.options = $.extend({}, DEFAULT, (opts || {}));
            _this.state = 'closed';

            _this.$btn = _this.$fab.find('.mdui-fab');
            _this.$dial = _this.$fab.find('.mdui-fab-dial');
            _this.$dialBtns = _this.$dial.find('.mdui-fab');

            if (_this.options.trigger === 'hover') {
                _this.$btn
                    .on('touchstart mouseenter', function () {
                        _this.open();
                    });

                _this.$fab
                    .on('mouseleave', function () {
                        _this.close();
                    });
            }

            if (_this.options.trigger === 'click') {
                _this.$btn
                    .on(TouchHandler.start, function () {
                        _this.open();
                    });
            }

            // ������Ļ�����ط��رտ��ٲ���
            $document.on(TouchHandler.start, function (e) {
                if (!$(e.target).parents('.mdui-fab-wrapper').length) {
                    _this.close();
                }
            });
        }

        /**
         * �򿪲˵�
         */
        Fab.prototype.open = function () {
            var _this = this;

            if (_this.state === 'opening' || _this.state === 'opened') {
                return;
            }

            // Ϊ�˵��еİ�ť��Ӳ�ͬ�� transition-delay
            _this.$dialBtns.each(function (index, btn) {
                btn.style['transition-delay'] = btn.style['-webkit-transition-delay'] =
                    15 * (_this.$dialBtns.length - index) + 'ms';
            });

            _this.$dial
                .css('height', 'auto')
                .addClass('mdui-fab-dial-show');

            // �����ť�д��� .mdui-fab-opened ��ͼ�꣬�����ͼ���л�
            if (_this.$btn.find('.mdui-fab-opened').length) {
                _this.$btn.addClass('mdui-fab-opened');
            }

            _this.state = 'opening';
            componentEvent('open', 'fab', _this, _this.$fab);

            // ��˳��Ϊ���µ�������򿪣�������Ĵ򿪺�ű�ʾ�������
            _this.$dialBtns.eq(0).transitionEnd(function () {
                if (_this.$btn.hasClass('mdui-fab-opened')) {
                    _this.state = 'opened';
                    componentEvent('opened', 'fab', _this, _this.$fab);
                }
            });
        };

        /**
         * �رղ˵�
         */
        Fab.prototype.close = function () {
            var _this = this;

            if (_this.state === 'closing' || _this.state === 'closed') {
                return;
            }

            // Ϊ�˵��еİ�ť��Ӳ�ͬ�� transition-delay
            _this.$dialBtns.each(function (index, btn) {
                btn.style['transition-delay'] = btn.style['-webkit-transition-delay'] = 15 * index + 'ms';
            });

            _this.$dial.removeClass('mdui-fab-dial-show');
            _this.$btn.removeClass('mdui-fab-opened');
            _this.state = 'closing';
            componentEvent('close', 'fab', _this, _this.$fab);

            // �����������ιرգ����һ���رպ�ű�ʾ�������
            _this.$dialBtns.eq(-1).transitionEnd(function () {
                if (!_this.$btn.hasClass('mdui-fab-opened')) {
                    _this.state = 'closed';
                    componentEvent('closed', 'fab', _this, _this.$fab);
                    _this.$dial.css('height', 0);
                }
            });
        };

        /**
         * �л��˵��Ĵ�״̬
         */
        Fab.prototype.toggle = function () {
            var _this = this;

            if (_this.state === 'opening' || _this.state === 'opened') {
                _this.close();
            } else if (_this.state === 'closing' || _this.state === 'closed') {
                _this.open();
            }
        };

        /**
         * ��ȡ��ǰ�˵�״̬
         * @returns {'opening'|'opened'|'closing'|'closed'}
         */
        Fab.prototype.getState = function () {
            return this.state;
        };

        /**
         * �Զ�������ʽ��ʾ����������ť
         */
        Fab.prototype.show = function () {
            this.$fab.removeClass('mdui-fab-hide');
        };

        /**
         * �Զ�������ʽ���ظ���������ť
         */
        Fab.prototype.hide = function () {
            this.$fab.addClass('mdui-fab-hide');
        };

        return Fab;
    })();


    /**
     * =============================================================================
     * ************   Fab DATA API   ************
     * =============================================================================
     */

    $(function () {
        // mouseenter ��ð�ݣ��޷������¼�ί�У������� mouseover ���档
        // ������ click �� mouseover ���� touchstart �����ȳ�ʼ����

        $document.on('touchstart mousedown mouseover', '[mdui-fab]', function (e) {
            var $this = $(this);

            var inst = $this.data('mdui.fab');
            if (!inst) {
                var options = parseOptions($this.attr('mdui-fab'));
                inst = new mdui.Fab($this, options);
                $this.data('mdui.fab', inst);
            }
        });
    });


    /**
     * =============================================================================
     * ************   Select ����ѡ��   ************
     * =============================================================================
     */

    mdui.Select = (function () {

        /**
         * Ĭ�ϲ���
         */
        var DEFAULT = {
            position: 'auto',                // ������λ�ã�auto��bottom��top
            gutter: 16,                      // �˵��봰�����±߿����ٱ��ֶ��ټ��
        };

        /**
         * �����˵�λ��
         * @param _this Select ʵ��
         */
        var readjustMenu = function (_this) {
            // ���ڸ߶�
            var windowHeight = $window.height();

            // ���ò���
            var gutter = _this.options.gutter;
            var position = _this.options.position;

            // mdui-select �߶�
            var selectHeight = parseInt(_this.$select.height());

            // �˵���߶�
            var $menuItemFirst = _this.$items.eq(0);
            var menuItemHeight = parseInt($menuItemFirst.height());
            var menuItemMargin = parseInt($menuItemFirst.css('margin-top'));

            // �˵��߶�
            var menuWidth = parseFloat(_this.$select.width() + 0.01); // �������ʵ��ȶ�һ�㣬��Ȼ�����ʡ�Ժ�
            var menuHeight = menuItemHeight * _this.size + menuItemMargin * 2;

            // var menuRealHeight = menuItemHeight * _this.$items.length + menuItemMargin * 2;

            // �˵��Ƿ�����˹�����
            //var isMenuScrollable = menuRealHeight > menuHeight;

            // select �ڴ����е�λ��
            var selectTop = _this.$select[0].getBoundingClientRect().top;

            var transformOriginY;
            var menuMarginTop;

            // position Ϊ auto ʱ
            if (position === 'auto') {

                // �˵��߶Ȳ��ܳ������ڸ߶�
                var heightTemp = windowHeight - gutter * 2;
                if (menuHeight > heightTemp) {
                    menuHeight = heightTemp;
                }

                // �˵��� margin-top
                menuMarginTop = -(
                    menuItemMargin + _this.selectedIndex * menuItemHeight +
                    (menuItemHeight - selectHeight) / 2
                );
                var menuMarginTopMax = -(
                    menuItemMargin + (_this.size - 1) * menuItemHeight +
                    (menuItemHeight - selectHeight) / 2
                );
                if (menuMarginTop < menuMarginTopMax) {
                    menuMarginTop = menuMarginTopMax;
                }

                // �˵����ܳ�������
                var menuTop = selectTop + menuMarginTop;

                if (menuTop < gutter) {
                    // ���ܳ��������Ϸ�
                    menuMarginTop = -(selectTop - gutter);
                } else if (menuTop + menuHeight + gutter > windowHeight) {
                    // ���ܳ��������·�
                    menuMarginTop = -(selectTop + menuHeight + gutter - windowHeight);
                }

                // transform �� Y ������
                transformOriginY = (_this.selectedIndex * menuItemHeight + menuItemHeight / 2 + menuItemMargin) + 'px';
            } else if (position === 'bottom') {
                menuMarginTop = selectHeight;
                transformOriginY = '0px';
            } else if (position === 'top') {
                menuMarginTop = -menuHeight - 1;
                transformOriginY = '100%';
            }

            // ������ʽ
            _this.$select.width(menuWidth);
            _this.$menu
                .width(menuWidth)
                .height(menuHeight)
                .css({
                    'margin-top': menuMarginTop + 'px',
                    'transform-origin':
                    'center ' + transformOriginY + ' 0',
                });
        };

        /**
         * ����ѡ��
         * @param selector
         * @param opts
         * @constructor
         */
        function Select(selector, opts) {
            var _this = this;

            var $selectNative = _this.$selectNative = $(selector).eq(0);
            if (!$selectNative.length) {
                return;
            }

            // ��ͨ���Զ�������ʵ�������������ظ�ʵ����
            var oldInst = $selectNative.data('mdui.select');
            if (oldInst) {
                return oldInst;
            }

            $selectNative.hide();

            _this.options = $.extend({}, DEFAULT, (opts || {}));

            // Ϊ��ǰ select ����Ψһ ID
            _this.uniqueID = $.guid();

            _this.state = 'closed';

            // ���� select
            _this.handleUpdate();

            // ��� select ��������ر�
            $document.on('click touchstart', function (e) {
                var $target = $(e.target);
                if (
                    (_this.state === 'opening' || _this.state === 'opened') &&
                    !$target.is(_this.$select) &&
                    !$.contains(_this.$select[0], $target[0])
                ) {
                    _this.close();
                }
            });
        }

        /**
         * ��ԭ�� select ����������޸ĺ���Ҫ���ø÷���
         */
        Select.prototype.handleUpdate = function () {
            var _this = this;

            if (_this.state === 'opening' || _this.state === 'opened') {
                _this.close();
            }

            var $selectNative = _this.$selectNative;

            // ��ǰ��ֵ���ı�
            _this.value = $selectNative.val();
            _this.text = '';

            // ���� HTML
            // �˵���
            _this.$items = $();
            $selectNative.find('option').each(function (index, option) {
                var data = {
                    value: option.value,
                    text: option.textContent,
                    disabled: option.disabled,
                    selected: _this.value === option.value,
                    index: index,
                };

                if (_this.value === data.value) {
                    _this.text = data.text;
                    _this.selectedIndex = index;
                }

                _this.$items = _this.$items.add(
                    $('<div class="mdui-select-menu-item mdui-ripple"' +
                        (data.disabled ? ' disabled' : '') +
                        (data.selected ? ' selected' : '') + '>' + data.text + '</div>')
                        .data(data)
                );
            });

            // selected
            _this.$selected = $('<span class="mdui-select-selected">' + _this.text + '</span>');

            // select
            _this.$select =
                $(
                    '<div class="mdui-select mdui-select-position-' + _this.options.position + '" ' +
                    'style="' + _this.$selectNative.attr('style') + '" ' +
                    'id="' + _this.uniqueID + '"></div>'
                )
                    .show()
                    .append(_this.$selected);

            // menu
            _this.$menu =
                $('<div class="mdui-select-menu"></div>')
                    .appendTo(_this.$select)
                    .append(_this.$items);

            $('#' + _this.uniqueID).remove();
            $selectNative.after(_this.$select);

            // ���� select �� size �������ø߶ȣ�Ĭ��Ϊ 6
            _this.size = _this.$selectNative.attr('size');

            if (!_this.size) {
                _this.size = _this.$items.length;
                if (_this.size > 8) {
                    _this.size = 8;
                }
            }

            if (_this.size < 2) {
                _this.size = 2;
            }

            // ���ѡ��ʱ�ر������˵�
            _this.$items.on('click', function () {
                if (_this.state === 'closing') {
                    return;
                }

                var $item = $(this);

                if ($item.data('disabled')) {
                    return;
                }

                var itemData = $item.data();

                _this.$selected.text(itemData.text);
                $selectNative.val(itemData.value);
                _this.$items.removeAttr('selected');
                $item.attr('selected', '');
                _this.selectedIndex = itemData.index;
                _this.value = itemData.value;
                _this.text = itemData.text;
                $selectNative.trigger('change');

                _this.close();
            });

            // ��� select ʱ�������˵�
            _this.$select.on('click', function (e) {
                var $target = $(e.target);

                // �ڲ˵��ϵ��ʱ����
                if ($target.is('.mdui-select-menu') || $target.is('.mdui-select-menu-item')) {
                    return;
                }

                _this.toggle();
            });
        };

        /**
         * ���������ص�
         * @param inst
         */
        var transitionEnd = function (inst) {
            inst.$select.removeClass('mdui-select-closing');

            if (inst.state === 'opening') {
                inst.state = 'opened';
                componentEvent('opened', 'select', inst, inst.$selectNative);

                inst.$menu.css('overflow-y', 'auto');
            }

            if (inst.state === 'closing') {
                inst.state = 'closed';
                componentEvent('closed', 'select', inst, inst.$selectNative);

                // �ָ���ʽ
                inst.$select.width('');
                inst.$menu.css({
                    'margin-top': '',
                    height: '',
                    width: '',
                });
            }
        };

        /**
         * �� Select
         */
        Select.prototype.open = function () {
            var _this = this;

            if (_this.state === 'opening' || _this.state === 'opened') {
                return;
            }

            _this.state = 'opening';
            componentEvent('open', 'select', _this, _this.$selectNative);

            readjustMenu(_this);

            _this.$select.addClass('mdui-select-open');

            _this.$menu.transitionEnd(function () {
                transitionEnd(_this);
            });
        };

        /**
         * �ر� Select
         */
        Select.prototype.close = function () {
            var _this = this;

            if (_this.state === 'closing' || _this.state === 'closed') {
                return;
            }

            _this.state = 'closing';
            componentEvent('close', 'select', _this, _this.$selectNative);

            _this.$menu.css('overflow-y', '');

            _this.$select
                .removeClass('mdui-select-open')
                .addClass('mdui-select-closing');
            _this.$menu.transitionEnd(function () {
                transitionEnd(_this);
            });
        };

        /**
         * �л� Select ��ʾ״̬
         */
        Select.prototype.toggle = function () {
            var _this = this;

            if (_this.state === 'opening' || _this.state === 'opened') {
                _this.close();
            } else if (_this.state === 'closing' || _this.state === 'closed') {
                _this.open();
            }
        };

        return Select;
    })();


    /**
     * =============================================================================
     * ************   Select ����ѡ��   ************
     * =============================================================================
     */

    $(function () {
        mdui.mutation('[mdui-select]', function () {
            var $this = $(this);
            var inst = $this.data('mdui.select');
            if (!inst) {
                inst = new mdui.Select($this, parseOptions($this.attr('mdui-select')));
                $this.data('mdui.select', inst);
            }
        });
    });


    /**
     * =============================================================================
     * ************   Appbar   ************
     * =============================================================================
     * ����ʱ�Զ�����Ӧ����
     * mdui-appbar-scroll-hide
     * mdui-appbar-scroll-toolbar-hide
     */

    $(function () {
        // ����ʱ����Ӧ����
        mdui.mutation('.mdui-appbar-scroll-hide', function () {
            var $this = $(this);
            $this.data('mdui.headroom', new mdui.Headroom($this));
        });

        // ����ʱֻ����Ӧ�����еĹ�����
        mdui.mutation('.mdui-appbar-scroll-toolbar-hide', function () {
            var $this = $(this);
            var inst = new mdui.Headroom($this, {
                pinnedClass: 'mdui-headroom-pinned-toolbar',
                unpinnedClass: 'mdui-headroom-unpinned-toolbar',
            });
            $this.data('mdui.headroom', inst);
        });
    });


    /**
     * =============================================================================
     * ************   Tab   ************
     * =============================================================================
     */

    mdui.Tab = (function () {

        var DEFAULT = {
            trigger: 'click',       // ������ʽ click: ������л� hover: ��������л�
            //animation: false,       // �л�ʱ�Ƿ���ʾ����
            loop: false,            // Ϊtrueʱ�������һ��ѡ�ʱ���� next() ������ص���һ��ѡ�
        };

        // Ԫ���Ƿ��ѽ���
        var isDisabled = function ($ele) {
            return $ele[0].disabled || $ele.attr('disabled') !== null;
        };

        /**
         * ѡ�
         * @param selector
         * @param opts
         * @returns {*}
         * @constructor
         */
        function Tab(selector, opts) {
            var _this = this;

            _this.$tab = $(selector).eq(0);
            if (!_this.$tab.length) {
                return;
            }

            // ��ͨ���Զ�������ʵ�������������ظ�ʵ����
            var oldInst = _this.$tab.data('mdui.tab');
            if (oldInst) {
                return oldInst;
            }

            _this.options = $.extend({}, DEFAULT, (opts || {}));
            _this.$tabs = _this.$tab.children('a');
            _this.$indicator = $('<div class="mdui-tab-indicator"></div>').appendTo(_this.$tab);
            _this.activeIndex = false; // Ϊ false ʱ��ʾû�м����ѡ����򲻴���ѡ�

            // ���� url hash ��ȡĬ�ϼ����ѡ�
            var hash = location.hash;
            if (hash) {
                _this.$tabs.each(function (i, tab) {
                    if ($(tab).attr('href') === hash) {
                        _this.activeIndex = i;
                        return false;
                    }
                });
            }

            // �� mdui-tab-active ��Ԫ��Ĭ�ϼ���
            if (_this.activeIndex === false) {
                _this.$tabs.each(function (i, tab) {
                    if ($(tab).hasClass('mdui-tab-active')) {
                        _this.activeIndex = i;
                        return false;
                    }
                });
            }

            // ����ѡ�ʱ��Ĭ�ϼ����һ��ѡ�
            if (_this.$tabs.length && _this.activeIndex === false) {
                _this.activeIndex = 0;
            }

            // ���ü���״̬ѡ�
            _this._setActive();

            // �������ڴ�С�仯�¼�������ָʾ��λ��
            $window.on('resize', $.throttle(function () {
                _this._setIndicatorPosition();
            }, 100));

            // �������ѡ��¼�
            _this.$tabs.each(function (i, tab) {
                _this._bindTabEvent(tab);
            });
        }

        /**
         * ���� Tab �ϵ�����������¼�
         * @private
         */
        Tab.prototype._bindTabEvent = function (tab) {
            var _this = this;
            var $tab = $(tab);

            // �����������봥�����¼�
            var clickEvent = function (e) {
                // ����״̬��ѡ���޷�ѡ��
                if (isDisabled($tab)) {
                    e.preventDefault();
                    return;
                }

                _this.activeIndex = _this.$tabs.index(tab);
                _this._setActive();
            };

            // ���� trigger �� click ���� hover��������Ӧ click �¼�
            $tab.on('click', clickEvent);

            // trigger Ϊ hover ʱ��������Ӧ mouseenter �¼�
            if (_this.options.trigger === 'hover') {
                $tab.on('mouseenter', clickEvent);
            }

            $tab.on('click', function (e) {
                // ��ֹ���ӵ�Ĭ�ϵ������
                if ($tab.attr('href').indexOf('#') === 0) {
                    e.preventDefault();
                }
            });
        };

        /**
         * ���ü���״̬��ѡ�
         * @private
         */
        Tab.prototype._setActive = function () {
            var _this = this;

            _this.$tabs.each(function (i, tab) {
                var $tab = $(tab);
                var targetId = $tab.attr('href');

                // ����ѡ�����״̬
                if (i === _this.activeIndex && !isDisabled($tab)) {
                    if (!$tab.hasClass('mdui-tab-active')) {
                        componentEvent('change', 'tab', _this, _this.$tab, {
                            index: _this.activeIndex,
                            id: targetId.substr(1),
                        });
                        componentEvent('show', 'tab', _this, $tab);

                        $tab.addClass('mdui-tab-active');
                    }

                    $(targetId).show();
                    _this._setIndicatorPosition();
                } else {
                    $tab.removeClass('mdui-tab-active');
                    $(targetId).hide();
                }
            });
        };

        /**
         * ����ѡ�ָʾ����λ��
         */
        Tab.prototype._setIndicatorPosition = function () {
            var _this = this;
            var $activeTab;
            var activeTabOffset;

            // ѡ�����Ϊ 0 ʱ������ʾָʾ��
            if (_this.activeIndex === false) {
                _this.$indicator.css({
                    left: 0,
                    width: 0,
                });

                return;
            }

            $activeTab = _this.$tabs.eq(_this.activeIndex);
            if (isDisabled($activeTab)) {
                return;
            }

            activeTabOffset = $activeTab.offset();
            _this.$indicator.css({
                left: activeTabOffset.left + _this.$tab[0].scrollLeft -
                _this.$tab[0].getBoundingClientRect().left + 'px',
                width: $activeTab.width() + 'px',
            });
        };

        /**
         * �л�����һ��ѡ�
         */
        Tab.prototype.next = function () {
            var _this = this;

            if (_this.activeIndex === false) {
                return;
            }

            if (_this.$tabs.length > _this.activeIndex + 1) {
                _this.activeIndex++;
            } else if (_this.options.loop) {
                _this.activeIndex = 0;
            }

            _this._setActive();
        };

        /**
         * �л�����һ��ѡ�
         */
        Tab.prototype.prev = function () {
            var _this = this;

            if (_this.activeIndex === false) {
                return;
            }

            if (_this.activeIndex > 0) {
                _this.activeIndex--;
            } else if (_this.options.loop) {
                _this.activeIndex = _this.$tabs.length - 1;
            }

            _this._setActive();
        };

        /**
         * ��ʾָ����Ż�ָ��id��ѡ�
         * @param index ��0��ʼ����ţ�����#��ͷ��id
         */
        Tab.prototype.show = function (index) {
            var _this = this;

            if (_this.activeIndex === false) {
                return;
            }

            if (parseInt(index) === index) {
                _this.activeIndex = index;
            } else {
                _this.$tabs.each(function (i, tab) {
                    if (tab.id === index) {
                        _this.activeIndex = i;
                        return false;
                    }
                });
            }

            _this._setActive();
        };

        /**
         * �ڸ�Ԫ�صĿ�ȱ仯ʱ����Ҫ���ø÷������µ���ָʾ��λ��
         * ����ӻ�ɾ��ѡ�ʱ����Ҫ���ø÷���
         */
        Tab.prototype.handleUpdate = function () {
            var _this = this;

            var $oldTabs = _this.$tabs;               // �ɵ� tabs JQ����
            var $newTabs = _this.$tab.children('a');  // �µ� tabs JQ����
            var oldTabsEle = $oldTabs.get();          // �� tabs ��Ԫ������
            var newTabsEle = $newTabs.get();          // �µ� tabs Ԫ������

            if (!$newTabs.length) {
                _this.activeIndex = false;
                _this.$tabs = $newTabs;
                _this._setIndicatorPosition();

                return;
            }

            // ���±���ѡ����ҳ�������ѡ�
            $newTabs.each(function (i, tab) {
                // ��������ѡ�
                if (oldTabsEle.indexOf(tab) < 0) {
                    _this._bindTabEvent(tab);

                    if (_this.activeIndex === false) {
                        _this.activeIndex = 0;
                    } else if (i <= _this.activeIndex) {
                        _this.activeIndex++;
                    }
                }
            });

            // �ҳ����Ƴ���ѡ�
            $oldTabs.each(function (i, tab) {
                // �б��Ƴ���ѡ�
                if (newTabsEle.indexOf(tab) < 0) {

                    if (i < _this.activeIndex) {
                        _this.activeIndex--;
                    } else if (i === _this.activeIndex) {
                        _this.activeIndex = 0;
                    }
                }
            });

            _this.$tabs = $newTabs;

            _this._setActive();
        };

        return Tab;
    })();


    /**
     * =============================================================================
     * ************   Tab �Զ������� API   ************
     * =============================================================================
     */

    $(function () {
        mdui.mutation('[mdui-tab]', function () {
            var $this = $(this);
            var inst = $this.data('mdui.tab');
            if (!inst) {
                inst = new mdui.Tab($this, parseOptions($this.attr('mdui-tab')));
                $this.data('mdui.tab', inst);
            }
        });
    });


    /**
     * =============================================================================
     * ************   Drawer ������   ************
     * =============================================================================
     *
     * �������豸��Ĭ����ʾ������������ʾ���ֲ�
     * ���ֻ���ƽ���豸��Ĭ�ϲ���ʾ��������ʼ����ʾ���ֲ㣬�Ҹ��ǵ�����
     */

    mdui.Drawer = (function () {

        /**
         * Ĭ�ϲ���
         * @type {{}}
         */
        var DEFAULT = {
            // �������豸���Ƿ���ʾ���ֲ㡣�ֻ���ƽ�岻���������Ӱ�죬ʼ�ջ���ʾ���ֲ�
            overlay: false,

            // �Ƿ�������
            swipe: false,
        };

        var isDesktop = function () {
            return $window.width() >= 1024;
        };

        /**
         * ������ʵ��
         * @param selector ѡ������ HTML �ַ����� DOM Ԫ��
         * @param opts
         * @constructor
         */
        function Drawer(selector, opts) {
            var _this = this;

            _this.$drawer = $(selector).eq(0);
            if (!_this.$drawer.length) {
                return;
            }

            var oldInst = _this.$drawer.data('mdui.drawer');
            if (oldInst) {
                return oldInst;
            }

            _this.options = $.extend({}, DEFAULT, (opts || {}));

            _this.overlay = false; // �Ƿ���ʾ�����ֲ�
            _this.position = _this.$drawer.hasClass('mdui-drawer-right') ? 'right' : 'left';

            if (_this.$drawer.hasClass('mdui-drawer-close')) {
                _this.state = 'closed';
            } else if (_this.$drawer.hasClass('mdui-drawer-open')) {
                _this.state = 'opened';
            } else if (isDesktop()) {
                _this.state = 'opened';
            } else {
                _this.state = 'closed';
            }

            // ��������ڴ�С����ʱ
            $window.on('resize', $.throttle(function () {
                // ���ֻ�ƽ���л�������ʱ
                if (isDesktop()) {
                    // �����ʾ�����֣�����������
                    if (_this.overlay && !_this.options.overlay) {
                        $.hideOverlay();
                        _this.overlay = false;
                        $.unlockScreen();
                    }

                    // û��ǿ�ƹرգ���״̬Ϊ��״̬
                    if (!_this.$drawer.hasClass('mdui-drawer-close')) {
                        _this.state = 'opened';
                    }
                }

                // �������л����ֻ�ƽ��ʱ������������Ǵ��ŵ���û�����ֲ㣬��رճ�����
                else {
                    if (!_this.overlay && _this.state === 'opened') {
                        // ����������ǿ�ƴ�״̬���������
                        if (_this.$drawer.hasClass('mdui-drawer-open')) {
                            $.showOverlay();
                            _this.overlay = true;
                            $.lockScreen();

                            $('.mdui-overlay').one('click', function () {
                                _this.close();
                            });
                        } else {
                            _this.state = 'closed';
                        }
                    }
                }
            }, 100));

            // �󶨹رհ�ť�¼�
            _this.$drawer.find('[mdui-drawer-close]').each(function () {
                $(this).on('click', function () {
                    _this.close();
                });
            });

            swipeSupport(_this);
        }

        /**
         * ��������֧��
         * @param _this
         */
        var swipeSupport = function (_this) {
            // �������������ƿ���
            var openNavEventHandler;
            var touchStartX;
            var touchStartY;
            var swipeStartX;
            var swiping = false;
            var maybeSwiping = false;
            var $body = $('body');

            // ���ƴ����ķ�Χ
            var swipeAreaWidth = 24;

            function enableSwipeHandling() {
                if (!openNavEventHandler) {
                    $body.on('touchstart', onBodyTouchStart);
                    openNavEventHandler = onBodyTouchStart;
                }
            }

            function setPosition(translateX, closeTransform) {
                var rtlTranslateMultiplier = _this.position === 'right' ? -1 : 1;
                var transformCSS = 'translate(' + (-1 * rtlTranslateMultiplier * translateX) + 'px, 0) !important;';
                _this.$drawer.css(
                    'cssText',
                    'transform:' + transformCSS + (closeTransform ? 'transition: initial !important;' : '')
                );
            }

            function cleanPosition() {
                _this.$drawer.css({
                    transform: '',
                    transition: '',
                });
            }

            function getMaxTranslateX() {
                return _this.$drawer.width() + 10;
            }

            function getTranslateX(currentX) {
                return Math.min(
                    Math.max(
                        swiping === 'closing' ? (swipeStartX - currentX) : (getMaxTranslateX() + swipeStartX - currentX),
                        0
                    ),
                    getMaxTranslateX()
                );
            }

            function onBodyTouchStart(event) {
                touchStartX = event.touches[0].pageX;
                if (_this.position === 'right') {
                    touchStartX = $body.width() - touchStartX;
                }

                touchStartY = event.touches[0].pageY;

                if (_this.state !== 'opened') {
                    if (touchStartX > swipeAreaWidth || openNavEventHandler !== onBodyTouchStart) {
                        return;
                    }
                }

                maybeSwiping = true;

                $body.on({
                    touchmove: onBodyTouchMove,
                    touchend: onBodyTouchEnd,
                    touchcancel: onBodyTouchMove,
                });
            }

            function onBodyTouchMove(event) {
                var touchX = event.touches[0].pageX;
                if (_this.position === 'right') {
                    touchX = $body.width() - touchX;
                }

                var touchY = event.touches[0].pageY;

                if (swiping) {
                    setPosition(getTranslateX(touchX), true);
                } else if (maybeSwiping) {
                    var dXAbs = Math.abs(touchX - touchStartX);
                    var dYAbs = Math.abs(touchY - touchStartY);
                    var threshold = 8;

                    if (dXAbs > threshold && dYAbs <= threshold) {
                        swipeStartX = touchX;
                        swiping = _this.state === 'opened' ? 'closing' : 'opening';
                        $.lockScreen();
                        setPosition(getTranslateX(touchX), true);
                    } else if (dXAbs <= threshold && dYAbs > threshold) {
                        onBodyTouchEnd();
                    }
                }
            }

            function onBodyTouchEnd(event) {
                if (swiping) {
                    var touchX = event.changedTouches[0].pageX;
                    if (_this.position === 'right') {
                        touchX = $body.width() - touchX;
                    }

                    var translateRatio = getTranslateX(touchX) / getMaxTranslateX();

                    maybeSwiping = false;
                    var swipingState = swiping;
                    swiping = null;

                    if (swipingState === 'opening') {
                        if (translateRatio < 0.92) {
                            cleanPosition();
                            _this.open();
                        } else {
                            cleanPosition();
                        }
                    } else {
                        if (translateRatio > 0.08) {
                            cleanPosition();
                            _this.close();
                        } else {
                            cleanPosition();
                        }
                    }

                    $.unlockScreen();
                } else {
                    maybeSwiping = false;
                }

                $body.off({
                    touchmove: onBodyTouchMove,
                    touchend: onBodyTouchEnd,
                    touchcancel: onBodyTouchMove,
                });
            }

            if (_this.options.swipe) {
                enableSwipeHandling();
            }
        };

        /**
         * ���������ص�
         * @param inst
         */
        var transitionEnd = function (inst) {
            if (inst.$drawer.hasClass('mdui-drawer-open')) {
                inst.state = 'opened';
                componentEvent('opened', 'drawer', inst, inst.$drawer);
            } else {
                inst.state = 'closed';
                componentEvent('closed', 'drawer', inst, inst.$drawer);
            }
        };

        /**
         * �򿪳�����
         */
        Drawer.prototype.open = function () {
            var _this = this;

            if (_this.state === 'opening' || _this.state === 'opened') {
                return;
            }

            _this.state = 'opening';
            componentEvent('open', 'drawer', _this, _this.$drawer);

            if (!_this.options.overlay) {
                $('body').addClass('mdui-drawer-body-' + _this.position);
            }

            _this.$drawer
                .removeClass('mdui-drawer-close')
                .addClass('mdui-drawer-open')
                .transitionEnd(function () {
                    transitionEnd(_this);
                });

            if (!isDesktop() || _this.options.overlay) {
                _this.overlay = true;
                $.showOverlay().one('click', function () {
                    _this.close();
                });

                $.lockScreen();
            }
        };

        /**
         * �رճ�����
         */
        Drawer.prototype.close = function () {
            var _this = this;

            if (_this.state === 'closing' || _this.state === 'closed') {
                return;
            }

            _this.state = 'closing';
            componentEvent('close', 'drawer', _this, _this.$drawer);

            if (!_this.options.overlay) {
                $('body').removeClass('mdui-drawer-body-' + _this.position);
            }

            _this.$drawer
                .addClass('mdui-drawer-close')
                .removeClass('mdui-drawer-open')
                .transitionEnd(function () {
                    transitionEnd(_this);
                });

            if (_this.overlay) {
                $.hideOverlay();
                _this.overlay = false;
                $.unlockScreen();
            }
        };

        /**
         * �л���������/�ر�״̬
         */
        Drawer.prototype.toggle = function () {
            var _this = this;

            if (_this.state === 'opening' || _this.state === 'opened') {
                _this.close();
            } else if (_this.state === 'closing' || _this.state === 'closed') {
                _this.open();
            }
        };

        /**
         * ��ȡ������״̬
         * @returns {'opening'|'opened'|'closing'|'closed'}
         */
        Drawer.prototype.getState = function () {
            return this.state;
        };

        return Drawer;

    })();


    /**
     * =============================================================================
     * ************   Drawer �Զ������� API   ************
     * =============================================================================
     */

    $(function () {
        mdui.mutation('[mdui-drawer]', function () {
            var $this = $(this);
            var options = parseOptions($this.attr('mdui-drawer'));
            var selector = options.target;
            delete options.target;

            var $drawer = $(selector).eq(0);

            var inst = $drawer.data('mdui.drawer');
            if (!inst) {
                inst = new mdui.Drawer($drawer, options);
                $drawer.data('mdui.drawer', inst);
            }

            $this.on('click', function () {
                inst.toggle();
            });

        });
    });


    /**
     * =============================================================================
     * ************   Dialog �Ի���   ************
     * =============================================================================
     */

    mdui.Dialog = (function () {

        /**
         * Ĭ�ϲ���
         */
        var DEFAULT = {
            history: true,                // ���� hashchange �¼�
            overlay: true,                // �򿪶Ի���ʱ�Ƿ���ʾ����
            modal: false,                 // �Ƿ�ģ̬���Ի���Ϊ false ʱ����Ի�����������رնԻ���Ϊ true ʱ���ر�
            closeOnEsc: true,             // ���� esc �رնԻ���
            closeOnCancel: true,          // ����ȡ����ťʱ�رնԻ���
            closeOnConfirm: true,         // ����ȷ�ϰ�ťʱ�رնԻ���
            destroyOnClosed: false,        // �رպ�����
        };

        /**
         * ���ֲ�Ԫ��
         */
        var $overlay;

        /**
         * �����Ƿ�������
         */
        var isLockScreen;

        /**
         * ��ǰ�Ի���ʵ��
         */
        var currentInst;

        /**
         * ������
         * @type {string}
         */
        var queueName = '__md_dialog';

        /**
         * ���ڿ�ȱ仯����Ի������ݱ仯ʱ�������Ի���λ�úͶԻ����ڵĹ�����
         */
        var readjust = function () {
            if (!currentInst) {
                return;
            }

            var $dialog = currentInst.$dialog;

            var $dialogTitle = $dialog.children('.mdui-dialog-title');
            var $dialogContent = $dialog.children('.mdui-dialog-content');
            var $dialogActions = $dialog.children('.mdui-dialog-actions');

            // ���� dialog �� top �� height ֵ
            $dialog.height('');
            $dialogContent.height('');

            var dialogHeight = $dialog.height();
            $dialog.css({
                top: (($window.height() - dialogHeight) / 2) + 'px',
                height: dialogHeight + 'px',
            });

            // ���� mdui-dialog-content �ĸ߶�
            $dialogContent.height(
                dialogHeight -
                ($dialogTitle.height() || 0) -
                ($dialogActions.height() || 0)
            );
        };

        /**
         * hashchange �¼�����ʱ�رնԻ���
         */
        var hashchangeEvent = function () {
            if (location.hash.substring(1).indexOf('&mdui-dialog') < 0) {
                currentInst.close(true);
            }
        };

        /**
         * ������ֲ�رնԻ���
         * @param e
         */
        var overlayClick = function (e) {
            if ($(e.target).hasClass('mdui-overlay') && currentInst) {
                currentInst.close();
            }
        };

        /**
         * �Ի���ʵ��
         * @param selector ѡ������ HTML �ַ����� DOM Ԫ��
         * @param opts
         * @constructor
         */
        function Dialog(selector, opts) {
            var _this = this;

            // �Ի���Ԫ��
            _this.$dialog = $(selector).eq(0);
            if (!_this.$dialog.length) {
                return;
            }

            // ��ͨ�� data ����ʵ�������������ظ�ʵ����
            var oldInst = _this.$dialog.data('mdui.dialog');
            if (oldInst) {
                return oldInst;
            }

            // ����Ի���Ԫ��û���ڵ�ǰ�ĵ��У�����Ҫ���
            if (!$.contains(document.body, _this.$dialog[0])) {
                _this.append = true;
                $('body').append(_this.$dialog);
            }

            _this.options = $.extend({}, DEFAULT, (opts || {}));
            _this.state = 'closed';

            // ��ȡ����ť�¼�
            _this.$dialog.find('[mdui-dialog-cancel]').each(function () {
                $(this).on('click', function () {
                    componentEvent('cancel', 'dialog', _this, _this.$dialog);
                    if (_this.options.closeOnCancel) {
                        _this.close();
                    }
                });
            });

            // ��ȷ�ϰ�ť�¼�
            _this.$dialog.find('[mdui-dialog-confirm]').each(function () {
                $(this).on('click', function () {
                    componentEvent('confirm', 'dialog', _this, _this.$dialog);
                    if (_this.options.closeOnConfirm) {
                        _this.close();
                    }
                });
            });

            // �󶨹رհ�ť�¼�
            _this.$dialog.find('[mdui-dialog-close]').each(function () {
                $(this).on('click', function () {
                    _this.close();
                });
            });
        }

        /**
         * ���������ص�
         * @param inst
         */
        var transitionEnd = function (inst) {
            if (inst.$dialog.hasClass('mdui-dialog-open')) {
                inst.state = 'opened';
                componentEvent('opened', 'dialog', inst, inst.$dialog);
            } else {
                inst.state = 'closed';
                componentEvent('closed', 'dialog', inst, inst.$dialog);

                inst.$dialog.hide();

                // ���жԻ��򶼹رգ��ҵ�ǰû�д򿪵ĶԻ���ʱ��������Ļ
                if (queue.queue(queueName).length === 0 && !currentInst && isLockScreen) {
                    $.unlockScreen();
                    isLockScreen = false;
                }

                $window.off('resize', $.throttle(function () {
                    readjust();
                }, 100));

                if (inst.options.destroyOnClosed) {
                    inst.destroy();
                }
            }
        };

        /**
         * ��ָ���Ի���
         * @private
         */
        Dialog.prototype._doOpen = function () {
            var _this = this;

            currentInst = _this;

            if (!isLockScreen) {
                $.lockScreen();
                isLockScreen = true;
            }

            _this.$dialog.show();

            readjust();
            $window.on('resize', $.throttle(function () {
                readjust();
            }, 100));

            // ����Ϣ��
            _this.state = 'opening';
            componentEvent('open', 'dialog', _this, _this.$dialog);

            _this.$dialog
                .addClass('mdui-dialog-open')
                .transitionEnd(function () {
                    transitionEnd(_this);
                });

            // ���������ֲ�Ԫ��ʱ��������ֲ�
            if (!$overlay) {
                $overlay = $.showOverlay(5100);
            }

            $overlay

            // ������ֲ�ʱ�Ƿ�رնԻ���
            [_this.options.modal ? 'off' : 'on']('click', overlayClick)

                // �Ƿ���ʾ���ֲ㣬����ʾʱ�������ֲ㱳��͸��
                .css('opacity', _this.options.overlay ? '' : 0);

            if (_this.options.history) {
                // ��� hash ��ԭ������ &mdui-dialog����ɾ�������������ʷ��¼����Ȼ�� &mdui-dialog �����޷��ر�
                var hash = location.hash.substring(1);
                if (hash.indexOf('&mdui-dialog') > -1) {
                    hash = hash.replace(/&mdui-dialog/g, '');
                }

                // ���˰�ť�رնԻ���
                location.hash = hash + '&mdui-dialog';
                $window.on('hashchange', hashchangeEvent);
            }
        };

        /**
         * �򿪶Ի���
         */
        Dialog.prototype.open = function () {
            var _this = this;

            if (_this.state === 'opening' || _this.state === 'opened') {
                return;
            }

            // �����ǰ�����ڴ򿪻��Ѿ��򿪵ĶԻ���,����в�Ϊ�գ����ȼ�����У��ȾɶԻ���ʼ�ر�ʱ�ٴ�
            if (
                (currentInst && (currentInst.state === 'opening' || currentInst.state === 'opened')) ||
                queue.queue(queueName).length
            ) {
                queue.queue(queueName, function () {
                    _this._doOpen();
                });

                return;
            }

            _this._doOpen();
        };

        /**
         * �رնԻ���
         */
        Dialog.prototype.close = function () {
            var _this = this;

            // setTimeout �������ǣ�
            // ��ͬʱ�ر�һ���Ի��򣬲�����һ���Ի���ʱ��ʹ�򿪶Ի���Ĳ�����ִ�У���ʹ��Ҫ�򿪵ĶԻ����ȼ������
            setTimeout(function () {
                if (_this.state === 'closing' || _this.state === 'closed') {
                    return;
                }

                currentInst = null;

                _this.state = 'closing';
                componentEvent('close', 'dialog', _this, _this.$dialog);

                // ���жԻ��򶼹رգ��ҵ�ǰû�д򿪵ĶԻ���ʱ����������
                if (queue.queue(queueName).length === 0 && $overlay) {
                    $.hideOverlay();
                    $overlay = null;
                }

                _this.$dialog
                    .removeClass('mdui-dialog-open')
                    .transitionEnd(function () {
                        transitionEnd(_this);
                    });

                if (_this.options.history && queue.queue(queueName).length === 0) {
                    // �Ƿ���Ҫ������ʷ��¼��Ĭ��Ϊ false��
                    // Ϊ false ʱ��ͨ�� js �رգ���Ҫ����һ����ʷ��¼
                    // Ϊ true ʱ��ͨ�����˰�ť�رգ�����Ҫ������ʷ��¼
                    if (!arguments[0]) {
                        window.history.back();
                    }

                    $window.off('hashchange', hashchangeEvent);
                }

                // �رվɶԻ��򣬴��¶Ի���
                // ��һ���ӳ٣�����Ϊ���Ӿ�Ч�����á�������ʱҲ��Ӱ�칦��
                setTimeout(function () {
                    queue.dequeue(queueName);
                }, 100);
            }, 0);
        };

        /**
         * �л��Ի����/�ر�״̬
         */
        Dialog.prototype.toggle = function () {
            var _this = this;

            if (_this.state === 'opening' || _this.state === 'opened') {
                _this.close();
            } else if (_this.state === 'closing' || _this.state === 'closed') {
                _this.open();
            }
        };

        /**
         * ��ȡ�Ի���״̬
         * @returns {'opening'|'opened'|'closing'|'closed'}
         */
        Dialog.prototype.getState = function () {
            return this.state;
        };

        /**
         * ���ٶԻ���
         */
        Dialog.prototype.destroy = function () {
            var _this = this;

            if (_this.append) {
                _this.$dialog.remove();
            }

            _this.$dialog.removeData('mdui.dialog');

            if (queue.queue(queueName).length === 0 && !currentInst) {
                if ($overlay) {
                    $.hideOverlay();
                    $overlay = null;
                }

                if (isLockScreen) {
                    $.unlockScreen();
                    isLockScreen = false;
                }
            }
        };

        /**
         * �Ի������ݱ仯ʱ����Ҫ���ø÷����������Ի���λ�ú͹������߶�
         */
        Dialog.prototype.handleUpdate = function () {
            readjust();
        };

        // esc ����ʱ�رնԻ���
        $document.on('keydown', function (e) {
            if (
                currentInst &&
                currentInst.options.closeOnEsc &&
                currentInst.state === 'opened' &&
                e.keyCode === 27
            ) {
                currentInst.close();
            }
        });

        return Dialog;

    })();


    /**
     * =============================================================================
     * ************   Dialog DATA API   ************
     * =============================================================================
     */

    $(function () {
        $document.on('click', '[mdui-dialog]', function () {
            var $this = $(this);
            var options = parseOptions($this.attr('mdui-dialog'));
            var selector = options.target;
            delete options.target;

            var $dialog = $(selector).eq(0);

            var inst = $dialog.data('mdui.dialog');
            if (!inst) {
                inst = new mdui.Dialog($dialog, options);
                $dialog.data('mdui.dialog', inst);
            }

            inst.open();
        });
    });


    /**
     * =============================================================================
     * ************   mdui.dialog(options)   ************
     * =============================================================================
     */

    mdui.dialog = function (options) {

        /**
         * Ĭ�ϲ���
         */
        var DEFAULT = {
            title: '',                // ����
            content: '',              // �ı�
            buttons: [],              // ��ť
            stackedButtons: false,    // ��ֱ���а�ť
            cssClass: '',             // �� Dialog ����ӵ� CSS ��
            history: true,            // ���� hashchange �¼�
            overlay: true,            // �Ƿ���ʾ����
            modal: false,             // �Ƿ�ģ̬���Ի���
            closeOnEsc: true,         // ���� esc ʱ�رնԻ���
            destroyOnClosed: true,    // �رպ�����
            onOpen: function () {     // �򿪶�����ʼʱ�Ļص�
            },

            onOpened: function () {   // �򿪶���������Ļص�
            },

            onClose: function () {    // �رն�����ʼʱ�Ļص�
            },

            onClosed: function () {   // �رն�������ʱ�Ļص�
            },
        };

        /**
         * ��ť��Ĭ�ϲ���
         */
        var DEFAULT_BUTTON = {
            text: '',                   // ��ť�ı�
            bold: false,                // ��ť�ı��Ƿ�Ӵ�
            close: true,                // �����ť��رնԻ���
            onClick: function (inst) {  // �����ť�Ļص�
            },
        };

        // �ϲ�����
        options = $.extend({}, DEFAULT, (options || {}));
        $.each(options.buttons, function (i, button) {
            options.buttons[i] = $.extend({}, DEFAULT_BUTTON, button);
        });

        // ��ť�� HTML
        var buttonsHTML = '';
        if (options.buttons.length) {
            buttonsHTML =
                '<div class="mdui-dialog-actions ' +
                (options.stackedButtons ? 'mdui-dialog-actions-stacked' : '') +
                '">';
            $.each(options.buttons, function (i, button) {
                buttonsHTML +=
                    '<a href="javascript:void(0)" ' +
                    'class="mdui-btn mdui-ripple mdui-text-color-primary ' +
                    (button.bold ? 'mdui-btn-bold' : '') + '">' +
                    button.text +
                    '</a>';
            });

            buttonsHTML += '</div>';
        }

        // Dialog �� HTML
        var HTML =
            '<div class="mdui-dialog ' + options.cssClass + '">' +
            (options.title ? '<div class="mdui-dialog-title">' + options.title + '</div>' : '') +
            (options.content ? '<div class="mdui-dialog-content">' + options.content + '</div>' : '') +
            buttonsHTML +
            '</div>';

        // ʵ���� Dialog
        var inst = new mdui.Dialog(HTML, {
            history: options.history,
            overlay: options.overlay,
            modal: options.modal,
            closeOnEsc: options.closeOnEsc,
            destroyOnClosed: options.destroyOnClosed,
        });

        // �󶨰�ť�¼�
        if (options.buttons.length) {
            inst.$dialog.find('.mdui-dialog-actions .mdui-btn').each(function (i, button) {
                $(button).on('click', function () {
                    if (typeof options.buttons[i].onClick === 'function') {
                        options.buttons[i].onClick(inst);
                    }

                    if (options.buttons[i].close) {
                        inst.close();
                    }
                });
            });
        }

        // �󶨴򿪹ر��¼�
        if (typeof options.onOpen === 'function') {
            inst.$dialog
                .on('open.mdui.dialog', function () {
                    options.onOpen(inst);
                })
                .on('opened.mdui.dialog', function () {
                    options.onOpened(inst);
                })
                .on('close.mdui.dialog', function () {
                    options.onClose(inst);
                })
                .on('closed.mdui.dialog', function () {
                    options.onClosed(inst);
                });
        }

        inst.open();

        return inst;
    };


    /**
     * =============================================================================
     * ************   mdui.alert(text, title, onConfirm, options)   ************
     * ************   mdui.alert(text, onConfirm, options)   ************
     * =============================================================================
     */

    mdui.alert = function (text, title, onConfirm, options) {

        // title ������ѡ
        if (typeof title === 'function') {
            title = '';
            onConfirm = arguments[1];
            options = arguments[2];
        }

        if (onConfirm === undefined) {
            onConfirm = function () { };
        }

        if (options === undefined) {
            options = {};
        }

        /**
         * Ĭ�ϲ���
         */
        var DEFAULT = {
            confirmText: 'ok',             // ��ť�ϵ��ı�
            history: true,                 // ���� hashchange �¼�
            modal: false,                  // �Ƿ�ģ̬���Ի���Ϊ false ʱ����Ի�����������رնԻ���Ϊ true ʱ���ر�
            closeOnEsc: true,              // ���� esc �رնԻ���
        };

        options = $.extend({}, DEFAULT, options);

        return mdui.dialog({
            title: title,
            content: text,
            buttons: [
                {
                    text: options.confirmText,
                    bold: false,
                    close: true,
                    onClick: onConfirm,
                },
            ],
            cssClass: 'mdui-dialog-alert',
            history: options.history,
            modal: options.modal,
            closeOnEsc: options.closeOnEsc,
        });
    };


    /**
     * =============================================================================
     * ************   mdui.confirm(text, title, onConfirm, onCancel, options)   ************
     * ************   mdui.confirm(text, onConfirm, onCancel, options)          ************
     * =============================================================================
     */

    mdui.confirm = function (text, title, onConfirm, onCancel, options) {

        // title ������ѡ
        if (typeof title === 'function') {
            title = '';
            onConfirm = arguments[1];
            onCancel = arguments[2];
            options = arguments[3];
        }

        if (onConfirm === undefined) {
            onConfirm = function () { };
        }

        if (onCancel === undefined) {
            onCancel = function () { };
        }

        if (options === undefined) {
            options = {};
        }

        /**
         * Ĭ�ϲ���
         */
        var DEFAULT = {
            confirmText: 'ok',            // ȷ�ϰ�ť���ı�
            cancelText: 'cancel',         // ȡ����ť���ı�
            history: true,                // ���� hashchange �¼�
            modal: false,                 // �Ƿ�ģ̬���Ի���Ϊ false ʱ����Ի�����������رնԻ���Ϊ true ʱ���ر�
            closeOnEsc: true,             // ���� esc �رնԻ���
        };

        options = $.extend({}, DEFAULT, options);

        return mdui.dialog({
            title: title,
            content: text,
            buttons: [
                {
                    text: options.cancelText,
                    bold: false,
                    close: true,
                    onClick: onCancel,
                },
                {
                    text: options.confirmText,
                    bold: false,
                    close: true,
                    onClick: onConfirm,
                },
            ],
            cssClass: 'mdui-dialog-confirm',
            history: options.history,
            modal: options.modal,
            closeOnEsc: options.closeOnEsc,
        });
    };


    /**
     * =============================================================================
     * ************   mdui.prompt(label, title, onConfirm, onCancel, options)   ************
     * ************   mdui.prompt(label, onConfirm, onCancel, options)          ************
     * =============================================================================
     */

    mdui.prompt = function (label, title, onConfirm, onCancel, options) {

        // title ������ѡ
        if (typeof title === 'function') {
            title = '';
            onConfirm = arguments[1];
            onCancel = arguments[2];
            options = arguments[3];
        }

        if (onConfirm === undefined) {
            onConfirm = function () { };
        }

        if (onCancel === undefined) {
            onCancel = function () { };
        }

        if (options === undefined) {
            options = {};
        }

        /**
         * Ĭ�ϲ���
         */
        var DEFAULT = {
            confirmText: 'ok',        // ȷ�ϰ�ť���ı�
            cancelText: 'cancel',     // ȡ����ť���ı�
            history: true,            // ���� hashchange �¼�
            modal: false,             // �Ƿ�ģ̬���Ի���Ϊ false ʱ����Ի�����������رնԻ���Ϊ true ʱ���ر�
            closeOnEsc: true,         // ���� esc �رնԻ���
            type: 'text',             // ��������ͣ�text: �����ı��� textarea: �����ı���
            maxlength: '',            // ��������ַ���
            defaultValue: '',         // ������е�Ĭ���ı�
            confirmOnEnter: false,    // ���� enter ȷ����������
        };

        options = $.extend({}, DEFAULT, options);

        var content =
            '<div class="mdui-textfield">' +
            (label ? '<label class="mdui-textfield-label">' + label + '</label>' : '') +
            (options.type === 'text' ?
                '<input class="mdui-textfield-input" type="text" ' +
                'value="' + options.defaultValue + '" ' +
                (options.maxlength ? ('maxlength="' + options.maxlength + '"') : '') + '/>' :
                '') +
            (options.type === 'textarea' ?
                '<textarea class="mdui-textfield-input" ' +
                (options.maxlength ? ('maxlength="' + options.maxlength + '"') : '') + '>' +
                options.defaultValue +
                '</textarea>' :
                '') +
            '</div>';

        return mdui.dialog({
            title: title,
            content: content,
            buttons: [
                {
                    text: options.cancelText,
                    bold: false,
                    close: true,
                    onClick: function (inst) {
                        var value = inst.$dialog.find('.mdui-textfield-input').val();
                        onCancel(value, inst);
                    },
                },
                {
                    text: options.confirmText,
                    bold: false,
                    close: true,
                    onClick: function (inst) {
                        var value = inst.$dialog.find('.mdui-textfield-input').val();
                        onConfirm(value, inst);
                    },
                },
            ],
            cssClass: 'mdui-dialog-prompt',
            history: options.history,
            modal: options.modal,
            closeOnEsc: options.closeOnEsc,
            onOpen: function (inst) {

                // ��ʼ�������
                var $input = inst.$dialog.find('.mdui-textfield-input');
                mdui.updateTextFields($input);

                // �۽��������
                $input[0].focus();

                // ��׽�ı���س������ڵ����ı��������´����ص�
                if (options.type === 'text' && options.confirmOnEnter === true) {
                    $input.on('keydown', function (event) {
                        if (event.keyCode === 13) {
                            var value = inst.$dialog.find('.mdui-textfield-input').val();
                            onConfirm(value, inst);
                            inst.close();
                        }
                    });
                }

                // ����Ƕ�������򣬼��������� input �¼������¶Ի���߶�
                if (options.type === 'textarea') {
                    $input.on('input', function () {
                        inst.handleUpdate();
                    });
                }

                // ���ַ�������ʱ���������ı���� DOM ��仯����Ҫ���¶Ի���߶�
                if (options.maxlength) {
                    inst.handleUpdate();
                }
            },
        });

    };


    /**
     * =============================================================================
     * ************   ToolTip ������ʾ   ************
     * =============================================================================
     */

    mdui.Tooltip = (function () {

        /**
         * Ĭ�ϲ���
         */
        var DEFAULT = {
            position: 'auto',     // ��ʾ����λ��
            delay: 0,             // �ӳ٣���λ����
            content: '',          // ��ʾ�ı���������� HTML
        };

        /**
         * �Ƿ��������豸
         * @returns {boolean}
         */
        var isDesktop = function () {
            return $window.width() > 1024;
        };

        /**
         * ���� Tooltip ��λ��
         * @param inst
         */
        function setPosition(inst) {
            var marginLeft;
            var marginTop;
            var position;

            // ������Ԫ��
            var targetProps = inst.$target[0].getBoundingClientRect();

            // ������Ԫ�غ� Tooltip ֮��ľ���
            var targetMargin = (isDesktop() ? 14 : 24);

            // Tooltip �Ŀ�Ⱥ͸߶�
            var tooltipWidth = inst.$tooltip[0].offsetWidth;
            var tooltipHeight = inst.$tooltip[0].offsetHeight;

            // Tooltip �ķ���
            position = inst.options.position;

            // �Զ��ж�λ�ã��� 2px��ʹ Tooltip ���봰�ڱ߿������� 2px �ļ��
            if (['bottom', 'top', 'left', 'right'].indexOf(position) === -1) {
                if (
                    targetProps.top + targetProps.height + targetMargin + tooltipHeight + 2 <
                    $window.height()
                ) {
                    position = 'bottom';
                } else if (targetMargin + tooltipHeight + 2 < targetProps.top) {
                    position = 'top';
                } else if (targetMargin + tooltipWidth + 2 < targetProps.left) {
                    position = 'left';
                } else if (
                    targetProps.width + targetMargin + tooltipWidth + 2 <
                    $window.width() - targetProps.left
                ) {
                    position = 'right';
                } else {
                    position = 'bottom';
                }
            }

            // ����λ��
            switch (position) {
                case 'bottom':
                    marginLeft = -1 * (tooltipWidth / 2);
                    marginTop = (targetProps.height / 2) + targetMargin;
                    inst.$tooltip.transformOrigin('top center');
                    break;
                case 'top':
                    marginLeft = -1 * (tooltipWidth / 2);
                    marginTop = -1 * (tooltipHeight + (targetProps.height / 2) + targetMargin);
                    inst.$tooltip.transformOrigin('bottom center');
                    break;
                case 'left':
                    marginLeft = -1 * (tooltipWidth + (targetProps.width / 2) + targetMargin);
                    marginTop = -1 * (tooltipHeight / 2);
                    inst.$tooltip.transformOrigin('center right');
                    break;
                case 'right':
                    marginLeft = (targetProps.width / 2) + targetMargin;
                    marginTop = -1 * (tooltipHeight / 2);
                    inst.$tooltip.transformOrigin('center left');
                    break;
            }

            var targetOffset = inst.$target.offset();
            inst.$tooltip.css({
                top: targetOffset.top + (targetProps.height / 2) + 'px',
                left: targetOffset.left + (targetProps.width / 2) + 'px',
                'margin-left': marginLeft + 'px',
                'margin-top': marginTop + 'px',
            });
        }

        /**
         * Tooltip ʵ��
         * @param selector
         * @param opts
         * @constructor
         */
        function Tooltip(selector, opts) {
            var _this = this;

            _this.$target = $(selector).eq(0);
            if (!_this.$target.length) {
                return;
            }

            // ��ͨ�� data ����ʵ�������������ظ�ʵ����
            var oldInst = _this.$target.data('mdui.tooltip');
            if (oldInst) {
                return oldInst;
            }

            _this.options = $.extend({}, DEFAULT, (opts || {}));
            _this.state = 'closed';

            // ���� Tooltip HTML
            _this.$tooltip = $(
                '<div class="mdui-tooltip" id="' + $.guid() + '">' +
                _this.options.content +
                '</div>'
            ).appendTo(document.body);

            // ���¼���Ԫ�ش��� disabled ״̬ʱ�޷���������¼���Ϊ��ͳһ���� touch �¼�Ҳ����
            _this.$target
                .on('touchstart mouseenter', function (e) {
                    if (this.disabled) {
                        return;
                    }

                    if (!TouchHandler.isAllow(e)) {
                        return;
                    }

                    TouchHandler.register(e);

                    _this.open();
                })
                .on('touchend mouseleave', function (e) {
                    if (this.disabled) {
                        return;
                    }

                    if (!TouchHandler.isAllow(e)) {
                        return;
                    }

                    _this.close();
                })
                .on(TouchHandler.unlock, function (e) {
                    if (this.disabled) {
                        return;
                    }

                    TouchHandler.register(e);
                });
        }

        /**
         * ���������ص�
         * @private
         */
        var transitionEnd = function (inst) {
            if (inst.$tooltip.hasClass('mdui-tooltip-open')) {
                inst.state = 'opened';
                componentEvent('opened', 'tooltip', inst, inst.$target);
            } else {
                inst.state = 'closed';
                componentEvent('closed', 'tooltip', inst, inst.$target);
            }
        };

        /**
         * ִ�д� Tooltip
         * @private
         */
        Tooltip.prototype._doOpen = function () {
            var _this = this;

            _this.state = 'opening';
            componentEvent('open', 'tooltip', _this, _this.$target);

            _this.$tooltip
                .addClass('mdui-tooltip-open')
                .transitionEnd(function () {
                    transitionEnd(_this);
                });
        };

        /**
         * �� Tooltip
         * @param opts ����ÿ�δ�ʱ���ò�ͬ�Ĳ���
         */
        Tooltip.prototype.open = function (opts) {
            var _this = this;

            if (_this.state === 'opening' || _this.state === 'opened') {
                return;
            }

            var oldOpts = $.extend({}, _this.options);

            // �ϲ� data ���Բ���
            $.extend(_this.options, parseOptions(_this.$target.attr('mdui-tooltip')));
            if (opts) {
                $.extend(_this.options, opts);
            }

            // tooltip �������и���
            if (oldOpts.content !== _this.options.content) {
                _this.$tooltip.html(_this.options.content);
            }

            setPosition(_this);

            if (_this.options.delay) {
                _this.timeoutId = setTimeout(function () {
                    _this._doOpen();
                }, _this.options.delay);
            } else {
                _this.timeoutId = false;
                _this._doOpen();
            }
        };

        /**
         * �ر� Tooltip
         */
        Tooltip.prototype.close = function () {
            var _this = this;

            if (_this.timeoutId) {
                clearTimeout(_this.timeoutId);
                _this.timeoutId = false;
            }

            if (_this.state === 'closing' || _this.state === 'closed') {
                return;
            }

            _this.state = 'closing';
            componentEvent('close', 'tooltip', _this, _this.$target);

            _this.$tooltip
                .removeClass('mdui-tooltip-open')
                .transitionEnd(function () {
                    transitionEnd(_this);
                });
        };

        /**
         * �л� Tooltip ״̬
         */
        Tooltip.prototype.toggle = function () {
            var _this = this;

            if (_this.state === 'opening' || _this.state === 'opened') {
                _this.close();
            } else if (_this.state === 'closing' || _this.state === 'closed') {
                _this.open();
            }
        };

        /**
         * ��ȡ Tooltip ״̬
         * @returns {'opening'|'opened'|'closing'|'closed'}
         */
        Tooltip.prototype.getState = function () {
            return this.state;
        };

        /**
         * ���� Tooltip
         */
        /*Tooltip.prototype.destroy = function () {
          var _this = this;
          clearTimeout(_this.timeoutId);
          $.data(_this.target, 'mdui.tooltip', null);
          $.remove(_this.tooltip);
        };*/

        return Tooltip;

    })();


    /**
     * =============================================================================
     * ************   Tooltip DATA API   ************
     * =============================================================================
     */

    $(function () {
        // mouseenter ����ð�ݣ����������� mouseover ����
        $document.on('touchstart mouseover', '[mdui-tooltip]', function () {
            var $this = $(this);

            var inst = $this.data('mdui.tooltip');
            if (!inst) {
                var options = parseOptions($this.attr('mdui-tooltip'));
                inst = new mdui.Tooltip($this, options);
                $this.data('mdui.tooltip', inst);
            }
        });
    });


    /**
     * =============================================================================
     * ************   Snackbar   ************
     * =============================================================================
     */

    (function () {

        /**
         * ��ǰ���ŵ� Snackbar
         */
        var currentInst;

        /**
         * ������
         * @type {string}
         */
        var queueName = '__md_snackbar';

        var DEFAULT = {
            timeout: 4000,                  // ���û�û�в���ʱ�೤ʱ���Զ�����
            buttonText: '',                 // ��ť���ı�
            buttonColor: '',                // ��ť����ɫ��֧�� blue #90caf9 rgba(...)
            position: 'bottom',             // λ�� bottom��top��left-top��left-bottom��right-top��right-bottom
            closeOnButtonClick: true,       // �����ťʱ�ر�
            closeOnOutsideClick: true,      // ����������Ļ�����ط�ʱ�ر�
            onClick: function () {          // �� Snackbar �ϵ���Ļص�
            },

            onButtonClick: function () {    // �����ť�Ļص�
            },

            onOpen: function () {           // �򿪶�����ʼʱ�Ļص�
            },

            onOpened: function () {         // �򿪶�������ʱ�Ļص�
            },

            onClose: function () {          // �رն�����ʼʱ�Ļص�
            },

            onClosed: function () {         // �򿪶�������ʱ�Ļص�
            },
        };

        /**
         * ��� Snackbar ���������ر�
         * @param e
         */
        var closeOnOutsideClick = function (e) {
            var $target = $(e.target);
            if (!$target.hasClass('mdui-snackbar') && !$target.parents('.mdui-snackbar').length) {
                currentInst.close();
            }
        };

        /**
         * Snackbar ʵ��
         * @param message
         * @param opts
         * @constructor
         */
        function Snackbar(message, opts) {
            var _this = this;

            _this.message = message;
            _this.options = $.extend({}, DEFAULT, (opts || {}));

            // message ��������
            if (!_this.message) {
                return;
            }

            _this.state = 'closed';

            _this.timeoutId = false;

            // ��ť��ɫ
            var buttonColorStyle = '';
            var buttonColorClass = '';

            if (
                _this.options.buttonColor.indexOf('#') === 0 ||
                _this.options.buttonColor.indexOf('rgb') === 0
            ) {
                buttonColorStyle = 'style="color:' + _this.options.buttonColor + '"';
            } else if (_this.options.buttonColor !== '') {
                buttonColorClass = 'mdui-text-color-' + _this.options.buttonColor;
            }

            // ��� HTML
            _this.$snackbar = $(
                '<div class="mdui-snackbar">' +
                '<div class="mdui-snackbar-text">' +
                _this.message +
                '</div>' +
                (_this.options.buttonText ?
                    ('<a href="javascript:void(0)" ' +
                        'class="mdui-snackbar-action mdui-btn mdui-ripple mdui-ripple-white ' +
                        buttonColorClass + '" ' +
                        buttonColorStyle + '>' +
                        _this.options.buttonText +
                        '</a>') :
                    ''
                ) +
                '</div>')
                .appendTo(document.body);

            // ����λ��
            _this._setPosition('close');

            _this.$snackbar
                .reflow()
                .addClass('mdui-snackbar-' + _this.options.position);
        }

        /**
         * ���� Snackbar ��λ��
         * @param state
         * @private
         */
        Snackbar.prototype._setPosition = function (state) {
            var _this = this;

            var snackbarHeight = _this.$snackbar[0].clientHeight;
            var position = _this.options.position;

            var translateX;
            var translateY;

            // translateX
            if (position === 'bottom' || position === 'top') {
                translateX = '-50%';
            } else {
                translateX = '0';
            }

            // translateY
            if (state === 'open') {
                translateY = '0';
            } else {
                if (position === 'bottom') {
                    translateY = snackbarHeight;
                }

                if (position === 'top') {
                    translateY = -snackbarHeight;
                }

                if (position === 'left-top' || position === 'right-top') {
                    translateY = -snackbarHeight - 24;
                }

                if (position === 'left-bottom' || position === 'right-bottom') {
                    translateY = snackbarHeight + 24;
                }
            }

            _this.$snackbar.transform('translate(' + translateX + ',' + translateY + 'px)');
        };

        /**
         * �� Snackbar
         */
        Snackbar.prototype.open = function () {
            var _this = this;

            if (!_this.message) {
                return;
            }

            if (_this.state === 'opening' || _this.state === 'opened') {
                return;
            }

            // �����ǰ��������ʾ�� Snackbar�����ȼ�����У��Ⱦ� Snackbar �رպ��ٴ�
            if (currentInst) {
                queue.queue(queueName, function () {
                    _this.open();
                });

                return;
            }

            currentInst = _this;

            // ��ʼ��
            _this.state = 'opening';
            _this.options.onOpen();

            _this._setPosition('open');

            _this.$snackbar
                .transitionEnd(function () {
                    if (_this.state !== 'opening') {
                        return;
                    }

                    _this.state = 'opened';
                    _this.options.onOpened();

                    // �а�ťʱ���¼�
                    if (_this.options.buttonText) {
                        _this.$snackbar
                            .find('.mdui-snackbar-action')
                            .on('click', function () {
                                _this.options.onButtonClick();
                                if (_this.options.closeOnButtonClick) {
                                    _this.close();
                                }
                            });
                    }

                    // ��� snackbar ���¼�
                    _this.$snackbar.on('click', function (e) {
                        if (!$(e.target).hasClass('mdui-snackbar-action')) {
                            _this.options.onClick();
                        }
                    });

                    // ��� Snackbar ���������ر�
                    if (_this.options.closeOnOutsideClick) {
                        $document.on(TouchHandler.start, closeOnOutsideClick);
                    }

                    // ��ʱ���Զ��ر�
                    if (_this.options.timeout) {
                        _this.timeoutId = setTimeout(function () {
                            _this.close();
                        }, _this.options.timeout);
                    }
                });
        };

        /**
         * �ر� Snackbar
         */
        Snackbar.prototype.close = function () {
            var _this = this;

            if (!_this.message) {
                return;
            }

            if (_this.state === 'closing' || _this.state === 'closed') {
                return;
            }

            if (_this.timeoutId) {
                clearTimeout(_this.timeoutId);
            }

            if (_this.options.closeOnOutsideClick) {
                $document.off(TouchHandler.start, closeOnOutsideClick);
            }

            _this.state = 'closing';
            _this.options.onClose();

            _this._setPosition('close');

            _this.$snackbar
                .transitionEnd(function () {
                    if (_this.state !== 'closing') {
                        return;
                    }

                    currentInst = null;
                    _this.state = 'closed';
                    _this.options.onClosed();
                    _this.$snackbar.remove();
                    queue.dequeue(queueName);
                });
        };

        /**
         * �� Snackbar
         * @param message
         * @param opts
         */
        mdui.snackbar = function (message, opts) {
            if (typeof message !== 'string') {
                opts = message;
                message = opts.message;
            }

            var inst = new Snackbar(message, opts);

            inst.open();
            return inst;
        };

    })();


    /**
     * =============================================================================
     * ************   Bottom navigation �ײ�������   ************
     * =============================================================================
     */

    (function () {

        // �л�������
        $document.on('click', '.mdui-bottom-nav>a', function () {
            var $this = $(this);
            var $bottomNav = $this.parent();
            var isThis;
            $bottomNav.children('a').each(function (i, item) {
                isThis = $this.is(item);
                if (isThis) {
                    componentEvent('change', 'bottomNav', null, $bottomNav, {
                        index: i,
                    });
                }

                $(item)[isThis ? 'addClass' : 'removeClass']('mdui-bottom-nav-active');
            });
        });

        // ����ʱ���� mdui-bottom-nav-scroll-hide
        mdui.mutation('.mdui-bottom-nav-scroll-hide', function () {
            var $this = $(this);
            var inst = new mdui.Headroom($this, {
                pinnedClass: 'mdui-headroom-pinned-down',
                unpinnedClass: 'mdui-headroom-unpinned-down',
            });
            $this.data('mdui.headroom', inst);
        });

    })();


    /**
     * =============================================================================
     * ************   Spinner Բ�ν�����   ************
     * =============================================================================
     */

    (function () {
        /**
         * layer �� HTML �ṹ
         */
        var layerHTML = function () {
            var i = arguments.length ? arguments[0] : false;

            return '<div class="mdui-spinner-layer ' + (i ? 'mdui-spinner-layer-' + i : '') + '">' +
                '<div class="mdui-spinner-circle-clipper mdui-spinner-left">' +
                '<div class="mdui-spinner-circle"></div>' +
                '</div>' +
                '<div class="mdui-spinner-gap-patch">' +
                '<div class="mdui-spinner-circle"></div>' +
                '</div>' +
                '<div class="mdui-spinner-circle-clipper mdui-spinner-right">' +
                '<div class="mdui-spinner-circle"></div>' +
                '</div>' +
                '</div>';
        };

        /**
         * ��� HTML
         * @param spinner
         */
        var fillHTML = function (spinner) {
            var $spinner = $(spinner);
            var layer;
            if ($spinner.hasClass('mdui-spinner-colorful')) {
                layer = layerHTML('1') + layerHTML('2') + layerHTML('3') + layerHTML('4');
            } else {
                layer = layerHTML();
            }

            $spinner.html(layer);
        };

        /**
         * ҳ���������Զ���� HTML �ṹ
         */
        mdui.mutation('.mdui-spinner', function () {
            fillHTML(this);
        });

        /**
         * ����Բ�ν�����
         */
        mdui.updateSpinners = function () {
            $(arguments.length ? arguments[0] : '.mdui-spinner').each(function () {
                fillHTML(this);
            });
        };

    })();



    /**
     * =============================================================================
     * ************   Expansion panel ����չ���   ************
     * =============================================================================
     */

    mdui.Panel = (function () {

        function Panel(selector, opts) {
            return new CollapsePrivate(selector, opts, 'panel');
        }

        return Panel;

    })();


    /**
     * =============================================================================
     * ************   Expansion panel �Զ�������   ************
     * =============================================================================
     */

    $(function () {
        mdui.mutation('[mdui-panel]', function () {
            var $target = $(this);

            var inst = $target.data('mdui.panel');
            if (!inst) {
                var options = parseOptions($target.attr('mdui-panel'));
                inst = new mdui.Panel($target, options);
                $target.data('mdui.panel', inst);
            }
        });
    });


    /**
     * =============================================================================
     * ************   Menu �˵�   ************
     * =============================================================================
     */

    mdui.Menu = (function () {

        /**
         * Ĭ�ϲ���
         */
        var DEFAULT = {
            position: 'auto',         // �˵�λ�� top��bottom��center��auto
            align: 'auto',            // �˵��ʹ�������Ԫ�صĶ��뷽ʽ left��right��center��auto
            gutter: 16,               // �˵����봰�ڱ�Ե����С���룬��λ px
            fixed: false,             // �Ƿ�ʹ�˵��̶��ڴ��ڣ��������������
            covered: 'auto',          // �˵��Ƿ񸲸��ڴ�������Ԫ���ϣ�true��false��auto ʱ�򵥲˵����ǣ������˵�������
            subMenuTrigger: 'hover',  // �Ӳ˵��Ĵ�����ʽ hover��click
            subMenuDelay: 200,        // �Ӳ˵��Ĵ�����ʱ������ submenuTrigger Ϊ hover ��Ч
        };

        /**
         * �������˵�λ��
         * @param _this ʵ��
         */
        var readjust = function (_this) {
            var menuLeft;
            var menuTop;

            // �˵�λ�úͷ���
            var position;
            var align;

            // window ���ڵĿ�Ⱥ͸߶�
            var windowHeight = $window.height();
            var windowWidth = $window.width();

            // ���ò���
            var gutter = _this.options.gutter;
            var isCovered = _this.isCovered;
            var isFixed = _this.options.fixed;

            // �����������
            var transformOriginX;
            var transformOriginY;

            // �˵���ԭʼ��Ⱥ͸߶�
            var menuWidth = _this.$menu.width();
            var menuHeight = _this.$menu.height();

            var $anchor = _this.$anchor;

            // �����˵���Ԫ���ڴ����е�λ��
            var anchorTmp = $anchor[0].getBoundingClientRect();
            var anchorTop = anchorTmp.top;
            var anchorLeft = anchorTmp.left;
            var anchorHeight = anchorTmp.height;
            var anchorWidth = anchorTmp.width;
            var anchorBottom = windowHeight - anchorTop - anchorHeight;
            var anchorRight = windowWidth - anchorLeft - anchorWidth;

            // ����Ԫ�������ӵ�ж�λ���Եĸ�Ԫ�ص�λ��
            var anchorOffsetTop = $anchor[0].offsetTop;
            var anchorOffsetLeft = $anchor[0].offsetLeft;

            // ===============================
            // ================= �Զ��жϲ˵�λ��
            // ===============================
            if (_this.options.position === 'auto') {

                // �ж��·��Ƿ�ŵ��²˵�
                if (anchorBottom + (isCovered ? anchorHeight : 0) > menuHeight + gutter) {
                    position = 'bottom';
                }

                // �ж��Ϸ��Ƿ�ŵ��²˵�
                else if (anchorTop + (isCovered ? anchorHeight : 0) > menuHeight + gutter) {
                    position = 'top';
                }

                // ���¶��Ų��£�������ʾ
                else {
                    position = 'center';
                }
            } else {
                position = _this.options.position;
            }

            // ===============================
            // ============== �Զ��жϲ˵����뷽ʽ
            // ===============================
            if (_this.options.align === 'auto') {

                // �ж��Ҳ��Ƿ�ŵ��²˵�
                if (anchorRight + anchorWidth > menuWidth + gutter) {
                    align = 'left';
                }

                // �ж�����Ƿ�ŵ��²˵�
                else if (anchorLeft + anchorWidth > menuWidth + gutter) {
                    align = 'right';
                }

                // ���Ҷ��Ų��£�������ʾ
                else {
                    align = 'center';
                }
            } else {
                align = _this.options.align;
            }

            // ===============================
            // ==================== ���ò˵�λ��
            // ===============================
            if (position === 'bottom') {
                transformOriginY = '0';

                menuTop =
                    (isCovered ? 0 : anchorHeight) +
                    (isFixed ? anchorTop : anchorOffsetTop);

            } else if (position === 'top') {
                transformOriginY = '100%';

                menuTop =
                    (isCovered ? anchorHeight : 0) +
                    (isFixed ? (anchorTop - menuHeight) : (anchorOffsetTop - menuHeight));

            } else {
                transformOriginY = '50%';

                // =====================�ڴ����о���
                // ��ʾ�Ĳ˵��ĸ߶ȣ��򵥲˵��߶Ȳ��������ڸ߶ȣ������������ڲ˵��ڲ���ʾ������
                // �����˵��ڲ���������ֹ�����
                var menuHeightTemp = menuHeight;

                // �򵥲˵��ȴ��ڸ�ʱ�����Ʋ˵��߶�
                if (!_this.isCascade) {
                    if (menuHeight + gutter * 2 > windowHeight) {
                        menuHeightTemp = windowHeight - gutter * 2;
                        _this.$menu.height(menuHeightTemp);
                    }
                }

                menuTop =
                    (windowHeight - menuHeightTemp) / 2 +
                    (isFixed ? 0 : (anchorOffsetTop - anchorTop));
            }

            _this.$menu.css('top', menuTop + 'px');

            // ===============================
            // ================= ���ò˵����뷽ʽ
            // ===============================
            if (align === 'left') {
                transformOriginX = '0';

                menuLeft = isFixed ? anchorLeft : anchorOffsetLeft;

            } else if (align === 'right') {
                transformOriginX = '100%';

                menuLeft = isFixed ?
                    (anchorLeft + anchorWidth - menuWidth) :
                    (anchorOffsetLeft + anchorWidth - menuWidth);
            } else {
                transformOriginX = '50%';

                //=======================�ڴ����о���
                // ��ʾ�Ĳ˵��Ŀ�ȣ��˵���Ȳ��ܳ������ڿ��
                var menuWidthTemp = menuWidth;

                // �˵��ȴ��ڿ����Ʋ˵����
                if (menuWidth + gutter * 2 > windowWidth) {
                    menuWidthTemp = windowWidth - gutter * 2;
                    _this.$menu.width(menuWidthTemp);
                }

                menuLeft =
                    (windowWidth - menuWidthTemp) / 2 +
                    (isFixed ? 0 : anchorOffsetLeft - anchorLeft);
            }

            _this.$menu.css('left', menuLeft + 'px');

            // ���ò˵���������
            _this.$menu.transformOrigin(transformOriginX + ' ' + transformOriginY);
        };

        /**
         * �����Ӳ˵���λ��
         * @param $submenu
         */
        var readjustSubmenu = function ($submenu) {
            var $item = $submenu.parent('.mdui-menu-item');

            var submenuTop;
            var submenuLeft;

            // �Ӳ˵�λ�úͷ���
            var position; // top��bottom
            var align; // left��right

            // window ���ڵĿ�Ⱥ͸߶�
            var windowHeight = $window.height();
            var windowWidth = $window.width();

            // �����������
            var transformOriginX;
            var transformOriginY;

            // �Ӳ˵���ԭʼ��Ⱥ͸߶�
            var submenuWidth = $submenu.width();
            var submenuHeight = $submenu.height();

            // �����Ӳ˵��Ĳ˵���Ŀ�ȸ߶�
            var itemTmp = $item[0].getBoundingClientRect();
            var itemWidth = itemTmp.width;
            var itemHeight = itemTmp.height;
            var itemLeft = itemTmp.left;
            var itemTop = itemTmp.top;

            // ===================================
            // ===================== �жϲ˵�����λ��
            // ===================================

            // �ж��·��Ƿ�ŵ��²˵�
            if (windowHeight - itemTop > submenuHeight) {
                position = 'bottom';
            }

            // �ж��Ϸ��Ƿ�ŵ��²˵�
            else if (itemTop + itemHeight > submenuHeight) {
                position = 'top';
            }

            // Ĭ�Ϸ����·�
            else {
                position = 'bottom';
            }

            // ====================================
            // ====================== �жϲ˵�����λ��
            // ====================================

            // �ж��Ҳ��Ƿ�ŵ��²˵�
            if (windowWidth - itemLeft - itemWidth > submenuWidth) {
                align = 'left';
            }

            // �ж�����Ƿ�ŵ��²˵�
            else if (itemLeft > submenuWidth) {
                align = 'right';
            }

            // Ĭ�Ϸ����Ҳ�
            else {
                align = 'left';
            }

            // ===================================
            // ======================== ���ò˵�λ��
            // ===================================
            if (position === 'bottom') {
                transformOriginY = '0';
                submenuTop = '0';
            } else if (position === 'top') {
                transformOriginY = '100%';
                submenuTop = -submenuHeight + itemHeight;
            }

            $submenu.css('top', submenuTop + 'px');

            // ===================================
            // ===================== ���ò˵����뷽ʽ
            // ===================================
            if (align === 'left') {
                transformOriginX = '0';
                submenuLeft = itemWidth;
            } else if (align === 'right') {
                transformOriginX = '100%';
                submenuLeft = -submenuWidth;
            }

            $submenu.css('left', submenuLeft + 'px');

            // ���ò˵���������
            $submenu.transformOrigin(transformOriginX + ' ' + transformOriginY);
        };

        /**
         * ���Ӳ˵�
         * @param $submenu
         */
        var openSubMenu = function ($submenu) {
            readjustSubmenu($submenu);

            $submenu
                .addClass('mdui-menu-open')
                .parent('.mdui-menu-item')
                .addClass('mdui-menu-item-active');
        };

        /**
         * �ر��Ӳ˵�������Ƕ�׵��Ӳ˵�
         * @param $submenu
         */
        var closeSubMenu = function ($submenu) {
            // �ر��Ӳ˵�
            $submenu
                .removeClass('mdui-menu-open')
                .addClass('mdui-menu-closing')
                .transitionEnd(function () {
                    $submenu.removeClass('mdui-menu-closing');
                })

                // �Ƴ�����״̬����ʽ
                .parent('.mdui-menu-item')
                .removeClass('mdui-menu-item-active');

            // ѭ���ر�Ƕ�׵��Ӳ˵�
            $submenu.find('.mdui-menu').each(function () {
                var $subSubmenu = $(this);
                $subSubmenu
                    .removeClass('mdui-menu-open')
                    .addClass('mdui-menu-closing')
                    .transitionEnd(function () {
                        $subSubmenu.removeClass('mdui-menu-closing');
                    })
                    .parent('.mdui-menu-item')
                    .removeClass('mdui-menu-item-active');
            });
        };

        /**
         * �л��Ӳ˵�״̬
         * @param $submenu
         */
        var toggleSubMenu = function ($submenu) {
            if ($submenu.hasClass('mdui-menu-open')) {
                closeSubMenu($submenu);
            } else {
                openSubMenu($submenu);
            }
        };

        /**
         * ���Ӳ˵��¼�
         * @param inst ʵ��
         */
        var bindSubMenuEvent = function (inst) {
            // ������Ӳ˵�
            inst.$menu.on('click', '.mdui-menu-item', function (e) {
                var $this = $(this);
                var $target = $(e.target);

                // ����״̬�˵�������
                if ($this.attr('disabled') !== null) {
                    return;
                }

                // û�е�����Ӳ˵��Ĳ˵�����ʱ�����������������Ӳ˵��Ŀհ����򡢻�ָ����ϣ�
                if ($target.is('.mdui-menu') || $target.is('.mdui-divider')) {
                    return;
                }

                // ��ֹð�ݣ�����˵���ʱֻ�����һ���� mdui-menu-item ����Ч��������ð��
                if (!$target.parents('.mdui-menu-item').eq(0).is($this)) {
                    return;
                }

                // ��ǰ�˵����Ӳ˵�
                var $submenu = $this.children('.mdui-menu');

                // �ȹرճ���ǰ�Ӳ˵��������ͬ���Ӳ˵�
                $this.parent('.mdui-menu').children('.mdui-menu-item').each(function () {
                    var $tmpSubmenu = $(this).children('.mdui-menu');
                    if (
                        $tmpSubmenu.length &&
                        (!$submenu.length || !$tmpSubmenu.is($submenu))
                    ) {
                        closeSubMenu($tmpSubmenu);
                    }
                });

                // �л���ǰ�Ӳ˵�
                if ($submenu.length) {
                    toggleSubMenu($submenu);
                }
            });

            if (inst.options.subMenuTrigger === 'hover') {
                // ��ʱ�洢 setTimeout ����
                var timeout;

                var timeoutOpen;
                var timeoutClose;

                inst.$menu.on('mouseover mouseout', '.mdui-menu-item', function (e) {
                    var $this = $(this);
                    var eventType = e.type;
                    var $relatedTarget = $(e.relatedTarget);

                    // ����״̬�Ĳ˵�������
                    if ($this.attr('disabled') !== null) {
                        return;
                    }

                    // �� mouseover ģ�� mouseenter
                    if (eventType === 'mouseover') {
                        if (!$this.is($relatedTarget) && $.contains($this[0], $relatedTarget[0])) {
                            return;
                        }
                    }

                    // �� mouseout ģ�� mouseleave
                    else if (eventType === 'mouseout') {
                        if ($this.is($relatedTarget) || $.contains($this[0], $relatedTarget[0])) {
                            return;
                        }
                    }

                    // ��ǰ�˵����µ��Ӳ˵���δ�ش���
                    var $submenu = $this.children('.mdui-menu');

                    // �������˵���ʱ����ʾ�˵����µ��Ӳ˵�
                    if (eventType === 'mouseover') {
                        if ($submenu.length) {

                            // ��ǰ�Ӳ˵�׼����ʱ�������ǰ�Ӳ˵���׼���Źرգ������ٹر���
                            var tmpClose = $submenu.data('timeoutClose.mdui.menu');
                            if (tmpClose) {
                                clearTimeout(tmpClose);
                            }

                            // �����ǰ�Ӳ˵��Ѿ��򿪣�������
                            if ($submenu.hasClass('mdui-menu-open')) {
                                return;
                            }

                            // ��ǰ�Ӳ˵�׼����ʱ������׼���򿪵��Ӳ˵������ٴ���
                            clearTimeout(timeoutOpen);

                            // ׼���򿪵�ǰ�Ӳ˵�
                            timeout = timeoutOpen = setTimeout(function () {
                                openSubMenu($submenu);
                            }, inst.options.subMenuDelay);

                            $submenu.data('timeoutOpen.mdui.menu', timeout);
                        }
                    }

                    // ����Ƴ��˵���ʱ���رղ˵����µ��Ӳ˵�
                    else if (eventType === 'mouseout') {
                        if ($submenu.length) {

                            // ����Ƴ��˵���ʱ�������ǰ�˵����µ��Ӳ˵���׼���򿪣������ٴ���
                            var tmpOpen = $submenu.data('timeoutOpen.mdui.menu');
                            if (tmpOpen) {
                                clearTimeout(tmpOpen);
                            }

                            // ׼���رյ�ǰ�Ӳ˵�
                            timeout = timeoutClose = setTimeout(function () {
                                closeSubMenu($submenu);
                            }, inst.options.subMenuDelay);

                            $submenu.data('timeoutClose.mdui.menu', timeout);
                        }
                    }
                });
            }
        };

        /**
         * �˵�
         * @param anchorSelector �����Ԫ�ش����˵�
         * @param menuSelector �˵�
         * @param opts ������
         * @constructor
         */
        function Menu(anchorSelector, menuSelector, opts) {
            var _this = this;

            // �����˵���Ԫ��
            _this.$anchor = $(anchorSelector).eq(0);
            if (!_this.$anchor.length) {
                return;
            }

            // ��ͨ���Զ�������ʵ�������������ظ�ʵ����
            var oldInst = _this.$anchor.data('mdui.menu');
            if (oldInst) {
                return oldInst;
            }

            _this.$menu = $(menuSelector).eq(0);

            // �����˵���Ԫ�� �� �˵�������ͬ����Ԫ�أ�����˵����ܲ��ܶ�λ
            if (!_this.$anchor.siblings(_this.$menu).length) {
                return;
            }

            _this.options = $.extend({}, DEFAULT, (opts || {}));
            _this.state = 'closed';

            // �Ƿ��Ǽ����˵�
            _this.isCascade = _this.$menu.hasClass('mdui-menu-cascade');

            // covered ��������
            if (_this.options.covered === 'auto') {
                _this.isCovered = !_this.isCascade;
            } else {
                _this.isCovered = _this.options.covered;
            }

            // ��������˵��л�
            _this.$anchor.on('click', function () {
                _this.toggle();
            });

            // ����˵���������رղ˵�
            $document.on('click touchstart', function (e) {
                var $target = $(e.target);
                if (
                    (_this.state === 'opening' || _this.state === 'opened') &&
                    !$target.is(_this.$menu) &&
                    !$.contains(_this.$menu[0], $target[0]) &&
                    !$target.is(_this.$anchor) &&
                    !$.contains(_this.$anchor[0], $target[0])
                ) {
                    _this.close();
                }
            });

            // ��������Ӳ˵��Ĳ˵���Ŀ�رղ˵�
            $document.on('click', '.mdui-menu-item', function (e) {
                var $this = $(this);
                if (!$this.find('.mdui-menu').length && $this.attr('disabled') === null) {
                    _this.close();
                }
            });

            // �󶨵����������뺬�Ӳ˵�����Ŀ���¼�
            bindSubMenuEvent(_this);

            // ���ڴ�С�仯ʱ�����µ����˵�λ��
            $window.on('resize', $.throttle(function () {
                readjust(_this);
            }, 100));
        }

        /**
         * �л��˵�״̬
         */
        Menu.prototype.toggle = function () {
            var _this = this;

            if (_this.state === 'opening' || _this.state === 'opened') {
                _this.close();
            } else if (_this.state === 'closing' || _this.state === 'closed') {
                _this.open();
            }
        };

        /**
         * ���������ص�
         * @param inst
         */
        var transitionEnd = function (inst) {
            inst.$menu.removeClass('mdui-menu-closing');

            if (inst.state === 'opening') {
                inst.state = 'opened';
                componentEvent('opened', 'menu', inst, inst.$menu);
            }

            if (inst.state === 'closing') {
                inst.state = 'closed';
                componentEvent('closed', 'menu', inst, inst.$menu);

                // �رպ󣬻ָ��˵���ʽ��Ĭ��״̬�����ָ� fixed ��λ
                inst.$menu.css({
                    top: '',
                    left: '',
                    width: '',
                    position: 'fixed',
                });
            }
        };

        /**
         * �򿪲˵�
         */
        Menu.prototype.open = function () {
            var _this = this;

            if (_this.state === 'opening' || _this.state === 'opened') {
                return;
            }

            _this.state = 'opening';
            componentEvent('open', 'menu', _this, _this.$menu);

            // �����˵�λ��
            readjust(_this);

            _this.$menu

                // �˵�����״̬ʹ��ʹ�� fixed ��λ��
                .css('position', _this.options.fixed ? 'fixed' : 'absolute')

                // �򿪲˵�
                .addClass('mdui-menu-open')

                // �򿪶�����ɺ�
                .transitionEnd(function () {
                    transitionEnd(_this);
                });
        };

        /**
         * �رղ˵�
         */
        Menu.prototype.close = function () {
            var _this = this;
            if (_this.state === 'closing' || _this.state === 'closed') {
                return;
            }

            _this.state = 'closing';
            componentEvent('close', 'menu', _this, _this.$menu);

            // �˵���ʼ�ر�ʱ���ر������Ӳ˵�
            _this.$menu.find('.mdui-menu').each(function () {
                closeSubMenu($(this));
            });

            _this.$menu
                .removeClass('mdui-menu-open')
                .addClass('mdui-menu-closing')
                .transitionEnd(function () {
                    transitionEnd(_this);
                });
        };

        return Menu;
    })();


    /**
     * =============================================================================
     * ************   Menu �Զ������� API   ************
     * =============================================================================
     */

    $(function () {
        $document.on('click', '[mdui-menu]', function () {
            var $this = $(this);

            var inst = $this.data('mdui.menu');
            if (!inst) {
                var options = parseOptions($this.attr('mdui-menu'));
                var menuSelector = options.target;
                delete options.target;

                inst = new mdui.Menu($this, menuSelector, options);
                $this.data('mdui.menu', inst);

                inst.toggle();
            }
        });
    });


    /* jshint ignore:start */
    mdui.JQ = $;
    return mdui;
})));
/* jshint ignore:end */
