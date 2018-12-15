import utils from '../utils/index';
const {log: {e}, checker:{is}} = utils;

/**Assuming
 * 폴더와 파일들이 있고 전체를 순회하여 전체 구조의 오브젝트를 반환하는 객체를 만든다.
 * 각 type별 object: {type:folder, name:root, children:[]}, {type:file, name:log.txt}
 */


class Component {
    constructor(name, type) {
        this._name = name;
        this._type = type;
    }
    search(name) {
        return this._search(name);
    }
    explore() {
        return this._explore();
    }
    _explore() {e('must be overrided');}
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
    _explore() {
        return {
            type: this._type,
            name: this._name,
            child: this._child.map(v=>v.explore())
        }
    }
    _search(name) {
        const child = this._child.reduce((arr, c)=>{
            const matchedComponenet = c.search(name);
            if(matchedComponenet) arr.push(matchedComponenet);
            return arr;
        }, []);
        return child.length !== 0 ? {
            type: this._type,
            name: this._name,
            child: child
        } : false;
    }
}

class File extends Component {
    constructor(name) {
        super(name, 'File');
    }
    _explore() {
        return {
            type: this._type,
            name: this._name
        }
    }
    _search(name) {
        return name === this._name ? {
            type: this._type,
            name: this._name
        } : false;
    }
}



//Usage
const root = new Folder("Root");
const movie = new Folder('Movie');
const music = new Folder('Music');
root.add(movie).add(music);
movie.add(new File('Taitanic'));
music.add(new File("Shape of You"));
music.add(new File("Billie Jean"));

console.log(root.explore());
console.log(root.search('Taitanic'));

/** Explaination
 * 계층 구조에서 동일한 인터페이스를 구현하여 각 객체마다 재귀적으로 자신의 일을 각자 처리하도록 하는 패턴.
 * 계층 별 구조를 정의 했다면 각 계층에서 처리할 알고리즘 부분을 visitor를 이용하여 격리시킴.
*/