
import React, { Component } from 'react';
import * as homeActions from './home.action';

import { Utils, Comps, } from '../../';

const { Setup } = Utils;
const { Cell, Grid } = Comps;

class HomeContainer extends Component {

  _onClickCell(params){
    console.log(params);
  }

  render(){
    return (
      <div>
        <Grid
          onClick={this._onClickCell.bind(this)}
          rows={6}
          columns={6}
        />
      </div>
    );
  }
}

export default Setup.customConnect('home', homeActions, HomeContainer);
