import utils from '../utils/index';
const {log: {e}, checker:{is}} = utils;

/**Assuming
 * Task란 할일이 있고 그 하위에도 여러 Task들이 중첩되어 있다.
 * studying
 *      -cs
 *          -network
 *          -algorithm
 *              -dfs
 *              -bfs
 *      -english
 */
const Task = class extends Set {
    constructor(title = '') {
        super();
        this._title = title;
    }
    add(task) {
        if(!is(task, Task)) e('Invalid Type.');
        super.add(task);
        return this;
    } 
    getTask(task) {
        return this.has(task) ? [...this].filter(t => t===task)[0] : e(`"${task._title}" is not existed.`);
    }
    static reStore(tasks) {
        tasks = typeof tasks === 'string' ? JSON.parse(tasks) : tasks;
        const task = new Task(tasks.title);
        tasks.list.map(t=>task.add(Task.reStore(t)));
        return task;
    }
    toJSON() {
        return {
            title: this._title,
            list: [...this]
        };
    }
    clear(){} delete(){}
};


//Setting
const studyingTask = new Task('studying');
const csTask = new Task('cs');
studyingTask.add(csTask).add(new Task('english'));
const algoTask = new Task('algorithm');
csTask.add(new Task('network')).add(algoTask);
algoTask.add(new Task('dfs')).add(new Task('bfs'));

//Usage
const store = JSON.stringify(studyingTask); 
console.log(store); //{"_title":"studying","list":[{"_title":"cs","list":[{"_title":"network","list":[]},{"_title":"algorithm","list":[{"_title":"dfs","list":[]},{"_title":"bfs","list":[]}]}]},{"_title":"english","list":[]}]}
console.log(Task.reStore(store));

/** Explaination
 * memento 패턴은 자신의 상태값을 저장하고 복원하는 방식을 일컫는다.
 * 이 패턴은 대게 혼자 쓰이지 않고 command패턴과 같이 쓰인다. command패턴에서 각 command를 execute한후 undo할때 쓰이기 좋다.
 * reStore와 같은 재귀적인 처리를 composit 패턴으로 볼 수 있다.
*/