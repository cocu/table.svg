TableSVG.addMode('Table', null, function (Parent, global, utils) {
  function Table(args) {
    Parent.call(this);
    var requiredArgs = [
      'rowHeights',
      'colWidths',
      'rootHeight',
      'rootWidth'
    ];
    var lackArgs = requiredArgs.filter(function (elem) {
      return args === undefined || args[elem] === undefined
    }).join(', ');
    if (lackArgs.length > 0) {
      throw 'NoRequiredArgument: ' + lackArgs;
    }

    var rowHeights = args['rowHeights'];
    var colWidths = args['colWidths'];
    var rowNum = rowHeights.length;
    var colNum = colWidths.length;
    
    this._colWidths = colWidths;
    this._rowHeights = rowHeights;
    this._colNum = colNum;
    this._rowNum = rowNum;
    this._viewWidth = utils.sum(colWidths);
    this._viewHeight = utils.sum(rowHeights);

    this.rootElem.node.setAttribute('viewBox', '0 0 ' + this._viewWidth + ' ' + this._viewHeight);

    this.isInSelecting = utils.selectMethodGens.horizontal(colNum);
    
    this._initTable();
  }

  utils.inherit(Table, Parent);
  (function (proto) {
    // private methods
    proto._initTable = function () {
      var that =this;
      var table = this.rootElem;
      var x = 0;
      this._colWidths.map(function (width, colNo) {
        var y = 0;
        var cols = that._rowHeights.map(function (height, rowNo) {
          var cell = that.createCell(rowNo, colNo, width, height);
          utils.translate(cell, 0, y);
          y += height;
          return cell;
        });
        var col = table.g();
        cols.map(function (c) {
          col.add(c);
        });
        utils.translate(col, x, 0);
        x += width;
        return col;
      });
    };
    // public methods
  })(Table.prototype);
  return Table;
});