import utils from '../utils/index';
const {log: {e, log}, checker:{is}} = utils;

/**Assuming
 * 비행중인 비행기 A, B, C, D와 관제탑 Pylon
 * 각 비행기들은 착륙중, 착륙대기, 이륙대기등의 상태가 있고 이,착륙 가능 상태에 대한 정보를 비행기들이 직접 통신하는게 아닌
 * 광제탑을 통해서 전달하고 전달 받는다.
 */
const Flight = (()=>{
    const ENUMS = {'LAND':Symbol(),'LANDED':Symbol(),'TAKEOFF':Symbol(),'TOOKOFF':Symbol()};
    Object.keys(ENUMS).map(k=>ENUMS[ENUMS[k]] = k);
    class Flight {
        constructor(name) {
            this.name = name;
            this._pylon = null;
        }
        send(state) {
            if(!this._pylon) return;
            this._pylon.send(state, this);
        }
        connectPylon(pylon) {
            this._pylon = pylon;
        }
        handle(msg, from) {
            log(`${this.name} is receive meg:${from} state is ${msg}`, 'red');
        }
    }
    return Object.assign(Flight, ENUMS);
})();
class Pylon {
    constructor() {
        this._flights = new Map();
    }
    send(state, from) {
        this._flights.forEach(f=>{
            if(from === f) return;
            f.handle(Flight[state], from.name);
        });
        
    }
    register(...flights) {
        flights.map(f=>{
            this._flights.set(f.name,f);
            f.connectPylon(this);
        });
    }
}


 //Usage
 const a = new Flight('A');
 const b = new Flight('B');
 const c = new Flight('C');
 const d = new Flight('D');
 const pylon = new Pylon();
 pylon.register(a,b,c,d);
 a.send(Flight.LAND);
 log('-------------');
 a.send(Flight.LANDED);
 log('-------------');
 b.send(Flight.LAND);

/** Explanation
 * 객체간의 직접적인 관게가 너무 많을 경우 중재자를 통해서 통신을 하여 '통신을 중앙 집중화' 시킨다.
 * 중재자를 통해서 객체 간의 상호작용을 캡슐화 하기 때문에 명시적으로 서로 참조하지 않아 객체들간의 결합도를 낮출 수 있다.
*/