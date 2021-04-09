---
title: "Spring WebSocketHandler를 이용한 실시간 채팅 구현하기"
excerpt: "Spring WebSocketHandler를 이용하여 WebSocketSession 레벨에서 실시간 채팅 구현하기"
categories: spring
tags: spring-websocket websocket WebSocketHandler
---
## Intro
[이전 포스트](/spring/spring-websocket-tutorial-stomp-1)에서는 STOMP를 이용하여 간단한 실시간 채팅을 만들어보았다. 이번 포스팅에서는 `WebSocketHandler`를 이용하여 실시간 채팅을 만들어보려고 한다.

## 1. Maven Dependencies
- 웹소캣 사용을 위한 의존성 라이브러리 추가
  
```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-websocket</artifactId>
    <version>${org.springframework-version}</version> <!-- springframework-version 4.0 이상 -->
</dependency>
```

<br>

- 메시지 데이터를 JSON으로 변환하기 위한 의존성 라이브러리 추가
  
```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-core</artifactId>
    <version>2.10.2</version>
</dependency>		
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId> 
    <version>2.10.2</version>
</dependency>

<!-- Gson -->	
<dependency>
    <groupId>com.google.code.gson</groupId>
    <artifactId>gson</artifactId>
    <version>2.8.5</version>
</dependency>
```

## 2. WebSocket Config 클래스 생성
`WebSocketConfigurer` 인터페이스를 `implements`하고, `@Configuration`, `@EnableWebSocket` 어노테이션을 클래스에 추가한다.
- `registerWebSocketHandlers()` : WebSocketHandler를 등록하고 설정하는 메서드

```java
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry
            .addHandler(new MessageHandler(), "/ws")  // [1]
            .withSockJS();  // [2]
    }
    
}
```

- [1] : `TextWebSocketHandler`를 상속하는 `MessageHandler`를 WebSocketHandler로 등록하고, 웹소캣 연결 url을 `/ws`로 설정
- [2] : 클라이언트에서 WebSocket을 지원하지 않을 경우 fallback 옵션 설정

## 3. Message Model 클래스 생성
- 메시지를 브라우저로부터 받을 때, 데이터를 담을 Model 클래스 생성

```java
@Data   // getters & setters (Lombok)
public class Message {

    private String from;
    private String text;

}
```

<br>

- 메시지를 브라우저에 보낼 때, 데이터를 담을 Model 클래스 생성

```java
@Data               // getters & setters (Lombok)
@NoArgsConstructor  // 기본 생성자 (Lombok)
@AllArgsConstructor // 필드를 모두 포함하는 생성자 (Lombok)
public class OutputMessage {

    private String from;
    private String text;
    private String time;
    
}
```

## 4. MessageHandler 클래스 생성
`TextWebSocketHandler`를 상속하며, 위에서 생성한 WebSocketConfig 객체에 Handler를 등록해야 한다.
- `afterConnectionEstablished()` : 웹소캣 연결이 이루어질 때 호출되는 메서드
- `handleTextMessage()` : 클라이언트로부터 메시지가 수신될 때 호출되는 메서드
- `afterConnectionClosed()` : 웹소캣 연결이 끊어질 때 호출되는 메서드

```java
public class MessageHandler extends TextWebSocketHandler {
    
    Set<WebSocketSession> sessions = new HashSet<>();  // [1]
    
    Gson gson = new Gson();  // [2]
    
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);  // [3]
    }
    
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();  // [4]
        Message m = gson.fromJson(payload, Message.class);  // [5]
        
        // OutputMessage 처리하기
        String time = new SimpleDateFormat("HH:mm").format(new Date());
        OutputMessage output = new OutputMessage(m.getFrom(), m.getText(), time);
        
        // 연결된 Session 전체에 OutputMessage 보내기
        for (WebSocketSession s : sessions) {
            s.sendMessage(new TextMessage(gson.toJson(output)));  // [6]		
        }
    }
    
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);  // [7]
    }
}
```

- [1] 웹소캣 연결이 이루어진 세션을 담는 `Set` 
- [2] JSON 형식으로 전달된 메시지를 변환하기 위해 사용하는 `Gson` 변수 
- [3] 웹소캣 연결이 이루어질 때, 해당 세션을 `Set`에 추가한다.
- [4] 메시지 내용을 `String` 변수에 담는다. (JSON 형식)
- [5] JSON 형식의 문자열을 `Message` 타입으로 변환한다.
- [6] `OutputMessage` 타입을 JSON으로 변환하여 메시지를 전송한다.
- [7] 웹소캣 연결이 끊어질 때, 해당 세션을 `Set`에서 삭제한다.

