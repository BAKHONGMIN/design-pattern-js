const error = (m) => {throw m;};
const log = (m, color) => !color ? console.log(m) : console.log('%c'+m,`color:${color};font-weight:bold`);

export default {
    e: error,
    log
};