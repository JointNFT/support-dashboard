const diffList = (fList,sList) => {
	const fObj = fList.reduce((acc,value) => {
    acc[value.address] = true
   return acc;
  },{});
  const diffList = sList.reduce((acc,value) => {
  		if(!fObj[value.address]) {
        acc.push(value)
      }
      return acc
  },[])
  return diffList;
};
module.exports = diffList;