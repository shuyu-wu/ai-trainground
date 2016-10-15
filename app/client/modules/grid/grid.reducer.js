
import _ from 'lodash';
import { Utils } from '../../.';
// import Grids from './grids';

// const GRID_1 = Grids.GRID_1;

const initialState = {
  // columns: GRID_1.columns,
  // rows: GRID_1.rows,
  // gridState: GRID_1.gridState,
  columns: 0,
  rows: 0,
  gridState: {},
  resultTable: []
};

export default function moduleName(state = initialState, action = {}){

  if(action.type === 'GRID_SET_STATE'){
    return {
      ...state,
      ...action.props,
    };
  }

  if(action.type === 'GRID_UPDATE_CELL'){

    const gridState = _.cloneDeep(state.gridState);
    gridState[action.props.key] = {
      ...gridState[action.props.key],
      showDot: true,
      // color: 'red'
    };

    return {
      ...state,
      gridState,
    };

  }

  if(action.type === 'GRID_UPDATE_CELLS'){
    const gridState = _.cloneDeep(state.gridState);
    action.props.keys.forEach((key)=>{
      gridState[key].showDot = true;
    });
    return {
      ...state,
      gridState,
    };
  }

  if(action.type === 'GRID_PAINT_CELLS'){
    const gridState = _.cloneDeep(state.gridState);
    action.props.coordinates.forEach((c)=>{
      // gridState[c].color = 'red';
      gridState[c].isHighlighted = true;
    });
    return {
      ...state,
      gridState,
    };
  }

  if(action.type === 'GRID_UPDATE_RESULT_TABLE'){
    return {
      ...state,
      resultTable: action.props.resultTable,
    };
  }

  if(action.type === 'GRID_RESET_TO_INITIAL_STATE'){
    return initialState;
  }

  return state;
}
