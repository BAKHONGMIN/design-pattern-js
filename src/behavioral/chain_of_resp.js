import utils from '../utils/index';
const {log: {log}} = utils;

/**Assuming
 * spring secutiry와 같이 각 역할과 책임이 있는 필터를 만들어 체이닝한다.
 */

const viewer = {view:(view)=>log('forward: '+ view, 'blue')};
const SecutiryCtxCreator = (next) => (arg) => {
    arg.secutiry = {
        role: null,
        authenication: false,
    };
    next(arg);
};
const LogoutFilter = (next) => (arg) => {
    if(arg.url === 'logout') {
        //Process logout Procedure.
        //Initialize the user's session.
        return viewer.view('login_page');
    } else next(arg);
};
const LoginFilter = (next) => (arg) => {
    let isCerticfication = false;
    //Check ths id and password.
    isCerticfication = true;
    if(isCerticfication) {
        arg.secutiry.authenication = true;
        next(arg);
    }
    else return false;
};
const AuthorizationFilter = (next) => (arg) => {
    //Get user's role in DB
    arg.secutiry.role = 'admin';
    next(arg);
};
const ServletDispatcher = (arg) => {
    //servlet searching..
    console.log(JSON.stringify(arg));
    return viewer.view('main_page');
};
function request(url){this.url = url;}

const combine = (...filters) => {
    return filters.reduce((a, b) => (next) => a(b(next)), (next) => (arg) => next(arg));
};

const springSecutiry = combine(SecutiryCtxCreator, LogoutFilter, LoginFilter, AuthorizationFilter)(ServletDispatcher);
springSecutiry(new request('login'));


/** Explanation
 * 일련의 책임을 가지고 있는 작업들을 연결 시킨다. 작업들중 자신이 책임 져야할 일이 오면 처리하고 체인을 끊을수도 있다.
 * 
 * decorator vs chain of resp
 * composition를 통해 유연하고 상속이 필요없는 솔루션을 제공해주는 점은 같다.
 * 차이는 디자인패턴의 대분류에서 찾을 수 있다.
 * decorator는 structural 디자인 패턴이다. 계층적인 구조를 갖으며 기능을 확장해서 하나의 결과를 얻는다. 
 * 그 결과가 특정 값이 될지 확장된 객체가 될지는 체인의 성격에 따라 다르다.
 * cor는 behavioral 디자인 패턴이다. 즉 연결된 객체들이 행동에 관련되어 있다. 다르게 말하면 책임과 권한에 대한 행동이다.
 * 요청이 오면 자신이 처리할 수 있는 권한이 있는지와 요청을 처리해야될 책임이 있는지 확인하고 요청을 처리한 후 객체의 특성에 따라 요청을 계속 통과 시키던지 아니면 중간에 끊을 수 있다.
 * 즉 기능 확장 vs 처리할 책임이 있는 행동 추가라고 말할 수 있다.
 * 
*/