import utils from '../utils/index';
const {log: {e, log}, checker:{is}} = utils;

/**Assuming
 * url를 로깅하고 param을 파싱하는 middleware를 구현한다.
 * 함수형의 middleware signature next => req => {}
 * 객체형은 next 메소드을 통해 decorator한다.
 */


 //-----------------함수형--------------------
const logger = next => req => {
    log('logged by logger');
    next(req);
};
const paramParser = next => req => {
    req.url.split('?')[1].split('&').reduce((param, v) => {
        const splited = v.split('=');
        param[splited[0]] = splited[1];
        return param;
    }, req.param);
    log('req is parsed by paramParser', 'blue');
    log(req);
    next(req);
};

class App {
    constructor() {
        this._router = new Map();
    }
    useMiddleware(...middlewares) {
        if(middlewares.length === 1) return this._middleware = middlewares[0];
        /**미들웨어 중첩 부분을 잘 봐야함.
         * 처음의 중첩은 next를 기억시키는 목적이고
         * request에서 routedFn를 마지막으로 next를 기억시키기 위한 중첩은 끝이 나고.
         * 바로 다시 함수를 호출시켜 arg에 url를 넣어서 중첩된 미들웨어를 순차적으로 실해시키는 구조임.
        */
        this._middleware = middlewares.reduce((a, b)=>(arg)=>a(b(arg)));
    }
    request(url) {
        const splited = url.split('/');
        //[htts, "", localhost, deco ~ .com]
        if(splited.length < 4) this._router('/')(new Request(url));
        const routedFn = this._router.get(splited[3].split('?')[0]);
        this._middleware(routedFn)(new Request(url));
    }
    get(url, f) {
        this._router.set(url, f);
    }
}

function Request(url) {Object.assign(this,{param:{}, url});}

//Usage
const app = new App();
app.useMiddleware(paramParser, logger);
app.get('decorator', (req)=>{
    log('receive decorator request');
});

app.request('http://localhost/decorator?name=kgc&email=kgc1753@naver.com');

//-----------------객체형--------------------
class Middleware {
    set(middle){this._middle = middle;}
    next(){e('must be overrided');}
}
class LoggerMid extends Middleware {
    next(req){
        //shomthing here..
        this._middle.next(req);
    }
}
class ParamParserMid extends Middleware {
    next(req){
        //shomthing here..
        this._middle.next(req);
    }
}
class App2 {
    constructor(){this._middle = null;}
    useMiddleware(...middlewares) {
        if(middlewares.some(v=>!is(v, Middleware))) e('invalid type');
        this._middle = middlewares[0];
        if(middlewares.length === 1) return;
        middlewares.reduce((a, b)=>(a.set(b), b));
    }
    request(url) {
        //shomthing here..
        this._middle.next(new Request(url));
    }
}


/** Explanation
 * 함수형과 객체형의 가장 큰 차이점은 객체의 this context를 쓰냐의 차이점이다.
 * 함수형은 함수를 값으로서 중첩시켜 목표를 꾸며주는 반면 객체는 동일 메소드를 이용하여 재귀적으로 실행하며 this context를 이용한 객체 내부에서의 상태 공유가 핵심임.
*/