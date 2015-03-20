TableSVG.addMode('VerticalTimeTable', 'VerticalTable', function (Parent, global, utils) {
  function VerticalTimeTable(args) {
    var requiredArgs = [
      'rootHeight',
      'rootWidth',
      'startDate',
      'dayNum'
    ];
    var optionalArgs = [
      'startTime',
      'endTime',
      'timetable', // 2d array
      'rowHeaderHeights',
      'rowHeaderNames',
      'colHeaderHeight'
    ];

    utils.checkArgs(requiredArgs, args);

    var rootHeight = args.rootHeight;
    var rootWidth = args.rootWidth;
    var startDate = args.startDate;
    var dayNum = args.dayNum;

    var startTime = args.startTime;
    var endTime = args.endTime;
    var timetable = args.timetable;
    var colHeaderHeight = args.colHeaderHeight;

    var colWidths = new Array(dayNum).map(function () {
      return rootWidth / dayNum;
    });

    var rowHeights = this._calcRowHeights(rootHeight - colHeaderHeight, startTime, endTime, timetable);
    
    Parent.call(this, utils.mergeHash({
      rootHeight: rootHeight,
      rootWidth: rootWidth,
      colWidths: colWidths,
      rowHeights: rowHeights
    }, args));
    
    this._rootHeight = rootHeight;
    this._rootWidth = rootWidth;
    this._startDate = startDate;
    this._dayNum = dayNum;
    this._startTime = startTime;
    this._timetable = timetable;
    this._colHeaderHeight = colHeaderHeight;
    this._colWidths = colWidths;
    this._rowHeights = rowHeights;
  }

  utils.inherit(VerticalTimeTable, Parent);

  (function (proto) {
    // private method
    proto._calcRowHeights = function (totalHeight, startTime, endTime, timetable) {
      // static method
      timetable.map(function(oneDayTimes){
        return oneDayTimes
          .filter(function(theTime){return startTime<=theTime&&theTime<=endTime})
          .reduce(function(prevValue, elem, index, filteredOneDayTimes){
            
          }, [])
      })
    };
    
    proto.genCellElem = function(rw, col, width, height){
      var cell = Snap(utils.createElement('g'));
      // TODO:  write here
    }
    // public method
    proto.convertHHMM2int = function (hhmm) {
      var hh = Math.floor(hhmm / 100);
      var mm = Math.floor(mm % 100);
      if (hh < 0 || 24 <= hh) {
        utils.logger.warn('[convertHHMM2int]it seems invalid hh:' + hh + ' HHMM:' + hhmm);
      }
      if (mm < 0 || 60 <= mm) {
        utils.logger.warn('[convertHHMM2int]it seems invalid mm:' + mm + ' HHMM:' + hhmm);
      }
      return hh * 60 + mm;
    }
  })(VerticalTimeTable.prototype);
});