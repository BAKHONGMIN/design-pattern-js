import utils from '../utils/index';
const {log: {log}} = utils;

/**Assuming
 * 집을 짓는 builder를 만든다. 집은 기본적으로 위치와 평수를 가지고 있어야 한다.
 */

const House = (()=>{
    const _prop = new WeakMap();
    return class House {
        constructor(builder) {
            _prop.set(this, Object.assign({
                floor: 1,
                parkinglot: false,
                guard: 'none'
            }, builder));
        }
        printInfo() {
            const prop = _prop.get(this);
            log(JSON.stringify(prop));
        }

        static get Builder() {
            return class {
                constructor(adress, sqft) {
                    this.adress = adress;
                    this.sqft = sqft;
                }
                addFloor(floor) {
                    this.floor = floor;
                    return this;
                }
                addElevator(elevator) {
                    this.elevator = elevator;
                    return this;
                }
                addParkingLot() {
                    this.parkinglot = true;
                    return this;
                }
                hiringGuard(guard) {
                    this.guard = guard;
                    return this;
                }
                build() {
                    return Object.freeze(new House(this));
                }
            };
        }
    };
})();

//Default parameter is address, sqft
const apartmentA = new House.Builder('addressA', 1000)
    .addFloor(10)
    .addElevator()
    .addParkingLot()
    .hiringGuard('kim').build();
apartmentA.printInfo();
apartmentA.floor = 100;

const house = new House.Builder('addressB', 800).addParkingLot().build();
house.printInfo();

/**Explanation
 * 빌더 패턴 적용을 고려해볼 수 있는 상황.
 *      객체에 여러 표현이 필요한 경우.
 *      클라이언트에서 전달할 인자가 너무 많은 경우.
 *      선택적 인자가 있을 경우.
 * 
 * 빌더 작성시 결정 사항.
 *      필수적인 속성과 선택적 속성을 결정한다.
 *      업데이트 가능한 속성과 불가능한 속성을 결정해야 한다.
 *      생성되는 개체의 생명주기와 같은 속성을 확인해야 되고 빌더는 이 속성을 강조할 수 있도록 디자인 되어야 한다.
 * 
 * 이는 객체 복잡한 객체 생성을 캡슐화 하는데 정의가 그치지 않고 더 나아가 
 * 코드에 비즈니스 의미를 추가해주어 더 나은 코드를 작성하는데 도움을 준다. 위와 같은 생각을 통해.
 * 
 * 고민거리.
 *      1. 생성된 객체에서 속성을 변경할 수 있도록 해야 되나?
 *          -그렇다면 빌더에서 할당된 obtional 속성만 변경 가능한가 아니면 모든 obtional 속성이 다 변경 가능한가?
 *      2. 생성된 클래스는 불변 객체로 빌드해서 만들어진 값 그대로 consistency를 유지해야 되나?
 * 
 * 객체 생성의 복잡도를 줄이는 것 이외에도 좀더 깊이 들어가면 객체의 비즈니스 의미를 부여하는 부분까지 고민하게 되는 패턴이다.
 */



