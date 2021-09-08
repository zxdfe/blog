console.log(Object.__proto__ === Function.prototype)
console.log(Object.__proto__ === Function.__proto__) 
console.log(Object.prototype === Function.prototype.__proto__)
console.log(Function.__proto__ === Object.prototype)  // false

console.log("Function: ", Function);
console.log("Function.__proto__:", Function.__proto__)