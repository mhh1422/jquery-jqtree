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
if (!window.jQuery) {
    throw "jQuery is required";
}
if (!jQuery.fn.jqtree) {
    throw "jQuery jqtree is required";
}
(function ($) {
    $.fn.jqtree.defaults = $.extend(true, $.fn.jqtree.defaults, {
        beforeItemRender: function (item, options, level, data) {
            item.indent = 15 + level * 15;
        },
        selectorSelector: '.item > .item-content > .selector',
        handlerSelector: '.item >  .item-content > .handler',
        replacements: {
            list_class: 'list-group',
            item_class: 'list-group-item',
            handler_expanded_class: 'glyphicon-chevron-down',
            handler_collapsed_class: 'glyphicon-chevron-right',
        },
        templates: {
            emptyItem: "<li class='item ((item_class)) ((item_class_empty)) :class' data-id=':id' style=':style' id='jqtree-list-item-:id'><div style='padding-left: :(indent)px;' class='item-content'><i class='handler glyphicon glyphicon-stop empty'><a class='selector'></i>:text</a></div></li>",
            openItem: "<li class='item list ((item_class)) ((item_class_full)) :class' data-id=':id' style='style' id='jqtree-list-item-:id'><div style='padding-left: :(indent)px;' class='item-content'><i class='handler glyphicon glyphicon-chevron-down expanded'></i><a style='margin-left: -:(indent)px; padding-left: :(indent)px;' class='selector'>:text</a></div><ul style=':ul_style' class='list-container ((list_class))'>:items</ul></li>",
            closeItem: "<li class='item list ((item_class)) ((item_class_full)) :class' data-id=':id' style='style' id='jqtree-list-item-:id'><div style='padding-left: :(indent)px;' class='item-content'><i class='handler glyphicon glyphicon-chevron-right collapsed'></i><a style='margin-left: -:(indent)px; padding-left: :(indent)px;' class='selector'>:text</a></div><ul style=':ul_style' class='list-container ((list_class))'>:items</ul></li>",
        }
    });
})(jQuery);