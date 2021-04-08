---
title: "Spring WebSocket + STOMP를 이용한 실시간 채팅 구현하기"
excerpt: "Spring WebSocket와 STOMP를 이용하여 1:N 채팅 구현하기"
categories: spring
tags: spring-websocket websocket STOMP
---
## Intro
**WebSocket**은 웹 브라우저와 웹 서버 사이에 bi-directional, full-duplex, persistent connection 통신을 가능하게 하는 통신 프로토콜로, 한번 연결이 이루어지고 나면 연결이 끊어질 때까지 연결이 계속 유지된다는 특징을 가지고 있다. 이 때문에 WebSocket을 사용해서 실시간 채팅 기능을 구현할 수 있다.

Spring에서는 아래의 2가지 방법으로 WebSocket을 사용할 수 있다.

1. `WebSocketHandler`를 상속받아 세션 레벨에서 메시지를 처리

2. STOMP(Simple Text Oriented Messaging Protocol)를 이용하여 메시지를 처리

이번 포스트에서는 2번 방법을 사용하여 간단한 실시간 채팅을 만들어보려고 한다.

## 1. Maven Dependencies
- 웹소캣 사용을 위한 의존성 라이브러리 추가
  
```xml
<!-- springframework-version 4.0 이상 -->
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
```

## 2. WebSocket Config 클래스 생성
- `@Configuration`, `@EnableWebSocketMessageBroker` 추가
- `WebSocketMessageBrokerConfigurer` 인터페이스를 `implements`한다.
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

## 4. MessageHandling Controller 클래스 생성

- `@MessageMapping` : WebSocketConfig에서 설정했던 prefix를 포함한 `/app/chat` 경로로 요청한 메시지를 Mapping한다.
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

### ※ *url* 작성시 주의사항
소켓을 연결하기 위하여 새로운 SockJS를 생성할 때, context path가 필요하기 때문에 `<c:url>`을 이용하여 *url*을 작성할 수 있다. 하지만 **subscribe와 send의 *url*은 `<c:url>`을 이용하면 제대로 동작되지 않는다.** `<c:url>`을 지우고 작성해야만 정상적으로 통신이 이루어진다.

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
            stompClient.subscribe('/topic/messages', function(messageOutput) { // 구독 url
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
        stompClient.send('/app/chat', {}, JSON.stringify({'from':from, 'text':text})); // @MessageMapping url
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

## Conclusion
스프링 웹소캣 이용하여 간단한 실시간 채팅을 만들어 보았다. `@SendTo` 어노테이션은 해당 구독 경로로 N명에게 메시지를 보낼 때 사용한다고 하며, 1:1 채팅은 `@SendToUser` 어노테이션을 사용한다고 한다. 다음에는 `@SendToUser` 어노테이션 사용하여 간단한 1:1 채팅을 구현해보고 정리를 해볼 예정이다.


## Reference
- <https://www.baeldung.com/websockets-spring>
- <https://swiftymind.tistory.com/105>
