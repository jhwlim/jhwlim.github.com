
하지만 일대일 채팅이라면 굳이 DB를 거치지 않고도 만들 수 있지 않을까 생각하게 되었고, DB 없이 일대일 채팅을 어떻게 만들 수 있을지 한번 고민해보았다.

1. 우선 User1과 User2를 하나의 클래스로 묶고 이 클래스를 Key로 하여 `Map<Object, Set<WebSocketSession>>` 형태로 세션을 관리하는 것에 대해서 생각해보았다. 이 때 `equals()`와 `hashCode()`를 재정의해야 한다. 

2. 다른 방법은 `Map<Integer, Set<WebSocketSession>>` 형태로 세션을 관리하되, 웹소캣을 연결한 User의 seqId를 Key로 활용하는 것이다. 이때, handshake 과정에서 `WebSocketSession`에 sender와 receiver에 대한 정보를 담아 `WebSocketSession`을 특정할 수 있다.

3. `<Integer, Map<Integer, Set<WebSocketSession>>>` 형태로 관리하는 것도 하나의 방법일 수 있다. 이때, User1과 User2의 seqId를 Key로 순차적으로 `Set<WebSocketSession>`에 접근한다.
