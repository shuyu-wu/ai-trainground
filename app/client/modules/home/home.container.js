
import React, { Component } from 'react';
import * as homeActions from './home.action';

import { Utils, Comps, } from '../../';

const { Setup, GridUtil } = Utils;
const { Cell, Grid } = Comps;

class HomeContainer extends Component {

  static propTypes = {
    actions: React.PropTypes.object,
    state: React.PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.tree = [];
  }

  componentDidMount() {
    const {
      gridState
    } = this.props.state;

    const start = GridUtil.getStartCoordinate({gridState});
    let branch = [start];
    // this.tree.push(branch);

    let finges = GridUtil.getSuccessor({gridState, coordinate:start});

    finges = finges.map((f)=>{
      return branch.concat(f);
    })
    // .filter((f)=>{
    //   return !_.find(this.tree, f);
    // });

    for (var j =0; j<finges.length; j++){
      this.tree.push(finges[j]);
    }

    // let i = 0;
    // while(i < 1){
    //   i++;

    // }

  }

  _next() {

    const {
      updateCell
    } = this.props.actions;

    const {
      gridState
    } = this.props.state;

    // breadth first
    // const strategy = function(tree){
    //   return tree.sort((prev, next)=>{
    //     return prev.length > next.length ? 1 : -1;
    //   });
    // };

    // depth first
    const strategy = function(tree){
      return tree.sort((prev, next)=>{
        return prev.length > next.length ? -1 : 1;
      });
    };

    // console.log('this.tree', JSON.stringify(this.tree, null, 2));
    this.tree = strategy(this.tree);
    const branch = this.tree[0];

    const coordinate = _.last(branch);

    if(GridUtil.isGoalState({gridState, coordinate})){
      console.log('GOAL REACHED');
      return;
    }

    this.tree = this.tree.slice(1,this.tree.length);

    // console.log(_.last(branch))

    console.log('coordinate', coordinate);

    updateCell(coordinate);

    let finges = GridUtil.getSuccessor({gridState, coordinate:coordinate});
    const prevCells = [];
    prevCells.push(coordinate);

    this.tree.forEach((t)=>{
      const arr = t.slice(0,-1);
      arr.forEach((a)=>{
        if (!_.find(prevCells, a)){
          prevCells.push(a);
        }
      });
    });

    // console.log('prevCells', prevCells);

    // console.log('f1', finges)


    finges = finges.map((f)=>{
      return branch.concat(f);
    }).filter((f)=>{

      // console.log('ff', prevCells, _.last(f));
      return !_.find(prevCells, _.last(f));

      // return !_.find(this.tree, f) && ;
    });
    // console.log('f2', finges)

    for (var j =0; j<finges.length; j++){
      this.tree.push(finges[j]);
    }

    // graph search
    this.tree = this.tree.filter((t)=>{
      return !_.find(prevCells, _.last(t));
    });
  }

  _onClickCell(params){
    const {
      updateCell
    } = this.props.actions;
    // console.log(params);
    const { x,y } = params;
    updateCell({x,y});
  }

  render(){

    const {
      gridState
    } = this.props.state;

    return (
      <div>
        <Grid
          gridState={gridState}
          onClick={this._onClickCell.bind(this)}
          rows={6}
          columns={6}
        />
        <button onClick={this._next.bind(this)}>{'>'}</button>
      </div>
    );
  }
}

export default Setup.customConnect('home', homeActions, HomeContainer);
