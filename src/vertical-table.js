TableSVG.addMode('VerticalTable', null, function (Parent, global, _) {
  function VerticalTable(args) {
    Parent.call(this);
    var requiredArgs = [
      'rowHeights', // 2-Dim array (colWidths.length x eachCellHeightInTheCol)
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
    var colNum = colWidths.length;
    if (colNum !== rowHeights.length) {
      throw 'no match the number of col and row, col:' + colNum + ' row:' + row.length;
    }

    this._colNum = colNum;
    this._rowHeights = rowHeights;
    this._colWidths = colWidths;
    this._viewWidth = _.sum(colWidths);
    this._viewHeight = Math.max.apply(null, rowHeights.map(_.sum));

    this.rootElem.node.setAttribute('viewBox', '0 0 ' + this._viewWidth + ' ' + this._viewHeight);

    this.selectMode = _.selectMode.horizontal(colNum);
    
    this._initTable();
  }

  _.inherit(VerticalTable, Parent);

  (function (proto) {
    // private methods
    proto._initTable = function () {
      var that = this;
      var table = this.rootElem;
      var x = 0;
      this._colWidths.map(function (width, colNo) {
        var y = 0;
        var cols = that._rowHeights[colNo].map(function (height, rowNo) {
          var cell = that.createCell(rowNo, colNo, width, height);
          _.translate(cell,0,y);
          y += height;
          return cell;
        });
        var col = table.g();
        cols.map(function (c) {
          col.add(c)
        });
        col.transform('translate(' + x + ',0)');
        x += width;
        return col;
      })
    };
    // public methods
  })(VerticalTable.prototype);

  return VerticalTable;
});