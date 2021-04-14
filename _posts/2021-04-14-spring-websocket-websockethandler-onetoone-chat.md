---
title: "[Spring] WebSocketHandler를 이용하여 일대일 채팅 구현하기"
excerpt: ""
categories: spring
tags: spring-websocket websocket WebSocketHandler
---
## Intro
[이전 포스팅](/spring/spring-websocket-tutorial-websockethandler)에 이어서 `WebSocketHandler`를 이용하여 일대일 채팅을 만들어보려고 한다. 

### Requirement
- User1과 User2 사이의 메시지는 두 User에게만 전달되어야 한다.
- User는 하나의 브라우저에서 여러 개의 탭을 생성하여 채팅 페이지에 접근할 수 있고, 메시지를 보낼 수 있다. User1이 User2에게 메시지를 보내면 User1과 User2의 모든 채팅 페이지에서 동일한 응답을 해야한다.

### What is Problem?
- `sender : User1, receiver : User2` 또는 `sender : User2, receiver : User1`인 `WebSocketSession`을 어떻게 특정하여 메시지를 보낼 것인가

### Approach
클라이언트에서 메시지를 보내면 sender와 receiver의 정보를 가지고 특정 `WebSocketSession`을 검색해야 한다. 따라서, 시간복잡도 측면에 생각했을 때, User1과 User2를 묶어 고유값을 생성하고 이 고유값을 Key로 하면서 `WebSocketSession`을 Value로 가지는 Map(HashMap)으로 관리해야 한다. 

DB에 채팅방 고유번호를 관리하는 테이블을 두고, 채팅시 이 고유번호를 Key로 활용하여 `Map<Integer, Set<WebSocketSession>>` 형태로 세션을 관리하여 문제를 해결할 수 있다. 이 방법은 테이블 구조를 잘 설계한다면 그룹채팅으로도 쉽게 기능을 확장할 수 있을 것으로 보인다.

### Goal
- `WebSocketHandler`를 이용하여 실시간 일대일 채팅 기능 구현하기
- 인터셉터를 통해 유저 정보와 채팅방 고유번호를 세션에 저장하여, 메시지를 보낼 때마다 유저 정보와 채팅방 고유번호를 보내지 않도록 하기

## DB Table
채팅 기능 구현시 필요한 최소한의 테이블과 컬럼을 생각했을 때, 아래와 같았다. 만약 그룹채팅까지 기능을 확장하려고 한다면 `chat_room` 테이블에서 `type`이라는 컬럼을 생성하여 일대일 채팅과 그룹 채팅을 구분할 필요가 있을 것 같다.

<div align="center">
    <img src="/assets/images/post/20210414/001_20210413.png">    
</div>

<br>

### DDL

```sql
-- MySQL Table 생성 쿼리
CREATE TABLE users (
    seq_id INT PRIMARY KEY AUTO_INCREMENT,  -- 회원 고유번호(PK)
    id VARCHAR(30) UNIQUE                   -- 회원 아이디
);

CREATE TABLE chat_room (
    id INT PRIMARY KEY AUTO_INCREMENT,  -- 채팅방 고유번호(PK)
);

CREATE TABLE chat_user (
    chat_room_id INT,   -- 채팅방 고유번호(PK, FK)
    user_seq_id INT,    -- 회원 고유번호(PK, FK)
    CONSTRAINT chat_user_com_pk PRIMARY KEY(chat_room_id, user_seq_id),
    CONSTRAINT chat_user_room_fk FOREIGN KEY (chat_room_id)
        REFERENCES chat_room (id),    
    CONSTRAINT chat_user_user_fk FOREIGN KEY (user_seq_id)
       REFERENCES users (seq_id)
);
```

## Model
- 유저 정보를 저장하는 모델

    ```java
    public class User {
        private int seqId;
        private String id;
    }
    ```
<br>

- 채팅방 고유번호와 유저 고유번호를 저장하는 모델, DB 데이터 조회시 사용됨.

    ```java
    public class ChatUser {
        private int chatRoomId;
        private int userSeqId;
    }
    ```
<br>

- 클라이언트에서 전달받은 메시지를 담는 모델

    ```java
    public class Message {
        private String text;
    }
    ```
<br>

- 클라이언트로 보낼 메시지를 담는 모델
  
    ```java
    public class OutputMessage {
        private String from;
        private String text;
        private String time;    
    }
    ```

## Controller
"`/talk/{chatRoomId}`" 요청을 처리하며, (1) 유저가 로그인되어 있는지를 확인하고 (2) 채팅방 고유번호에 해당 유저가 속해 있는지를 확인한 후 채팅방 페이지를 보여준다.

