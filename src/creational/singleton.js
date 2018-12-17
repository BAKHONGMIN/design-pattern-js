import utils from '../utils/index';
const {log: {e, log}} = utils;

{
    const SingleInstance = (()=>{
        const ticket = Symbol();
        return class Person {
            constructor(_ticket) {
                if(_ticket !== ticket) e('new is not allowed');
                this.instance = null;
            }
            static getinstance() {
                return this.instance ? this.instance : this.instance = new this(ticket);
            }
        };
    })();

    const p1 = SingleInstance.getinstance();
    const p2 = SingleInstance.getinstance();
    log(p1 === p2);
    //const p3 = new SingleInstance(); error
} 

//---------constructor에서 강제하기---------------

{
    class SingleInstance {
        constructor() {
            return SingleInstance.instance ? SingleInstance.instance : SingleInstance.instance = this;
        }
    }

    const p1 = new SingleInstance();
    const p2 = new SingleInstance();
    log(p1 === p2);
}

/** Explanation
 * 제 3자가 사용하기에 싱글톤 객체를 new 연산을 통해 가져오는 건 어색함이 있음. 이름에 singleton를 매번 붙일수도 없는 노릇이기에
 * 자유변수와 symbol를 이용하여 외부에서 new 연산을 통한 생성을 금지하였음.
*/