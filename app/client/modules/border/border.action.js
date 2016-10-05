
import _ from 'lodash';
import BorderUtils from './utils';
const {
  BorderUtil,
} = BorderUtils;

export function move(params){
  const {
    nodes,
  } = params;

  const finges = BorderUtil.getSuccessors({nodes});
  const r = _.random(0,finges.length-1);

  const { node, color } = finges[r];

  const newNodes = _.cloneDeep(nodes);
  const index = _.findIndex(nodes, { id:node });

  newNodes[index].color = color;

  return {
    type: 'BORDER_SET_STATE',
    props: {
      nodes: newNodes,
    }
  };

}
