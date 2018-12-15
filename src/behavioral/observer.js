import utils from '../utils/index';
const {log: {e}, checker:{is}} = utils;

/**Assuming
 * mvc패턴의 형태로 view: display, controller: bankapp, model: account의 구조로 작성하고 
 * model의 변화를 controller가 observing하고 있다가 model에 변화가 생기면 controller가 view를 갱신해준다.
 */

class Observer {listen(){e('override');}};
class Observable {
    constructor() {
        this._listener = new Set();
    }
    _notify(data) {this._listener.forEach(o=>o.listen(data));}
    addListener(listener) {
        if(is(listener, Observer)) e('override');
        this._listener.add(listener);
    }
}
class Account extends Observable {
    constructor() {
        super();
        this._balance = 500;
    }
    deposit(amount) {
        setTimeout(() => {
            this._balance += amount;
            this._notify(this._balance);
        }, 100);
    }
    getBalance() {
        return this._balance;
    }
}
class BankApp extends Observer {
    constructor(account, display) {
        super();
        this._account = account;
        this._display = display;
        this._account.addListener(this);
    }
    deposit(amount) {
        this._account.deposit(amount);
    }
    print() {
        this._display.print(this._account.getBalance());
    }
    listen(amount) {
        display.print(amount);
    }
}
class Display {
    print(data) {
        console.log(data);
    }
}

//Usage
const display = new Display;
const app = new BankApp(new Account(), display);
app.print();
app.deposit(1000);

/** Explaination
 * model이 변했다고 model 자신이 화면을 바꾸면 안된다. 그건 mvc에서 model의 역할과 권한을 넘는 것이다.
 * model은 단순히 데이터 변화를 controller에게 알리기만 하면 된다.
 * controller는 model에게 데이터를 전달한 후 바로 view에게 그리는 명령을 내리면 안된다. model이 데이터를 안전하게 저장되었는지 확인 후 view에게 명령을 내려야 한다.
 * 그렇기 때문에 controller는 model를 observing하고 있어야 한다.
 * 
 * observer를 사용하는 궁극적인 이유는 '권한 축소, 제한'이다.
 * 'hollywood principle'을 지키기 위해 변화가 있을때 자신의 권한을 넘는 행동을 하지 않고 그저 상위 레벨의 객체에게 알리기만 하는 것이다. 
*/