const obj = {
  "_id": "5c4ecd84d1f30502fd080e17",
  "code": "D",
  "description": "Dozzen",
  "number": 12,
  "createdAt": "2019-01-28T09:38:12.702Z",
  "updatedAt": "2019-01-28T09:38:12.702Z",
  "__v": 0
}
const keys = Object.keys(obj);
const names = keys.join(" ");
console.log(keys);
console.log('-------------------');
const tableConfig = [];
keys.forEach(function(key){
  item = {id:key,
   numeric: (typeof obj[key])==='number',
   disablePadding: (typeof obj[key])!=='number',
   label: key,
   align: 'left',
   visible: true,
   search: true,
  };
  tableConfig.push(item);
});
console.log(tableConfig)
