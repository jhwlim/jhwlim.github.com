---
title: "Spring WebSocket 튜토리얼 (1)"
excerpt: "Spring WebSocket의 STOMP, @MessageMapping, @SendTo를 이용하여 1:N 채팅 구현하기"
categories: spring
tags: spring-websocket websocket stomp
---
## 들어가기전에
Spring WebSocket을 활용하여 간단한 실시간 채팅을 만들고자 한다. Spring에서 WebSocket은 아래의 2가지 방법으로 구현할 수 있다.

1. WebSocket 데이터를 직접 처리
2. STOMP 프로토콜을 사용하여 메시지를 처리

1번 방법은 `WebSocketHandler`를 상속받아 세션 레벨에서 텍스트나 이미지 파일과 같은 Binary  데이터를 직접 Handling이 가능하다.

2번 방법은 STOMP(Simple Text Oriented Messaging Protocol)을 이용하여 메시지를 보다 쉽게 Handling할 수 있다.

오늘은 2번 방법을 이용하여 간단한 실시간 채팅을 구현해보려고 한다.

## WebSocket이란
**WebSocket**은 웹 브라우저와 웹 서버 사이에 bi-directional, full-duplex, persistent connection 통신을 가능하게 하는 통신 프로토콜로, 한번 연결이 이루어지고 나면 연결이 끊어질 때까지 연결은 계속 유지된다는 특징을 가지고 있다.

## 1. Maven Dependencies
- 웹소캣 사용을 위한 의존성 라이브러리(스프링 버전 4.0 이상)
  
```xml
<properties>
    <java-version>1.8</java-version>
    <org.springframework-version>5.2.12.RELEASE</org.springframework-version>
    ...
</properties>
<dependencies>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-websocket</artifactId>
        <version>${org.springframework-version}</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-messaging</artifactId>
        <version>${org.springframework-version}</version>
    </dependency>
</dependencies>
```

- 메시지 데이터를 JSON으로 변환하기 위한 의존성 라이브러리
  
```xml
<dependencies>
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
</dependencies>
```

## 2. WebSocket Config 클래스 생성

- `@Configuration`, `@EnableWebSocketMessageBroker` 추가
- `WebSocketMessageBrokerConfigurer` 인터페이스를 구현한다.
    - `configureMessageBroker` : 메시지 브로커 설정, Subscribe 경로와 Message Mapping 경로를 설정
    - `registerStompEndpoints` : Spring STOMP 지원이 가능하도록 웹소캣 연결 url 설정 (Javascript의 `new SockJS(url)`의 웹소캣 연결을 위한 경로)
  
```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	@Override
	public void configureMessageBroker(MessageBrokerRegistry config) {
		config.enableSimpleBroker("/topic");                // Subscribe url prefix를 `/topic`으로 설정
		config.setApplicationDestinationPrefixes("/app");   // @MessageMapping prefix 경로를 `/app`으로 설정
	}
	
	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {	
		registry.addEndpoint("/ws");    // 안정적이고 탄력적으로 동작하기 위해서, SockJS가 없는 endpoint 추가
		registry.addEndpoint("/ws").withSockJS();
	}
	
}
```


## 3. Message Model 클래스 생성
메시지를 주고 받을 때, 데이터를 담을 Model 클래스 생성한다.

```java
@Data   // getters & setters (Lombok)
public class Message {

	private String from;
	private String text;

}
```

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

## 4. MessageHandling Controller 클래스 생성

- `@MessageMapping` : `/app/chat` 경로로 요청한 메시지를 Mapping한다. (WebSocketConfig에서 설정했던 prefix 포함)
- `@SendTo` : `/topic/messages`를 구독하고 있는 모든 구독자에게 메시지를 보낸다.

```java
@RestController
public class MessageController {

	@MessageMapping("/chat")    
	@SendTo("/topic/messages")  
	public OutputMessage send(Message message) throws Exception {
		String time = new SimpleDateFormat("HH:mm").format(new Date());
		return new OutputMessage(message.getFrom(), message.getText(), time);
	}
	
}
```

## 5. View(jsp) 생성
메시지 시스템을 구현하기 위해서는 View에서 [**sockjs**](https://github.com/sockjs/sockjs-client)와 [**stomp**](https://github.com/jmesnil/stomp-websocket) javascript client 라이브러리가 필요하다. 

메시지는 JSON 타입으로 파싱하여 보내고 받는다.


```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
<title>Chat WebSocket</title>
<script src="<c:url value = '/resources/js/sockjs-0.3.4.js'/>"></script> 
<script src="<c:url value = '/resources/js/stomp.js'/>"></script>
<script type="text/javascript">
    var stompClient = null;
    
    function setConnected(connected) {
        document.getElementById('connect').disabled = connected;
        document.getElementById('disconnect').disabled = !connected;
        document.getElementById('conversationDiv').style.visibility 
          = connected ? 'visible' : 'hidden';
        document.getElementById('response').innerHTML = '';
    }
    
    function connect() {
        var socket = new SockJS('<c:url value="/ws" />'); // 웹 소캣 연결 url
        stompClient = Stomp.over(socket);  
        stompClient.connect({}, function(frame) {
            setConnected(true);
            console.log('Connected: ' + frame);
            stompClient.subscribe('<c:url value="/topic/messages" />', function(messageOutput) { // 구독 url
                showMessageOutput(JSON.parse(messageOutput.body));
            });
        });
    }
    
    function disconnect() {
        if(stompClient != null) {
            stompClient.disconnect();
        }
        setConnected(false);
        console.log("Disconnected");
    }
    
    function sendMessage() {
        var from = document.getElementById('from').value;
        var text = document.getElementById('text').value;
        stompClient.send('<c:url value="/app/chat" />', {}, JSON.stringify({'from':from, 'text':text})); // @MessageMapping url
    }
    
    function showMessageOutput(messageOutput) {
        var response = document.getElementById('response');
        var p = document.createElement('p');
        p.style.wordWrap = 'break-word';
        p.appendChild(document.createTextNode(messageOutput.from + ": " 
          + messageOutput.text + " (" + messageOutput.time + ")"));
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

## 마치면서
스프링 웹소캣 이용하여 간단한 실시간 채팅을 만들어 보았다. `@SendTo` 어노테이션은 해당 구독 경로로 N명에게 메시지를 보낼 때 사용한다고 하며, 1:1 채팅은 `@SendToUser` 어노테이션을 사용한다고 한다. 다음에는 `@SendToUser` 어노테이션 사용하여 간단한 1:1 채팅을 구현해보고 정리를 해볼 예정이다.


## Reference
- <https://www.baeldung.com/websockets-spring>
- <https://swiftymind.tistory.com/105>
