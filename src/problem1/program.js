var sum_to_n_a = function(n) {
    let sum = 0
    for (let i = 1; i <= n; i++) {
        sum += i
    }
    return sum
};
var sum_to_n_b = function(n) {
    let sum = 0
    while (n > 0) {
        sum +=n--
    }
    return sum
};

var sum_to_n_c = function(n) {
    return (n*(n+1))/2
};

console.log(sum_to_n_a(10))
console.log(sum_to_n_b(10))
console.log(sum_to_n_c(10))

