// table.svg 0.1.0
// 
// Copyright (c) 2014 cocu
//
// Licensed under the Apache License, Version 2.0 (the "License")
//
// github: https://github.com/cocu/table.svg
// build : 2014-11-03
var TableSVG=function(){function a(){}function b(){var b=Snap(a.createElement("svg"));this.rootElem=b,this.classes={active:"active",root:"svg-table",selecting:"selecting",cell:"cell"},this.status={start:{col:null,row:null},end:{col:null,row:null},isSelecting:!1},this.cells=[],this.table={},Snap(b).addClass(this.classes.root);var c=this;e.doc.body.addEventListener("mouseup",function(){c.status.isSelecting=!1,c._activateSelectingCells.call(c)})}function c(){}var d={svg:"http://www.w3.org/2000/svg",xhtml:"http://www.w3.org/2000/xhtml",xlink:"http://www.w3.org/1999/xlink"};a.modes={table:b},a.createElement=function(a){return glob.doc.createElementNS(d.svg,a)},a.getTableClass=function(b){return a.modes[b]},a._={};var e={xmlns:d,win:window,doc:window.document};a._.global=e,a.createElement=function(a){return e.doc.createElementNS(d.svg,a)};var f=function(){var a=function(a,b){console.log("[table.svg]"+a+" "+b)};this.fatal=function(b){a("[FATAL]",b)},this.warn=function(b){a("[WARN]",b)},this.info=function(b){a("[INFO]",b)},this.debug=function(b){a("[DEBUG]",b)}}();return function(b){b._clearSelectingCells=function(){var a=this;this.cells.forEach(function(b){b.removeClass(a.classes.selecting)})},b._activateSelectingCells=function(){this._clearSelectingCells(),this._toggleSelectingCellClass(this.classes.active)},b._toggleSelectingCellClass=function(a,b){void 0===b&&(b=!this.table[this.status.start.row][this.status.start.col].hasClass(a));var c=this;this.cells.forEach(function(d){c.isInSelecting(d)&&d.toggleClass(a,b)})},b._eventHandlerFactory=function(a,b){var c=this,d=this.status,e=function(){d.start.col=a,d.start.row=b},f=function(){d.end.col=a,d.end.row=b},g=function(){c._toggleSelectingCellClass(c.classes.selecting,!0)};return{mousedown:function(a){e(),f(),d.isSelecting=!0,g(),a.preventDefault()},mouseover:function(a){c._clearSelectingCells(),d.isSelecting&&0!=a.buttons&&a.which%2!=0&&(f(),g()),a.preventDefault()}}},b.getRootElem=function(){return this.rootElem.node},b.createCell=function(a,b,c,d){var e=this.genCellElem(a,b,c,d);return this.registerCellToTable(e,a,b),this.setCellHandlers(e,a,b),e},b.genCellElem=function(b,c,d,e){var f=Snap(a.createElement("rect"));return f.attr({width:d,height:e}),f},b.registerCellToTable=function(a,b,c){a.addClass(this.classes.cell),a.data("row",b),a.data("col",c),this.cells.push(a),void 0===this.table[b]&&(this.table[b]={}),this.table[b][c]=a},b.setCellHandlers=function(a,b,c){var d=this._eventHandlerFactory(c,b);return a.node.addEventListener("mousedown",d.mousedown),a.node.addEventListener("mouseover",d.mouseover),a},b.generateTable=function(){throw"NotImplementedError: generateTable"},b.isInSelecting=function(){throw"NotImplementedError: isInSelecting"}}(b.prototype),a.addMode=function(d,g,h){void 0===g?parent=b:(parent=a.modes[g],void 0===parent&&f.fatal("no such mode error mode:"+g));var i=h(parent,e,new c);!i instanceof b&&f.warn("no inherit Table. please set prototype Table(first argument) modeName:"+d),a.modes[d]=i},a.plugin=function(d){d(a,b,e,new c)},function(a){a.sum=function(a){return a.reduce(function(a,b){return a+b})},a.inherit=function(a,b){a._parent=b,a.prototype=Object.create(b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}})},a.logger=f}(c.prototype),a}();