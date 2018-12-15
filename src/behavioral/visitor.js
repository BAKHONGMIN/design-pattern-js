import utils from '../utils/index';
const {log: {e}, checker:{is}} = utils;

/**Assuming
 * composit pattern에 visitor pattern를 접목 시키기 때문에 먼저 composit pattern를 보고 와야 함.
 * 폴더와 파일의 중첩된 구조에서 
 */
class HierarchicalVisitor {
    constructor(){
        this._stack = [];
        this._curr = null;
    }
    start(){e('override');}
    end(){e('override');}
}

class WinExplorer extends HierarchicalVisitor {
    start(target) {
        switch (target._type) {
            case 'File':{
                this._curr.child.push(target.getInfo());
                break;
            }
            case 'Folder': {
                if(this._curr === null) {
                    this._curr = target.getInfo();
                    break;
                }
                this._stack.push(this._curr);
                this._curr = target.getInfo();
                break;
            }
        }
    }
    end() {
        if(this._stack.length === 0) {
            return this._curr;
        }
        if(this._curr.child.length) {
            const p = this._stack.pop();
            p.child.push(this._curr);
            this._curr = p;
        } else this._curr = this._stack.pop();
    }
}



class Component {
    constructor(name, type) {
        this._name = name;
        this._type = type;
    }
    static accept(visitor) {
        this.prototype._visitor = new visitor();
    }
    search(name) {
        return this._search(name);
    }
    _search() {e('must be overrided');}
}

class Folder extends Component {
    constructor(name) {
        super(name, 'Folder');
        this._child = [];
    }
    add(component){
        if(!is(component, Component)) e('invalid type');
        this._child.push(component);
        return this;
    }
    _search(name) {
        this._visitor.start(this);
        this._child.map((c)=>{c.search(name);});
        return this._visitor.end();
    }
    getInfo() {
        return  {
            type: this._type,
            name: this._name,
            child: []
        };
    }
}

class File extends Component {
    constructor(name) {
        super(name, 'File');
    }
    _search(name) {
        name === this._name && this._visitor.start(this);
    }
    getInfo() {
        return  {
            type: this._type,
            name: this._name
        };
    }
}

//Usage
Component.accept(WinExplorer);
const root = new Folder('Root');
const movie = new Folder('Movie');
const music = new Folder('Music');
const pop = new Folder('Pop');
root.add(movie).add(music);
movie.add(new File('Taitanic')).add(new File('love'));
music.add(new File('Shape of You')).add(new File('Billie Jean')).add(pop);
pop.add(new File('love'));
console.log(root.search('Shape of You'));

/** Explaination
 * 객체에서 변화율이 높은 처리 코드를 격리 시킴.
 * 컴포짓 패턴의 구조에서 처리코드를 격리하기 위해 visitor를 사용 할 수 있다. 
 * 
 * strategy패턴과 다른 점
 *      전략 패턴은 다양한 알고리즘에 대한 표준화된 인터페이스를 호스트에 제공해주고
 *      가령 상속을 통한 계층 구조 객체의 재귀적인 반복에서 알고리즘 부분을 격리 시키고 double dispatch를 통해 객체 타입에 맞는 알고리즘을 제공해준다.
 * 
 * 
 * double dispath
 * 설명하기에 앞서 javascript는 single dispatch이다. 호출될 메소드를 이름만을 가지고 정하기 때문이다. 동적으로 인자에 따라 메소드가 정해지지 않는다.
 * 자바 또한 오버로딩으로 multi dispatch를 제공해주는 것처럼 보이지만 실직적으로 컴파일시 정적으로 정해진다.
 * ex) 부모와 자식이 있고. 부모와 자식을 각각 받는 오버로딩된 메소드 2개가 있다고 가정한다.
 *     부모 = new 부모();
 *     부모 = new 자식();
 *     메소드(자식); 으로 호출하면 이미 컴파일시 정적으로 호출될 메소드는 정해져 있다. 자식이 내용물일지라도 부모를 받는 메소드가 호출 된다.
 * 
 * 이런 상황을 회피하고 구현된 객체에 맞는 메소드를 호출하기 위해 사용되는게 double dispatch이다.
 * 자식의 메소드 인자로 오버로딩된 메소드를 가진 객체를 넘겨주고 자식은 메소드(this)를 통해 자신을 넘겨주는 방식이다.
 * 
 * 두번 호출하기 때문에 double dispatch이지만 궁극적인 이유는 넘겨줄 인자의 타입을 동적으로 결정하기 위함이다.
 * 이러한 방식을 상속된 계층 구조를 만들고 순회하는 composit pattern에서 각 계층에 맞는 오버로딩된 메소드를 제공하기 위해 visitor pattern을 같이 사용하는 것이다.
*/