
import React, { Component } from 'react';
import { GridCell } from './comps';
import { Comps, Utils } from '../../';
const {
  CommonGrid,
  Chooser,
} = Comps;
const {
  SearchTree
} = Utils;

const renderButtons = function(){

  const {
    state: { gridState },
    actions: { computeAndDisplay, stepNext, clearPath }
  } = this.props;

  let self = this;
  const buttons = ['BFS', 'DFS', 'greedy', 'uniform', 'astar'].map((strategy)=>{
    return (
      <button
        key={strategy}
        onClick={()=>{
          stepNext({searchTree:self._searchTree,strategy});
        }}
      >
        {strategy}
      </button>
    );
  });

  return (
    <div>
      {buttons}
      <button onClick={clearPath.bind(null,{
        gridState:this.props.state.gridState,
        searchTree: this._searchTree,
      })}>{'reset'}</button>
      <br/>
      <button
        onClick={computeAndDisplay.bind(null,{gridState})}
      >
        {'computall'}
      </button>
    </div>
  );
};

const _renderCells = function({
  gridState, onClick, searchTree, highlighted, visited
}){

  return searchTree._getGridKeys().map((key)=>{
    const { x, y } = SearchTree.keyToCoor({key});
    const isHighlighted = _.includes(highlighted, key);
    const showDow = _.includes(visited, key);
    return (
      <GridCell
        key={key}
        onClick={onClick}
        x={x}
        y={y}
        {...gridState[key]}
        isHighlighted={isHighlighted}
        showDot={showDow}
      />
    );
  });
};

const renderTable = function(params){
  const {
    state: { resultTable },
    actions: { setState }
  } = this.props;

  const tableRows = resultTable.map((row, i)=>{
    const {
      strategy, expansions, cost, path, visited
    } = row;
    return (
      <tr key={i}>
        <td>{strategy}</td>
        <td>{expansions}</td>
        <td>{cost}</td>
        <td> <button onClick={()=>{
          const { gridState } = this.props.state;
          setState({visited,highlighted:path.slice(1,-1).map((c)=>SearchTree.coorToKey(c))});
        }}>{'show'}</button> </td>
      </tr>
    );
  });

  return (
    <table>
      <thead>
        <tr>
          <th>{'Algorithm'}</th>
          <th>{'Expansions'}</th>
          <th>{'Cost'}</th>
          <th>{'Path'}</th>
        </tr>
      </thead>
      <tbody>
        {tableRows}
      </tbody>
    </table>
  );
};

const renderGridChoosers = function(){

  const {
    actions : {
      changeGrid,
    }
  } = this.props;

  const gridChoosers = ['GRID_1', 'GRID_2'].map((gridName)=>{
    return (
      <Chooser
        key={gridName}
        onClick={()=>{
          changeGrid({gridName:gridName,searchTree:this._searchTree});
        }}
        text={gridName}
      />
    );
  });

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row'
    }}>
      {gridChoosers}
    </div>
  );

};

const renderGrid = function(){
  const {
    gridState,
    columns,
    rows,
    highlighted,
    visited,
  } = this.props.state;

  const {
    incrementCellCost
  } = this.props.actions;

  const cells = _renderCells({
    gridState,
    searchTree: this._searchTree,
    highlighted,
    visited,
    onClick:(params)=>{
      incrementCellCost({
        ...params,
        searchTree: this._searchTree,
        gridState: this.props.state.gridState,
      });
    }}
  );

  return (
    <div style={{
      display: 'flex'
    }}>
      <CommonGrid
        columns={columns}
        rows={rows}
        size={50}
        cells={cells}
        borderWidth={4}
      />
    </div>
  );
};

export {
  renderButtons,
  renderGrid,
  renderTable,
  renderGridChoosers,
};
