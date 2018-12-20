## Design Pattern with Javascript
개인 학습 용도로 작성 되었기에 각 패턴에 대한 견해는 틀린 부분이 있을 수 있습니다. <br/>
이하 패턴 설명 부분은 소스 코드 설명에서 일부 발췌한 부분으로 소스 코드 파일에 더욱 자세한 설명이 기술되어 있습니다.

### Creational Patterns
- **Factory:** 객체의 생성코드를 캡슐화 하는데 목적을 둔다. factory method는 templat method에서 파생된 것으로 목적만 다를뿐 그 형태는 같다.
- **Singleton:** 객체의 instance 갯수를 제한 한다.
- **Builder:** 객체의 생성을 캡슐한다. 생성 요소중 Mandatory와 Optional을 명확히 표현하여 복잡도를 낮추는 패턴.

### structural Patterns
- **Composite:** 계층 구조에서 동일한 인터페이스를 구현하여 각자가 자신이 처리할 일에만 집중하여 개별 객체를 동일한 방식으로 처리할 수 있도록 한다.
- **Decorator:** 동적으로 기능을 코드 변경 없이 확장 할 수 있도록 한다.
- **Flyweight:** 데이터 생성의 비효율적인 비용을 데이터 공유를 통해 줄인다.

### behavioral Patterns
- **Memento:** 객체의 상태값을 저장하고 복원할 수 있도록 한다.
- **Observer:** subject의 변화를 subscriber가 subscribe해서 감시한다.
- **Strategy:** 변화되는 부분을 외부로 빼내어 전략객체로 받아서 사용한다.
- **TemplateMathod:** 변화되는 부분을 상속을 통해 하위객체로 위임한다.
- **Visitor:** 상속을 통한 계층 구조 객체의 재귀적인 반복에서 알고리즘 부분을 격리 시키고 double dispatch를 통해 객체 타입에 맞는 알고리즘을 제공해준다.
- **Command:** 행동을 하거나 이벤트를 트리거하는데 필요한 정보를 캡슐화하여 객체로 사용한다.
- **ChaninOfResp:** 체인을 통과하는 데이터에 책임과 역할이 있는 작업을 코드 변경 없이 추가한다.
- **Mediator:** 객체간의 직접적인 관계를 중재자를 통하여 상호작용하도록 만들어 결합도를 낮춘다.
