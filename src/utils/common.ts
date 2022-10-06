// 对象去重
export function uniqueFunc(arr: any[], uniId: string) {
  let obj = {};
  return arr.reduce((accum: any[], item: { [x: string]: any }) => {
    obj[item[uniId]]
      ? ''
      : (obj[item[uniId]] = true && accum.push(item[uniId]));
    return accum;
  }, []);
}
