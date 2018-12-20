import utils from '../utils/index';
const {log: {log}} = utils;

/**Assuming
 * iphone의 기종을 만들고 용량, 색상에 따라 여러 제품으로 출고한다.
 * 기본 아이폰 제품을 만들고 용량과 색상을 더해서 아이폰8 제품으로 만들어 본다.
 */

//8제품 등록
class PhoneStore {
    constructor() {
        this._smartPhoneInventories = [];
    }
    add(phone) {
        this._smartPhoneInventories.push(phone);
    }
    getCount() {return this._smartPhoneInventories.length;}
}

class SmartPhoneProducts {
    static get products() {
        return SmartPhoneProducts._products ? SmartPhoneProducts._products : (SmartPhoneProducts._products = new Map());
    }
    static get(os, display, model) {
        if(!this.products.has(model)) this.products.set(model, new Iphone(os, display, model));
        return this.products.get(model);
    }
    static getCount() {return SmartPhoneProducts.products.size;}
}

//flyweight
const Iphone = function(os, display, model) {Object.assign(this,{os, display, model});};
const SmartPhone = function(os, display, model, capacity, color) {
    Object.assign(this, {
        model: SmartPhoneProducts.get(os, display, model),
        capacity,
        color
    });
};




const store = new PhoneStore();
store.add(new SmartPhone('ios12', '4.7', 'Iphone8', 64, 'gold'));
store.add(new SmartPhone('ios12', '4.7', 'Iphone8', 256, 'silver'));
store.add(new SmartPhone('ios12', '5.5', 'Iphone8_plus', 64, 'gray'));
store.add(new SmartPhone('ios12', '5.5', 'Iphone8_plus', 256, 'gold'));

log(SmartPhoneProducts.getCount());//2
log(store.getCount());//4


/** Explanation
 * 객체 생성에 대한 비용을 줄이기 위해 객체를 재사용하는 패턴으로 도메인 모델에서 재사용 가능한 객체를 추출하는데 유의를 하여야 한다
 * 고유 상태와 외부 상태로 데이터를 분리할 수 있다. 고유 상태란 객체 하나를 나타낼 수 있는 집합이고
 * 외부 상태란 객체의 존재유무 나타내는 것을 제외한 모든 상태를 일컫는다.
 * 고유 상태는 객체 그 자체를 나눌 수 있는 정보이고 이는 곧 그 객체는 변경이 필요없는 불변의 객체라고 볼 수 있다. 그렇기 때문에 재사용 가능한 데이터로 사용 할 수 있다.
 * 외부의 상태가 존재하여 객체에서 제거된 경우 대게 재사용 객체를 만들어 주는 factory를 소유하고 있는 객체에서 관리해서 캡슐화 한다.
 */
