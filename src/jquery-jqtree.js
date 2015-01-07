/* 
 Copyright (c) 2015 muhannad.
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

(function ($) {

    //dump function
    var vfunc = function vfunc() {};

    //For this closestChild function, thanks to: http://goo.gl/VD7AOx
    if (!$.fn.hasOwnProperty('closestChild')) {
        $.fn.closestChild = function (filter) {
            var $found = $(), $currentSet = this; // Current place
            while ($currentSet.length) {
                $found = $currentSet.filter(filter);
                if ($found.length)
                    break;  // At least one match: break loop
                // Get all children of the current set
                $currentSet = $currentSet.children();
            }
            return $found.first(); // Return first match of the collection
        };
    }
    
    //htmlize is the recursive function used to create the tree nodes
    var htmlize = function (items, options, level, data) {
        var picker = options.picker, pattern = options.itemRegex, itemIndex, itemObject, itemChildren, itemHtml, replacement, html = "";
        for (itemIndex in items) {
            itemObject = $.extend(true, {}, options.itemReplacements, items[itemIndex]);
            options.beforeItemProcess(itemObject, options, level, data);
            itemChildren = picker(itemObject);
            if (typeof itemChildren === 'object') {
                if (level >= options.expandLevels - 1 && options.expandLevels !== 0) {
                    itemObject.ul_style += " display: none;";
                    itemObject.class += " out";
                    itemHtml = options.templates.closeItem;
                } else {
                    itemObject.class += " in";
                    itemHtml = options.templates.openItem;
                }
            } else {
                itemHtml = options.templates.emptyItem;
            }
            itemObject.items = htmlize(itemChildren, options, level + 1, data);
            options.beforeItemRender(itemObject, options, level, data);
            match = pattern.exec(itemHtml);
            while (match) {
                pattern.lastIndex = 0;
                replacement = itemObject.hasOwnProperty(match[1]) ? itemObject[match[1]] : '';
                itemHtml = itemHtml.replace(match[0], replacement);
                match = pattern.exec(itemHtml);
            }
            data[itemObject.id] = itemObject;
            delete items[itemIndex];
            items[itemIndex] = itemObject;
            html += itemHtml;
        }
        return html;
    };
    
    //the functions used for the methods of the library
    functions = {
        init: function (opts) {
            var gOptions = $.extend(true, {}, $.fn.jqtree.defaults, opts, $.fn.jqtree.defaults.overrides), replacement;
            return this.each(function () {
                var options = $.extend(true, {}, gOptions), jqtree = this, treeOptions = options, match, treeData = [];
                options.replacements.items = htmlize(options.data, options, 0, treeData);
                var html = options.templates.list;
                match = options.listRegex.exec(html);
                while (match) {
                    options.listRegex.lastIndex = 0;
                    replacement = options.replacements.hasOwnProperty(match[1]) ? options.replacements[match[1]] : '';
                    html = html.replace(match[0], replacement);
                    match = options.listRegex.exec(html);
                }
                $(this).html(html);
                $(this).on('click', options.handlerSelector, options.toggle);
                $(this).on('click', options.selectorSelector, options.select);
                options.treeData = treeData;
                $(this).addClass('jqtree-root').data('jqtree', options).trigger('ready', options);
            });
        },
        select: function (id, callback, silent) {
            var jqtree = $(this).first().closest('.jqtree-root'), options = jqtree.data('jqtree'), item = $(jqtree).find('#jqtree-list-item-' + id);
            $(jqtree).find('.' + options.replacements.selected_class).removeClass(options.replacements.selected_class);
            $(item).addClass(options.replacements.selected_class);
            if (silent !== true) {
                $(item).trigger('selected', options.treeData[id], jqtree, options);
            }
            functions.expand.call(this, id, function () {
                if (typeof callback === 'function')
                    callback.call(this, options.treeData[id], jqtree, options);
            });
            return this;
        },
        expand: function (to, callback) {
            var jqtree = $(this).first().closest('.jqtree-root'), options = jqtree.data('jqtree'), item, items;
            if (to) {
                item = $(jqtree).find('#jqtree-list-item-' + to);
                items = $(item).parents('.' + options.replacements.list_class);
            } else {
                items = $(jqtree).find('.jqtree-list-container');
            }
            items = items.filter(':hidden');
            items.slideDown(300, callback).closest('.' + options.replacements.item_class).removeClass('out').addClass('in').trigger('expanded', jqtree, options, item);
            return this;
        },
        collapse: function (from, to, callback) {
            var jqtree = $(this).first().closest('.jqtree-root'), options = jqtree.data('jqtree'), item, items, fromItem, toItem;
            if (from) {
                fromItem = $(jqtree).find('#jqtree-list-item-' + from);
                items = $(fromItem).parents('.' + options.replacements.list_class);
            } else {
                items = $(jqtree).find('.jqtree-list-container');
            }
            if (to) {
                toItem = $(jqtree).find('#jqtree-list-item-' + to);
                items = items.not($(toItem).parents('.' + options.replacements.list_class));
            }
            items = items.filter(':visible');
            items.first().slideUp(300, function () {
                items.hide().closest('.' + options.replacements.item_class).removeClass('in').addClass('out').trigger('collapsed', jqtree, options, item);
                if (typeof callback === 'function')
                    callback.call(this);
            });
            return this;
        }
    };
    $.fn.jqtree = function (param1, param2, param3, param4) {
        if (param1 === undefined || typeof param1 === 'object') {
            param2 = param1;
            param1 = 'init';
        }

        return functions[param1].call(this, param2, param3, param4);
    };
    $.fn.jqtree.defaults = {
        data: [],
        expandLevels: 2,
        beforeItemProcess: vfunc,
        beforeItemRender: vfunc,
        selectorSelector: '.item > .selector',
        handlerSelector: '.item > .handler',
        replacements: {
            class: 'jqtree',
            list_class: 'jqtree-list',
            item_class: 'jqtree-item',
            item_class_empty: 'jqtree-empty',
            item_class_full: 'jqtree-full',
            selected_class: 'selected',
            handler_class: 'handler',
            selector_class: 'selector',
            expanded_class: 'expanded',
            closed_class: 'collapsed',
            handler_expanded_class: 'expanded',
            handler_collapsed_class: 'collapsed',
        },
        itemReplacements: {
            class: '',
            style: '',
            ul_style: '',
            id: '',
        },
        templates: {
            list: "<ul class='((class)) ((list_class))'>((items))</ul>",
            emptyItem: "<li class='((item_class)) ((item_class_empty)) :class' data-id=':id' style=':style' id='jqtree-list-item-:id'><span class='handler empty'></span><span class='((selector_class))'>:text</span></li>",
            closeItem: "<li class='item list ((item_class)) ((item_class_full)) :class' data-id=':id' style=':style' id='jqtree-list-item-:id'><span class='handler ((handler_collapsed_class))'></span><span class='selector'>:text</span><ul style=':ul_style' class='jqtree-list-container ((list_class))'>:items</ul></li>",
            openItem: "<li class='item list ((item_class)) ((item_class_full)) :class' data-id=':id' style=':style' id='jqtree-list-item-:id'><span class='handler ((handler_expanded_class))'></span><span class='selector'>:text</span><ul style=':ul_style' class='jqtree-list-container ((list_class))'>:items</ul></li>",
        },
        picker: function (item) {
            return item.children;
        },
        itemRegex: /:\(?([a-zA-Z0-9_]+)\)?/g,
        listRegex: /\(\(([a-zA-Z0-9_]+)\)\)/g,
        overrides: {
            toggle: function (e) {
                var jqtree = $(this).closest('.jqtree-root'), options = jqtree.data('jqtree'), item = $(this).closest('.' + options.replacements.item_class), first = item.children().closestChild('.' + options.replacements.item_class);
                if (item.hasClass('in')) {
                    functions.collapse.call(this, first.data('id'), item.data('id'), function () {
                        item.closestChild(options.handlerSelector).removeClass(options.replacements.handler_expanded_class).addClass(options.replacements.handler_collapsed_class);
                    });
                } else {
                    functions.expand.call(this, first.data('id'), function () {
                        item.closestChild(options.handlerSelector).addClass(options.replacements.handler_expanded_class).removeClass(options.replacements.handler_collapsed_class);
                    });
                }
                e.preventDefault();
                e.stopPropagation();
                return false;
            },
            select: function (e) {
                var jqtree = $(this).closest('.jqtree-root'), options = jqtree.data('jqtree'), item = $(this).closest('.' + options.replacements.item_class);
                jqtree.jqtree('select', item.data('id'));
                e.preventDefault();
                e.stopPropagation();
                return false;
            },
        },
    };
})(jQuery);