## Design Pattern with Javascript(es6)
각 패턴에 대한 견해는 틀린 부분이 있을 수 있습니다. <br/>
이하 패턴 설명 부분은 소스 코드 설명에서 일부 발췌한 부분으로 소스 코드 파일에 더욱 자세한 설명이 기술되어 있습니다.


### Creational Patterns
- **Factory:** 객체의 생성코드를 캡슐화 하는데 목적을 둔다. factory method는 templat method에서 파생된 것으로 목적만 다를뿐 그 형태는 같다.
  
- **Singleton:** 객체의 instance 갯수를 제한 한다.

### structural Patterns
- **Composite:** 계층 구조에서 동일한 인터페이스를 구현하여 각 객체마다 재귀적으로 자신의 일을 각자 처리하도록 한다.
- **Decorator:** 동적으로 기능을 추가 또는 재정의 한다.

### behavioral Patterns
- **Memento:** 객체의 상태값을 저장하고 복원할 수 있도록 한다.
- **Observer:** subject의 변화를 subscriber가 subscribe해서 감시한다.
- **Strategy:** 변화되는 부분을 외부로 빼내어 전략객체로 받아서 사용한다.
- **TemplateMathod:** 변화되는 부분을 상속을 통해 하위객체로 위임한다.
- **Visitor:** 상속을 통한 계층 구조 객체의 재귀적인 반복에서 알고리즘 부분을 격리 시키고 double dispatch를 통해 객체 타입에 맞는 알고리즘을 제공해준다.

### 문의
kgc1753@naver.com
