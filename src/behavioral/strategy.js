import utils from '../utils/index';
const {log: {e, log}, checker:{is}} = utils;

/**Assuming
 * 케릭터가 무기를 장착하고 공격한다.
 */

class Character {
    constructor() {
        this._weapon = new Hands();
    }
    setWeapon(weapon) {
        if(!is(weapon, Weapon)) e('invalid type.');
        this._weapon = weapon;
    }
    attack() {
        if(!this.isAttackPossible()) return;
        this._weapon.attack();

    }
    isAttackPossible(){
        //something here..
        return true;
    }
}

class Weapon {
    attack(){e('must be override.');}
}
class Hands extends Weapon {
    attack(){log('Attack by hand');}
}
class Spear extends Weapon {
    attack(){log('Attack by spear');}
}
class Gun extends Weapon {
    attack(){log('Attack by gun');}
}

//Usage
const human = new Character();
human.attack();
human.setWeapon(new Spear());
human.attack();
human.setWeapon(new Gun());
human.attack();

/** Explaination
 * 변화되는 부분을 외부에서 전략객체를 받아서 사용한다.
 * attack의 경우 캐릭터가 공격 가능한지에 대한 알고리즘은 변경될 일이 거의 없는 반면에 무기에 대한 로직은 아이템에 따라 매번 변한다. 그래서 외부에서 전략 객체를 받아 해당 로직을 위임하여 변화를 격리 시킨다.
 * 
 * visitor패턴과 다른 점
 *      전략 패턴은 다양한 알고리즘에 대한 표준화된 인터페이스만을 제공해주고
 *      visitor 패턴은 각 호스트 타입에 맞는 알고리즘을 제공해주기 위해 사용한다.
 * 즉 전략패턴은 런타임에 필요한 알고리즘만 제공하고 그 이외에 것은 호스트가 결정한다.
 * 방문자 패턴은 가령 상속을 통한 계층 구조 객체의 재귀적인 반복에서 알고리즘 부분을 격리 시키고 객체 타입에 맞는 알고리즘을 제공해주는 패턴.
 * 
*/