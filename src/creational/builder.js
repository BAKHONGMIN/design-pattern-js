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
 * telescoping pattern
 *      객체 생성시 모든 인자를 한번에 넘기는 것.
 * javabean pattern
 *      객체 생성후 의미있는 setter를 이용하여 객체를 만드는 것.
 * 위 두개를 적절히 섞은게 build pattern
 * 
 * 
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
 * - 추가 comment -
 * flyweight패턴을 공부보면서 고유(intrinsic), 외부(extrinsic) 상태로 데이터(객체)를 분리할 수 있다는 것을 알았다. 
 * 고유의 상태는 객체 하나을 나타내는 정보이며 그 상태 자체로 불변의 객체이다. 외부 상태는 객체 존재를 나타낼 수 있는 부분을 제외한 추가적인 정보이다.
 * 집의 경우 주소, 소유자, 면적등이 고유한 집의 본질적인 상태일 것이고 이는 고유한 집 객체 하나를 나타낸다. 고유하기 때문에 flyweight에서 재사용 데이터로 사용될 수 있는 것이고
 * build패턴 에서는 mandatory 상태이며 불변의 상태가 되어야 한다. 층, 에리베이터, 주차장의 유무 등은 외부 상태로 객체 존재 자체를 나타내는 것이 아니기 때문에
 * 생성된 객체에서 수정가능 하여도 consistency를 깨는 일이 아닐것 같다는 생각을 하게 되었다.
 * 고로 flyweight의 재사용 데이터를 추출할 때 intrinsic, extrinsic 상태의 개념을 잘 알면 build의 생성객체의 amndatory, obtional 속성을 결정하는데 많은 도움이 될 것 같다.
 * 디자인 패턴은 역시 상호보완적이며 개념과 원칙들이 일맥상통한다는 것을 한번더 느낀다.
 * 
 * 
 * 
 */



