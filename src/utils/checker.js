const is = (child, parent) => child instanceof parent;
const staticIs = (child, parent) => {
    let a = child;
    do{
        if(a === parent) break;
    } while((a = a.__proto__));
    return a === parent;
};
export default {
    is,
    staticIs
};
