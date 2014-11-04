// table.svg 0.1.0
// 
// Copyright (c) 2014 cocu
//
// Licensed under the Apache License, Version 2.0 (the "License")
//
// github: https://github.com/cocu/table.svg
// build : 2014-11-04
var TableSVG=function(){function a(){}function b(){var b=Snap(a.createElement("svg"));this.rootElem=b,this.classes={active:"active",root:"svg-table",selecting:"selecting",cell:"cell"},this.status={start:{col:null,row:null},end:{col:null,row:null},isSelecting:!1},this.cells=[],this.table={},Snap(b).addClass(this.classes.root);var c=this;f.doc.body.addEventListener("mouseup",function(){c.status.isSelecting&&c._activateSelectingCells.call(c),c.status.isSelecting=!1})}var c={svg:"http://www.w3.org/2000/svg",xhtml:"http://www.w3.org/2000/xhtml",xlink:"http://www.w3.org/1999/xlink"},d={},e={};a.Mode={},a.createElement=function(a){return glob.doc.createElementNS(c.svg,a)},a._={};var f={xmlns:c,win:window,doc:window.document};a._.global=f,a.createElement=function(a){return f.doc.createElementNS(c.svg,a)};var g=function(){var a=function(a,b){console.log("[table.svg]"+a+" "+b)};this.fatal=function(b){a("[FATAL]",b)},this.warn=function(b){a("[WARN]",b)},this.info=function(b){a("[INFO]",b)},this.debug=function(b){a("[DEBUG]",b)}}();return function(b){b._clearSelectingCells=function(){var a=this;this.cells.forEach(function(b){b.removeClass(a.classes.selecting)})},b._activateSelectingCells=function(){this._clearSelectingCells(),this._toggleSelectingCellClass(this.classes.active)},b._toggleSelectingCellClass=function(a,b){void 0===b&&(b=!this.table[this.status.start.row][this.status.start.col].hasClass(a));var c=this;this.cells.forEach(function(d){c.isInSelecting(d,c.status)&&d.toggleClass(a,b)})},b._eventHandlerFactory=function(a,b){var c=this,d=this.status,e=function(){d.start.col=a,d.start.row=b},f=function(){d.end.col=a,d.end.row=b},g=function(){c._toggleSelectingCellClass(c.classes.selecting,!0)};return{mousedown:function(a){e(),f(),d.isSelecting=!0,g(),a.preventDefault()},mouseover:function(a){c._clearSelectingCells(),d.isSelecting&&0!=a.buttons&&a.which%2!=0&&(f(),g()),a.preventDefault()}}},b.getRootElem=function(){return this.rootElem.node},b.createCell=function(a,b,c,d){var e=this.genCellElem(a,b,c,d);return this.registerCellToTable(e,a,b),this.setCellHandlers(e,a,b),e},b.genCellElem=function(b,c,d,e){var f=Snap(a.createElement("rect"));return f.attr({width:d,height:e}),f},b.registerCellToTable=function(a,b,c){a.addClass(this.classes.cell),a.data("row",b),a.data("col",c),this.cells.push(a),void 0===this.table[b]&&(this.table[b]={}),this.table[b][c]=a},b.setCellHandlers=function(a,b,c){var d=this._eventHandlerFactory(c,b);return a.node.addEventListener("mousedown",d.mousedown),a.node.addEventListener("mouseover",d.mouseover),a},b.generateTable=function(){throw"NotImplementedError: generateTable"},b.isInSelecting=function(){throw"NotImplementedError: isInSelecting"}}(b.prototype),a.addMode=function(c,e,h){e?(parent=a.Mode[e],void 0===parent&&g.fatal("no such mode error mode:"+e)):parent=b;var i=h(parent,f,d);!i instanceof b&&g.warn("no inherit AbstractTable. please set prototype AbstractTable(first argument) modeName:"+c),a.Mode[c]=i},a.plugin=function(c){c(a,b,f,d)},e={},e.horizontal=function(a){return console.log(a),function(b,c){var d=b.data("col"),e=b.data("row"),f=c.start.col+c.start.row*a,g=c.end.col+c.end.row*a,h=d+e*a,i=Math.min(f,g),j=Math.max(f,g);return h>=i&&j>=h}},e.vertical=function(a){return function(b,c){var d=b.data("col"),e=b.data("row"),f=c.start.col*a+c.row,g=c.end.col*a+c.end.row,h=d*a+e,i=Math.min(f,g),j=Math.max(f,g);return h>=i&&j>=h}},d={},d.sum=function(a){return a.reduce(function(a,b){return a+b})},d.inherit=function(a,b){a._parent=b,a.prototype=Object.create(b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}})},d.translate=function(a,b,c){a.transform("translate("+b+","+c+")")},d.logger=g,d.selectMethodGens=e,a}();TableSVG.addMode("VerticalTable",null,function(a,b,c){function d(b){a.call(this);var d=["rowHeights","colWidths","rootHeight","rootWidth"],e=d.filter(function(a){return void 0===b||void 0===b[a]}).join(", ");if(e.length>0)throw"NoRequiredArgument: "+e;var f=b.rowHeights,g=b.colWidths,h=g.length;if(h!==f.length)throw"no match the number of col and row, col:"+h+" row:"+row.length;this._colNum=h,this._rowHeights=f,this._colWidths=g,this._viewWidth=c.sum(g),this._viewHeight=Math.max.apply(null,f.map(c.sum)),this.rootElem.node.setAttribute("viewBox","0 0 "+this._viewWidth+" "+this._viewHeight),this.isInSelecting=c.selectMethodGens.horizontal(h),this._initTable()}return c.inherit(d,a),function(a){a._initTable=function(){var a=this,b=this.rootElem,d=0;this._colWidths.map(function(e,f){var g=0,h=a._rowHeights[f].map(function(b,d){var h=a.createCell(d,f,e,b);return c.translate(h,0,g),g+=b,h}),i=b.g();return h.map(function(a){i.add(a)}),i.transform("translate("+d+",0)"),d+=e,i})}}(d.prototype),d}),TableSVG.addMode("Table",null,function(a,b,c){function d(b){a.call(this);var d=["rowHeights","colWidths","rootHeight","rootWidth"],e=d.filter(function(a){return void 0===b||void 0===b[a]}).join(", ");if(e.length>0)throw"NoRequiredArgument: "+e;var f=b.rowHeights,g=b.colWidths,h=f.length,i=g.length;this._colWidths=g,this._rowHeights=f,this._colNum=i,this._rowNum=h,this._viewWidth=c.sum(g),this._viewHeight=c.sum(f),this.rootElem.node.setAttribute("viewBox","0 0 "+this._viewWidth+" "+this._viewHeight),this.isInSelecting=c.selectMethodGens.horizontal(i),this._initTable()}return c.inherit(d,a),function(a){a._initTable=function(){var a=this,b=this.rootElem,d=0;this._colWidths.map(function(e,f){var g=0,h=a._rowHeights.map(function(b,d){var h=a.createCell(d,f,e,b);return c.translate(h,0,g),g+=b,h}),i=b.g();return h.map(function(a){i.add(a)}),c.translate(i,d,0),d+=e,i})}}(d.prototype),d});