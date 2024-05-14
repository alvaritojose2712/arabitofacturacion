export const moneda = (value, decimals = 2, separators = ['.', ".", ',']) => {
    decimals = decimals >= 0 ? parseInt(decimals, 0) : 2;
    separators = separators || ['.', "'", ','];
    var number = (parseFloat(value) || 0).toFixed(decimals);
    if (number.length <= (4 + decimals))
        return number.replace('.', separators[separators.length - 1]);
    var parts = number.split(/[-.]/);
    value = parts[parts.length > 1 ? parts.length - 2 : 0];
    var result = value.substr(value.length - 3, 3) + (parts.length > 1 ?
        separators[separators.length - 1] + parts[parts.length - 1] : '');
    var start = value.length - 6;
    var idx = 0;
    while (start > -3) {
        result = (start > 0 ? value.substr(start, 3) : value.substr(0, 3 + start))
            + separators[idx] + result;
        idx = (++idx) % 2;
        start -= 3;
    }
    return (parts.length == 3 ? '-' : '') + result;
}

export const number = (val, len = null) => {
    if (typeof(val)=="string") {

        if (val == "") return ""

        if (len) {
            val = val.substr(0, len)
        }
        return val.replace(/[^\d|\.|\-]+/g, '')
    }else if(typeof(val)=="number"){
        return val
    }else{

        return "Error: Esto no es un número. "+ typeof(val)
    }
}