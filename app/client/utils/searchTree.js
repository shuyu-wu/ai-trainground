
import _ from 'lodash';
import GridUtil from './gridUtil';
import * as Calc from './Calc';

const computeCost = function(params){
  const {coordinate, gridState} = params;
  // console.log('coordinate', coordinate)
  const key = GridUtil.coorToKey(coordinate);
  const cost = gridState[key].cost;
  return cost;
};

const mapCosts = function(gridState, l){
  let cost = 0;
  const { coordinate, path }=l;
  cost = cost + computeCost({coordinate, gridState});
  let cost2 = 0;
  path.forEach((p)=>{
    cost2 = cost2 + computeCost({coordinate:p, gridState});
  });
  return cost + cost2;
};

const strategies = {
  BFS: function(params){
    const { list:queue } = params;
    const node = queue[0];
    return [node, queue.slice(1,queue.length)];
  },
  DFS: function(params){
    const { list:stack } = params;
    const length = stack.length;
    const node = stack[length-1];
    return [node, stack.slice(0,stack.length-1)];
  },
  greedy: function(params){
    const {
      list:queue,
      goalCoordinate
    } = params;

    let index = 0;
    let value = undefined;

    queue.forEach((q, i)=>{
      const distance = Calc.computeManhattanDistance({
        start: q.coordinate,
        end: goalCoordinate
      });
      if(value === undefined || distance < value){
        value = distance;
        index = i;
      }
    });

    const node = queue[index];
    return [
      node,
      [
        ...queue.slice(0,index),
        ...queue.slice(index+1,queue.length)
      ]
    ];
  },
  uniform: function(params){
    const {
      list,
      gridState,
    } = params;

    const costs = list.map(mapCosts.bind(null,gridState));

    let index = 0;
    let value = undefined;
    costs.forEach((c, i)=>{
      if( value === undefined || c < value){
        value = c;
        index = i;
      }
    });

    const node = list[index];
    return [
      node,
      [
        ...list.slice(0,index),
        ...list.slice(index+1,list.length)
      ]
    ];
    // GridUtil.coorToKey()
    // gridState
    // gridState[]

  },

  astar: function(params){
    const {
      list,
      gridState,
      goalCoordinate
    } = params;

    const distances = list.map((l)=>{
      return Calc.computeManhattanDistance({
        start: l.coordinate,
        end: goalCoordinate
      });
    });

    // console.log('distances', distances);

    const costs = list.map(mapCosts.bind(null,gridState));

    // console.log('costs', costs);

    const heuristics = distances.map((d,i)=>{
      const c = costs[i];
      return d + c;
    });

    let index = 0;
    let value = undefined;
    heuristics.forEach((h, i)=>{
      if(value === undefined || h < value){
        index = i;
        value = h;
      }
    });

    const node = list[index];
    return [
      node,
      [
        ...list.slice(0,index),
        ...list.slice(index+1,list.length)
      ]
    ];

  }
};

class SearchTree {

  constructor(props) {

    const {
      gridState,
      strategy,
    } = props;

    this._gridState = gridState;
    this._strategyName = strategy;
    this.setStrategy({strategy});
    this._reset({gridState});

  }

  setGridState(gridState){
    this._gridState = gridState;
  }

  _reset(params){
    const {
      gridState
    } = params;

    this._expansions = 0;

    const start = GridUtil.getStartCoordinate({gridState});
    this._queue = [{
      coordinate: start,
      path: [],
    }];
    this._visited = [];
  }

  setStrategy(params){
    const { strategy } = params;
    this._strategy = strategies[strategy];
  }

  _nextExhausted(){
    return {
      goalReached: false,
      exhausted: true,
      // tree: this._tree,
      expansions: this._expansions,
    };
  }

  _nextGoalReached(params){
    const {
      path,
      gridState
    } = params;
    // console.log('path', path);
    let cost = 0;
    path.forEach((p)=>{
      cost = cost + computeCost({coordinate:p, gridState});
    });
    // console.log('costs', costs);
    // console.log('GOAL REACHED', this._expansions, cost);

    return {
      cost,
      goalReached: true,
      path: path,
      gridState,
      expansions: this._expansions,
    };
  }

  _nextCoordinate(params){

    const {
      gridState,
    } = params;

    return {
      goalReached: false,
      gridState,
      // coordinate,
      // tree: this._tree,
      expansions: this._expansions,
    };
  }

  next(){

    this._expansions++;

    if(this._queue.length === 0){
      return this._nextExhausted.call(this);
    }

    // expand the next node depending on the strategy
    let node;
    [node, this._queue] = this._strategy({
      list: this._queue,
      goalCoordinate: GridUtil.getGoalCoordinate({gridState:this._gridState}),
      gridState:this._gridState,
    });

    const { coordinate } = node;
    const newPath = node.path.concat(coordinate);

    if(GridUtil.isGoalState({gridState:this._gridState, coordinate})){
      return this._nextGoalReached.call(this, {path:newPath,gridState:this._gridState});
    }

    this._visited.push({
      coordinate,
      path: newPath
    });

    const finges = GridUtil.getSuccessor({gridState:this._gridState, coordinate})
      .map((f)=>{
        return {
          coordinate: f,
          path: newPath
        };
      });

    const visitedCoordinates = this._visited.map((v)=>v.coordinate);
    this._queue = this._queue
      .concat(finges)
      .filter((f)=> !_.find(visitedCoordinates, f.coordinate));


    const key = GridUtil.coorToKey(coordinate);
    const newGridState = _.cloneDeep(this._gridState);
    newGridState[key].showDot = true;
    this._gridState = newGridState;

    return {
      goalReached: false,
      gridState: this._gridState,
      expansions: this._expansions,
    };
    // return this._nextCoordinate.call(this, coordinate);

  }

  computeSolution(){
    let res = {};
    let i = 0;
    while(!res.goalReached && i < 2000){
      i++;
      res = this.next();

      if(res.goalReached){
        return {
          strategy: this._strategyName,
          expansions: res.expansions,
          cost: res.cost,
          path: res.path,
        };
      }
    }
  }

}

export default SearchTree;
