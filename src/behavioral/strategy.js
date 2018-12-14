import utils from '../utils/index';
const {log: {e}, checker:{is}} = utils;

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
    }
}

class Weapon {
    attack(){e('must be overried.');}
}
class Hands extends Weapon {
    attack(){console.log('손으로 공격');}
}
class Spear extends Weapon {
    attack(){console.log('창으로 공격');}
}
class Gun extends Weapon {
    attack(){console.log('총으로 공격');}
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
*/