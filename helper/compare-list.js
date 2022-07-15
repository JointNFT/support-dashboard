const diffStaff = (fStaff,sStaff) => {
	const fObj = fStaff.reduce((acc,value) => {
    acc[value.address] = true
   return acc;
  },{});
  const diffStaff = sStaff.reduce((acc,value) => {
  		if(!fObj[value.address]) {
        acc.push(value)
      }
      return acc
  },[])
  return diffStaff;
};
module.exports = diffStaff;