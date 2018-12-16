import utils from '../utils/index';
const {log: {e, log}} = utils;

/**Assuming
 *data를 구현클래스에 맞게 출력한다.
 */

class Renderer {
    render(data) {
        this._render(data);
    }
    _render(){e('must be overrided.');}
}

class ConsoleRenderer extends Renderer {
    _render(data) {
        log(`${data} is rendered using console.`);
    }
}

class CanvasRenderer extends Renderer {
    _render(data) {
        log(`${data} is rendered using canvas.`);
    }
}

//Usage
let renderer = new ConsoleRenderer();
renderer.render('^_^');
renderer = new CanvasRenderer();
renderer.render('^_^');

/** Explaination
 *변화율이 높은 코드를 상속위임으로 격리하는 패턴이다.
 *변하지 않는 부분을 추상화하여 부모쪽에서 정의하고 변화되는 부분을 자식 클래스에서 구현한다.
 *소유위임인 전략패턴과 같지만 성격상 상속과 소유의 차이는 분명히있기 때문에 잘 생각하고 둘중에 무엇이 맞는지 oop관점에서 생각하고 구현해야된다.
*/