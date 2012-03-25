var Plotter = {}

Plotter.Updater = function() {
  
  var newDataToPlot = [];
  var graph;
  var graphOptions = {
    series : { shadowSize : 0 }
  };

  var plot = function(elementId) {
    graph = $.plot($("#"+elementId), [], graphOptions);
  };

  var refresh = function() {
    _convertToPlotObjects();
    data = Plotter.Data.dataToPlot();
    graph = $.plot($("#graph"), data, graphOptions);
    // graph.setData(data);
    graph.setupGrid();
    graph.draw();
  };

  var _fetchDepthValues = function() {
    return { "awesome_queue" : (Math.random()*11), 
             "simple_queue"  : (Math.random()*21),
             "some_queue"    : (Math.random()*91)
    };
  };

  var _convertToPlotObjects = function() {
    var data = _fetchDepthValues();
    // newDataToPlot = [];
    for(var queueName in data) {
      var pointObject =  _pointData(queueName, data[queueName]);
      _addToCollection(pointObject);
      // newDataToPlot.push(pointObject);
    };
  };

  var _addToCollection = function(pointObject) {
    Plotter.Data.add(pointObject);
  };

  var _pointData = function(queueName, depth) {
    return Plotter.Point.create(queueName, depth);
  };

  return { plot    : plot,
           refresh : refresh };

}();

Plotter.Data = function() {
  var collection = {};
  var plotOptions = {}

  var add = function(pointObject) {
    queueName = pointObject.queueName;
    if(collection[queueName] == undefined) {
      collection[queueName] = [pointObject];
    } else {
      collection[queueName].push(pointObject);
    }
  };

  var lastForQueue = function(queueName) {
    if(collection[queueName]) {
      return _peek(queueName).data[1];
    }
  };

  var numberOfPointsForQueue = function(queueName) {
    return (collection[queueName] || []).length;
  };

  var print = function() {
    for(var name in collection) {
      console.log(collection[name]);
    }
  }

  var _peek = function(queueName) {
    value = collection[queueName].pop();
    collection[queueName].push(value);
    return value;
  };

  var dataToPlot = function() {
    // var data = [];
    // for(var queue in collection) {
      // data.push(collection[queue]);
    // }
    return collection["awesome_queue"];
  };

  return { 
    add        : add,
    sizeFor    : numberOfPointsForQueue,
    lastFor    : lastForQueue,
    print      : print,
    dataToPlot : dataToPlot
  };
}();


Plotter.Point = function() {
  
  var create = function(queueName, depth) {
    return { 
      data      : [_lastCordinatesForQueue(queueName), [_nextXAxisValue(queueName), depth]],
      label     : queueName,
      lines     : { show : true },
      points    : { show : true },
      hoverable : true,
      queueName : queueName
    };
  };

  var _nextXAxisValue = function(queueName) {
    return (Plotter.Data.sizeFor(queueName) + 1);
  };

  var _lastCordinatesForQueue = function(queueName) {
    if(Plotter.Data.sizeFor(queueName) == 0)
      return [0,0];
    else
      return Plotter.Data.lastFor(queueName);
  };

  return { create : create };
}();


var Graph = {}; 

Graph.Point = function() {
  
  var xCordinate;
  var yCordinate;

  var init  = function(xCord, yCord) {
    xCordinate = xCord;
    yCordinate = yCord;
    
    return this;
  };

  var value = function() {
    return [xCordinate, yCordinate];
  };

  return {
    new   : init,
    value : value
  };
}();