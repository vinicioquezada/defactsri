const redondeardecimales = (num, dec) => {
    return +(Math.round(num + ("e+" + dec))  + ("e-" + dec));
}
/*
function redondeardecimales(num, dec) {
    return +(Math.round(num + ("e+" + dec))  + ("e-" + dec));
}
*/
export {redondeardecimales}