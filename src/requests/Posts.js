import {getDataJSON} from '../functions/AsyncStorageFunctions';
const getAllData = (endpoint) => {
  var data=getDataJSON(endpoint);
  //console.log(data);
};

export { getAllData };
