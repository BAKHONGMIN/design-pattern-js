import utils from '../utils/index';
const {log: {e, log}, checker:{is, staticIs}} = utils;

/**Assuming
 * command pattern에 memento pattern과 factory pattern을 접목 시키기 때문에 먼저 학습하고 오면 좋다.
 * todo app과 그 안에 할일 task가 있고 task의 기능을 taskCommand가 구현하고 있다.
 * todo app은 모든 명령을 알고 있고 취소할 수도 있다.
 * studying
 *      -cs
 *          -network
 *          -algorithm
 *              -dfs
 *              -bfs
 *      -english
 */

 //command factory
const taskCommandDir = (()=>{
    class TaskCommandDirectory extends Map {
        getCommand(name, task) {
            if(!this.has(name)) e('not exist the name');
            return new (super.get(name))(task);
        }
        add(name, clazz) {
            if(!staticIs(clazz, TaskCommand)) e('invalid type');
            if(!this.has(name)) super.set(name, clazz);
        }
        set(){} clear(){}
    }
    
    class TaskCommand {
        constructor(task) {
            this._task = task;
            this._undo = null;
        }
        execute() {e('override');} 
        undo() {
            this._task.resotre(this._undo);
        }
    }
    class AddCommand extends TaskCommand {
        execute(task) {
            this._undo = this._task.save();
            this._task._list.push(task);
        }
    }
    class RemoveCommand extends TaskCommand {
        execute(task) {
            this._undo = this._task.save();
            this._task._list.splice(this._task._list.indexOf(task), 1);
        }
    }
    
    const taskCommandDir = new TaskCommandDirectory();
    taskCommandDir.add('add', AddCommand);
    taskCommandDir.add('remove', RemoveCommand);
    return taskCommandDir;
})();

const TodoApp = ((commandDir)=>{
    //observer pattern
    class Subject {
        constructor(listener) {this._listener = listener;}
        _notify(name, ...arg){this._listener.listen(this, name, ...arg);}
    }
    class Task extends Subject {
        constructor(title = '', listener) {
            super(listener);
            this._title = title;
            this._list = [];
        }
        add(task) {
            if(!is(task, Task)) e('Invalid Type.');
            this._notify('add', task);
            return  this;
        } 
        remove(task) {
            if(!is(task, Task)) e('Invalid Type.');
            if(!this._list.includes(task)) e('not exist');
            this._notify('remove', task);
            return  this;
        }
        save() {
            return JSON.stringify(this);
        }
        resotre(tasks) {
            tasks = typeof tasks === 'string' ? JSON.parse(tasks) : tasks;
            this._title = tasks.title;
            this._list = tasks.list.map(t=>new Task().resotre(t));
            return this;
        }
        toJSON() {
            return {
                title: this._title,
                list: this._list
            };
        }
        getInfo(indent='ㅡ') {
            log(indent+this._title);
            this._list.map(v=>v.getInfo(indent+'ㅡ'));
        }
    }

    return class TodoApp {
        constructor() {
            this._commands = [];
        }
        listen(caller, name, ...arg) {
            const cmd = commandDir.getCommand(name, caller);
            cmd.execute(...arg);
            this._commands.push(cmd);
        }
        undo() {
            const cmd = this._commands.pop();
            cmd.undo();
        }
        getTask(title) {
            return new Task(title, this);
        }
    };
})(taskCommandDir);

//Setting
const app = new TodoApp();
const studying =  app.getTask('studying');
const cs =  app.getTask('cs');
studying.add(cs).add(app.getTask('english'));
const algorithm =  app.getTask('algorithm');
cs.add(app.getTask('network')).add(algorithm);
const dfs = app.getTask('dfs');
algorithm.add(dfs).add(app.getTask('bfs'));

//Usage
studying.getInfo();
algorithm.remove(dfs);
log('Remove dfs in algorithm', 'blue');
studying.getInfo();
app.undo();
log('Undo remove command', 'blue');
studying.getInfo();
studying.remove(cs);
log('Remove cs in styding', 'blue');
studying.getInfo();
app.undo();
log('Undo remove command', 'blue');
studying.getInfo();

/** Explaination
 * 기능을 객체화 시키는 패턴이다. 기능을 객체화 시키면 값으로써 저장할 수 있기에 undo가 가능하고 또한 외부에서 구현된 객체로 받아서 사용할 수도 있다.
 * command객체를 이용하여 변화 빈도가 높은 기능 코드를 외부로 격시시켰기 때문에 Task객체는 변화에 닫혀있다. 즉 Task는 command도 모르고 app도 모른다.
 * 어느 객체에도 의존성이 없기 때문에 안전한 코드이다. 변화는 자기 자신안에서만 일어나기 때문이다.
 * app은 command와 task를 연결하는 중간 다리로 Task의 생성정보와 commandDir에서 command 객체를 가지고 오는 지식만을 가지고 있다.
 * taskcommand는 task의 기능을 구현해야 하기에 강하게 task에 의존하고 있기에 Task의 변경에 영향을 받지만 Task는 Command를 모르기에
 * 언제라도 taskCommanDir를 갈아끼워서 유연하게 기능을 확장할 수 있다.
 * 
 * 
*/