```java
@Controller
@RequestMapping(value = "/talk")
public class ChatController {

    @Autowired
    ChatUserService chatUserService;

    @GetMapping("/{chatRoomId}")
    public String showChatRoom(@PathVariable(value = "chatRoomId") int chatRoomId, 
                                HttpSession session, 
                                Model model) {
        User user = (User) session.getAttribute("user");    // [1]
        if (user == null) {
            // NOT LOGINED
            return "redirect:/";
        }
        
        ChatUser chatUser = new ChatUser(chatRoomId, user.getSeqId());
        if (chatUserService.selectCountByChatRoomIdAndUserSeqId(chatUser) == 0) {   // [2]
            // NOT PERMISSION
            return "redirect:/";
        }
        
        model.addAttribute("chatRoomId", chatRoomId);
        
        return "chat/talk";
    }

}
```

- [1] : 세션에 저장되어 있는 유저 정보를 가져온다. (세션에 유저 정보가 저장되어 있다고 가정)
- [2] : 채팅방 고유번호와 유저 정보를 가지고 DB의 `chat_user` 테이블을 조회한다.

## View (jsp)
**sockjs** 라이브러리가 필요하며, 아래 경로에서 다운로드 받을 수 있다.

<https://github.com/sockjs/sockjs-client>

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
<title>Chat WebSocket</title>
<script src="<c:url value = '/resources/js/sockjs-0.3.4.js'/>"></script> 
<script type="text/javascript">
    var socket = null;
    
    function connect() {
        socket = new SockJS('<c:url value="/ws/${chatRoomId}" />'); // [1]
        socket.onopen = function(evt) {
        	console.log("Connected");
        };
        
        socket.onmessage = function(evt) {
        	showMessageOutput(evt.data);    // [2]
        };
        
        socket.onclose = function(evt) {
        	console.log("Disconnected");
        }
    }
    
    function sendMessage(data) {
    	var text = document.getElementById('text').value;
    
        socket.send(JSON.stringify({"text" : text}));   // [3]
    }
    
    function showMessageOutput(messageOutput) {
    	var message = JSON.parse(messageOutput);
    	
        var response = document.getElementById('response');
        var p = document.createElement('p');
        p.style.wordWrap = 'break-word';
        p.appendChild(document.createTextNode(message.from + ": " 
          + message.text + " (" + message.time + ")"));
        response.appendChild(p);
    }
</script>
</head>
<body onload="connect();">
    <div>
        <div id="conversationDiv">
            <input type="text" id="text" placeholder="Write a message..."/>
            <button id="sendMessage" onclick="sendMessage();">Send</button>
            <p id="response"></p>
        </div>
    </div>
</body>
</html>
```

- [1] : "`/{context-path}/ws/{chatRoomId}`" 경로로 웹소켓 연결을 연결한다.
- [2] : 서버에서 수신한 메시지를 화면에 출력한다.
- [3] : 연결한 웹소캣에 메시지를 보낸다.

## Maven Dependencies
[이전 포스트](/spring/spring-websocket-tutorial-websockethandler/#1-maven-dependencies) 참고

## WebSocket Config 클래스

```java
@Configuration
@EnableWebSocket
public class ChatConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry
            .addHandler(new MessageHandler(), "/ws/{chatRoomId}")   // [1]
            .addInterceptors(new ChatHandshakeInterceptor())        // [2]
            .withSockJS();
    }
	
	
}
```

- [1] : WebSocket Handler를 등록하고, 소켓 연결 경로를 `/ws/{chatRoomId}` 으로 지정한다.
- [2] : 소켓 연결시 Handshake 과정에서 동작하는 인터셉터를 설정한다.

### ※ Handler와 Interceptor 등록시 주의사항
만약 Handler와 Interceptor 안에서 `@Autowired` 어노테이션을 사용하려면 각각을 Bean으로 등록하고, 각각의 Bean을 WebSocket Handler와 Handshake Interceptor로 등록해줘야 한다. 

`@Component` 어노테이션을 WebSocket Handler와 Handshake Interceptor 클래스에 붙여주더라도 정상적으로 작동하지 않았다. 그 이유는 Config 클래스에서 `@Component`를 붙여서 생성해주었던 Bean을 사용하지 않고 새로운 객체를 생성하기 때문에 의존성 주입이 제대로 일어나지 않았던 것 같다.

따라서, `@Bean` 어노테이션을 이용해서 Bean을 생성하고 생성한 Bean을 바로 주입하여 문제를 해결할 수 있다.

```java
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry
            .addHandler(messageHandler(), "/ws/{chatRoomId}")
            .addInterceptors(chatHandshakeInterceptor())
            .withSockJS();
    }

    @Bean
    public MessageHandler messageHandler() {
        return new MessageHandler(); 
    }

    @Bean
    public ChatHandshakeInterceptor chatHandshakeInterceptor() {
        return new ChatHandshakeInterceptor();
    }
