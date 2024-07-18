let arr1 = [1, 2, 3];

//let arr2 = JSON.parse(JSON.stringify(arr1));

let arr2 = [ ... arr1 ];


arr2[0] = null;

console.log(arr1, arr2);