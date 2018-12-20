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
 * 
 * 이 패턴은 변경에는 닫혀 있고 확장에는 열려 있는 원칙이 묻어 있는 패턴이다.
 * 기능 추가에 코드 변경이 필요 없으며 decorator객체를 추가하여 기능을 무한히 확장할 수 있다.
 * 
* decorator vs chain of resp
 * composition를 통해 유연하고 상속이 필요없는 솔루션을 제공해주는 점은 같다.
 * 차이는 디자인패턴의 대분류에서 찾을 수 있다.
 * decorator는 structural 디자인 패턴이다. 계층적인 구조를 갖으며 기능을 확장해서 하나의 결과를 얻는다. 
 * 그 결과가 특정 값이 될지 확장된 객체가 될지는 체인의 성격에 따라 다르다.
 * cor는 behavioral 디자인 패턴이다. 즉 연결된 객체들이 행동에 관련되어 있다. 다르게 말하면 책임과 권한에 대한 행동이다.
 * 요청이 오면 자신이 처리할 수 있는 권한이 있는지와 요청을 처리해야될 책임이 있는지 확인하고 요청을 처리한 후 객체의 특성에 따라 요청을 계속 통과 시키던지 아니면 중간에 끊을 수 있다.
 * 즉 기능 확장 vs 처리할 책임이 있는 행동 추가라고 말할 수 있다.
*/