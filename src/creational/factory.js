import utils from '../utils/index';
const {log: {e, log}, checker:{is, staticIs}} = utils;

/**Assuming
 * ui컴포넌트들을 각 패턴에 맞게 생성한다.
 */

//ui component
class Element{appendChild(){}}
class Button{}
class TextArea{}
const WinButton=class extends Button{constructor(){super();log('create winbutton');}};
const WinTextArea=class extends TextArea{constructor(){super();log('create wintextarea');}};
const MacButton=class extends Button{constructor(){super();log('create macbutton');}};
const MacTextArea=class extends TextArea{constructor(){super();log('create mactextarea');}};

//------------simple factory----------------
class ButtonDirectory extends Array {
    get(clazz) {
        if(!this.includes(clazz)) e('not exist the clazz');
        return new this[this.indexOf(clazz)]();
    }
    add(clazz) {
        if(!staticIs(clazz, Button)) e('invalid type');
        if(!this.includes(clazz)) this.push(clazz);
    }
    pop(){}shift(){}unshift(){}
}

const buttonDirectory = new ButtonDirectory();
buttonDirectory.add(Button);
buttonDirectory.add(WinButton);
buttonDirectory.add(MacButton);
log(buttonDirectory.get(MacButton));

//------------absctract factory----------------
{
class UIFactory {
    getButton() {e('overrie');}
    getTextArea() {e('overrie');}
}
class WinUIFactory extends UIFactory{
    getButton() {return buttonDirectory.get(WinButton);}
    getTextArea() {/*TextAreaDirectory.get(winTextArea)*/}
}
class MacUIFactory extends UIFactory{
    getButton() {return buttonDirectory.get(MacButton);}
    getTextArea() {/*TextAreaDirectory.get(MacTextArea)*/}
}
class Renderer {
    drawTextArea(target) {
        target.appendChild(this.factory.getTextArea());
    }
    drawButton(target) {
        target.appendChild(this.factory.getButton());
    }
    setFactory(uiFactor) {
        if(!is(uiFactor, UIFactory)) e('invalid type');
        this.factory = uiFactor;
    }
}
const renderer = new Renderer();
renderer.setFactory(new WinUIFactory);
renderer.drawButton(new Element());
renderer.setFactory(new MacUIFactory);
renderer.drawButton(new Element());
}

//------------factory method----------------
{
class ShadowingBox {
    draw() {
        const button = this._getButton();
        button.style = 'box-shadow: 5px 10px #888888';
        return button;
    }
    _getButton() {e('overrid');}
}
class WinShadowingBox extends ShadowingBox {
    _getButton() {return buttonDirectory.get(WinButton);}
}
class MacShadowingBox extends ShadowingBox {
    _getButton() {return buttonDirectory.get(MacButton);}
}
log(new WinShadowingBox().draw());
}


/** Explanation
 * factory pattern
 * 객체의 생성코드를 캡슐화 하는데 목적을 둔다.
 * 
 * factory method pattern <-> abstract factory pattern
 * 객체를 생성하는 하나의 메소드 <-> 관련 제품 또는 종속되는 제품을 생성하기 위한 인터페이스 
 * 객체를 생성하기 위한 메소드를 클라이언트에 노출한다. <-> 관련 있는 객체들을 생성하기 위해 객체로 노출된다.
 * 상속을 통해 '하위 클래스'에서 객체 생성의 책임을 진다. <-> composition을 이용하여 객체 생성의 책임을 '다른 클래스'에 위임한다.
 * 
 * factory method는 templat method에서 파생된 것으로 목적만 다를뿐 그 형태는 같음.
*/