```

## Handshake Interceptor 클래스
클라이언트에서 `new SockJS({websocket-url})` 형식으로 웹 소캣 연결을 시도하면, "`/{context-path}/{websocket-url}/info`" 경로로 서버에 GET 요청을 하고, 서버의 기본 정보를 확인한다. 해당 요청은 `F12` → `Network` 탭에서 확인할 수 있다.

<p align="center">
    <img src="/assets/images/post/20210414/001_20210414.png">
</p>

이어서 "`/{context-path}/{websocket-url}/{server-id}/{session-id}/{transport}`" 경로로 요청을 보낼 때,
Handshake Interceptor가 동작한다. 이때, Interceptor에서는 WebSocketSession에 유저 정보와 채팅방 고유번호를 Attribute로 미리 저장하여 Handler에서 WebSocketSession의 Attribute를 확인할 수 있다.

```java
public class ChatHandshakeInterceptor extends HttpSessionHandshakeInterceptor {

    // handshake 과정이 발생하기 전에 동작하는 메서드
    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request, 
            ServerHttpResponse response, 
            WebSocketHandler wsHandler,
            Map<String, Object> attributes) throws Exception {
        setAttributes(request, attributes);
        
        return super.beforeHandshake(request, response, wsHandler, attributes);
    }

    // WebSocketSession에 유저 정보와 채팅방 고유번호를 Attribute로 저장하는 메서드 
    private void setAttributes(ServerHttpRequest request, Map<String, Object> attributes) {
        ServletServerHttpRequest ssreq = (ServletServerHttpRequest) request;
        HttpServletRequest req = ssreq.getServletRequest();
        User user = (User) req.getSession().getAttribute("user");   // [1]
        
        int chatRoomId = Integer.parseInt(getChatRoomIdFromURI(req.getRequestURI()));   
        
        attributes.put("user", user);   // [2]
        attributes.put("chatRoomId", chatRoomId);   // [3]
    }

    // 전달받은 uri에서 채팅방 고유번호 부분을 잘라서 반환하는 메서드 
    private String getChatRoomIdFromURI(String uri) {
        String prefix = "/ws/";
        int idx = uri.indexOf(prefix) + prefix.length();
        return uri.substring(idx, uri.indexOf("/", idx));
    }

}
```

- [1] : HttpSession에 저장된 유저의 정보를 가져온다. (HttpSession에 유저 정보가 저장되어 있다고 가정)
- [2] : 유저 정보를 Attribute에 저장한다.
- [3] : 채팅방 고유정보를 Attribute에 저장한다.

## WebSocket Handler 클래스

```java
public class MessageHandler extends TextWebSocketHandler {
	
    Map<Integer, Set<WebSocketSession>> sessions = new HashMap<>();

    Gson gson = new Gson();

    /*
    - 웹소캣 연결이 성공하면 동작하는 메서드
    - WebSocketSession에서 채팅방 고유번호를 확인해서, 채팅방 고유번호를 Key로 하여 WebSocketSession을 관리하는 `sessions` Map에 추가한다.
    */
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        int chatRoomId = getChatRoomIdFromSession(session);
        
        Set<WebSocketSession> set = sessions.get(chatRoomId);
        if (set == null) {
            set = new HashSet<>();
        }
        set.add(session);
        sessions.put(chatRoomId, set);
    }

    /*
    - 웹소캣을 연결한 상태에서 메시지를 받으면 동작하는 메서드
    - 메시지를 보낸 WebSocketSession에서 채팅방 고유번호를 확인한다.
    - `sessions`에서 해당 채팅방 고유번호를 가지고 있는 세션을 조회해서 해당하는 세션 전체에 메시지를 보낸다.
    */
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        User user = getUserFromSession(session);
        int chatRoomId = getChatRoomIdFromSession(session);
        
        String payload = message.getPayload();
        Message m = gson.fromJson(payload, Message.class);
        
        String time = new SimpleDateFormat("HH:mm").format(new Date());
        OutputMessage output = new OutputMessage(user.getId(), m.getText(), time);
        
        Set<WebSocketSession> set = sessions.get(chatRoomId);
        for (WebSocketSession s : set) {
            s.sendMessage(new TextMessage(gson.toJson(output)));
        }
    }

    /*
    - 웹소캣 연결을 해제할 때 동작하는 메서드
    - WebSocketSession에서 채팅방 고유번호를 확인해서, `sessions`에서 해당 세션을 삭제한다.
    */
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        int chatRoomId = getChatRoomIdFromSession(session);
        Set<WebSocketSession> set = sessions.get(chatRoomId);
        set.remove(session);
        if (set.size() == 0) {
            sessions.remove(chatRoomId);
        }
    }

    // WebSocketSession으로부터 유저 정보를 가져오는 메서드
    private User getUserFromSession(WebSocketSession session) {
        return (User) session.getAttributes().get("user");
    }

    // WebSocketSession으로부터 채팅방 고유번호를 가져오는 메서드
    private int getChatRoomIdFromSession(WebSocketSession session) {
        return (int) session.getAttributes().get("chatRoomId");
    }
}
```

## Test & Result
테스트를 위해서 아래와 같이 데이터를 직접 DB에서 추가한다.

```sql
-- 회원 데이터
INSERT INTO users(id) VALUES('test01');
INSERT INTO users(id) VALUES('test02');
INSERT INTO users(id) VALUES('test03');