## 5. View(jsp) 생성
메시지 시스템을 구현하기 위해서는 View에서 [***sockjs***](https://github.com/sockjs/sockjs-client)와 [***stomp***](https://github.com/jmesnil/stomp-websocket) JavaScript 라이브러리가 필요하다. 

### JavaScript Function Description
- `setConnected()` :  전달한 boolean 변수에 따라 채팅 화면을 화면에 보여주거나 숨긴다.
- `connect()` : 웹소캣 연결을 요청
- `disconnect()` : 웹소캣 연결을 종료
- `sendMessage()` : 연결된 소캣에 메시지를 전송
- `showMessageOutput()` : 수신한 메시지를 화면에 출력

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/include/jstl.jspf" %>
<!DOCTYPE html>
<html>
<head>
<title>Chat WebSocket</title>
<script src="<c:url value = '/resources/js/sockjs-0.3.4.js'/>"></script> 
<script src="<c:url value = '/resources/js/stomp.js'/>"></script>
<script type="text/javascript">
    var socket = null;
    
    function setConnected(connected) {
        document.getElementById('connect').disabled = connected;
        document.getElementById('disconnect').disabled = !connected;
        document.getElementById('conversationDiv').style.visibility 
        = connected ? 'visible' : 'hidden';
        document.getElementById('response').innerHTML = '';
    }
    
    function connect() {
        socket = new SockJS('<c:url value="/ws" />');  // [1]
        socket.onopen = function(evt) {  // [2]
            setConnected(true);
        };
        
        socket.onmessage = function(evt) {  // [3]
            showMessageOutput(evt.data);
        };
        
        socket.onclose = function(evt) {  // [4]
            disconnect();
        }
    }
    
    function disconnect() {
        if (socket != null) {
            socket.close();
        }
        
        setConnected(false);
        console.log("Disconnected");
    }
    
    function sendMessage() {
        var from = document.getElementById('from').value;
        var text = document.getElementById('text').value;
        
        socket.send(JSON.stringify({'from':from, 'text':text}));  // [5]
    }
    
    function showMessageOutput(messageOutput) {
        var message = JSON.parse(messageOutput);  // [6]
        
        var response = document.getElementById('response');
        var p = document.createElement('p');
        p.style.wordWrap = 'break-word';
        p.appendChild(document.createTextNode(message.from + ": " 
        + message.text + " (" + message.time + ")"));
        response.appendChild(p);
    }
</script>
</head>
<body onload="disconnect()">
    <div>
        <div>
            <input type="text" id="from" placeholder="Choose a nickname"/>
        </div>
        <br />
        <div>
            <button id="connect" onclick="connect();">Connect</button>
            <button id="disconnect" disabled="disabled" onclick="disconnect();">
                Disconnect
            </button>
        </div>
        <br />
        <div id="conversationDiv">
            <input type="text" id="text" placeholder="Write a message..."/>
            <button id="sendMessage" onclick="sendMessage();">Send</button>
            <p id="response"></p>
        </div>
    </div>

</body>
</html>
```

- [1] `/{context-path}/ws` 경로로 웹소캣을 연결한다.
- [2] 웹소캣이 연결되었을 때 실행하는 함수 정의
- [3] 메시지가 수신되었을 때 실행하는 함수 정의
- [4] 웹소캣 연결이 종료되었을 때 실행하는 함수 정의
- [5] 데이터를 JSON 형식으로 파싱하여 서버에 전송한다.
- [6] 서버에서 전송받은 JSON 형식의 데이터를 object 타입으로 파싱한다.

## Conclusion
STOMP를 이용하는 방법은 `WebSocketMessageBroker`에서 `send`와 `subscribe`를 경로를 설정하고, 어노테이션을 이용하여 메시지를 쉽게 구분할 수 있다. 반면에 `WebSocketHandler`를 이용하면 세션 레벨에서 직접 데이터를 핸들링해야 하기 때문에, 특정 대상 또는 그룹에게 메시지를 보낼 때, 세션 레벨에서 어떻게 특정 대상 또는 그룹을 구분할지 생각해야 한다. 따라서, STOMP를 이용하는 것이 프로그래머 입장에서 더 생산적일 것으로 보인다.

## Reference
- <https://velog.io/@koseungbin/WebSocket>