-- 채팅방 데이터
INSERT INTO chat_room() VALUES();
INSERT INTO chat_user(chat_room_id, user_seq_id) VALUES(1, 1); 
INSERT INTO chat_user(chat_room_id, user_seq_id) VALUES(1, 2); 
INSERT INTO chat_user(chat_room_id, user_seq_id) VALUES(2, 1); 
INSERT INTO chat_user(chat_room_id, user_seq_id) VALUES(2, 3);
```

<br>
그리고 간단하게 로그인할 수 있도록 페이지와 컨트롤러를 구성한다.

<p align="center">
    <img src="/assets/images/post/20210414/002_20210414.png">
</p>

그리고 로그인 버튼을 클릭하면 DB에서 유저 정보를 조회하고, DB에 유저 정보가 존재한다면 유저 정보를 세션에 저장한다.

```java
@Controller
public class LoginController {

    @Autowired
    UserFindService userFindService;

    @PostMapping(value = "/login")
    public String checkLogin(User user, HttpSession session) {
        User result = userFindService.selectUserById(user.getId());
        if (result != null) {
            session.setAttribute("user", result);
        }
        
        return "redirect:/";
    }

}
```

로그인이 성공하면, "`/talk/{chatRoomId}`"로 이동해서 채팅 기능이 잘 동작하는지 확인한다.

테스트 결과, 채팅방 고유번호로 구분되어 일대일 채팅이 이루어지며, 클라이언트에서 보내는 정보도 유저나 채팅방 고유번호에 대한 정보 없이 `text`만 보내서 요청을 처리하고 있다.

## Conclusion
채팅방 고유번호을 이용하여 Map으로 WebSocketSession을 관리하면 어렵지 않게 일대일 채팅을 구현할 수 있었다. 특히, <u>인터셉터에서 유저 정보와 채팅방 고유정보를 처리했는데, 이 과정에서 인증 과정을 추가하는 등 응용할 부분이 많은 것 같다.</u>

하지만 위의 방식은 채팅방 고유번호가 있다는 가정이 있었기 때문에, <u>실제 프로젝트에서는 채팅방 고유번호가 없는 유저와 채팅할 때는 어떻게 할지에 대한 고민도 필요하다.</u> (예를 들면, 화면에서 유저를 검색하고 '채팅하기' 버튼을 누르면 ajax로 채팅방 고유번호를 생성하고, 그 값을 받아와서 `location.href`로 GET 요청을 한다.)

또한, 위에서는 `new SockJS("/{context-path}/ws/{chatRoomId}")` 경로로 웹소캣을 연결하고 Interceptor에서 URI로부터 채팅방 고유번호를 얻어서 WebSocketSession에 Attribute로 저장하였다. 하지만, 일반적으로 SockJS에서는 URL을 통해서 정보를 넘기지 않는 것 같다. 실제로 위와 같은 방식으로 정보를 넘기는 예제를 찾을 수가 없었다. 만약, <u>URL로 데이터를 넘겨야 한다면 `new WebSocket("ws://localhost:{port}/ws/{chatRoomId}")` 형식으로 넘기거나 STOMP를 이용하는 것 같았다.</u> 따라서, 예제 정도로만 참고하고 실제 프로젝트에서는 사용하면 안될 것 같다.

WebSocketHandler를 이용하여 일대일 채팅 기능을 만들어보면서 내가 이해한 내용을 정리해보았다. 그러다보니 정확하지 않은 내용이 있을 수 있는데, 그런 부분들은 별도로 다시 정리할 예정이다.

