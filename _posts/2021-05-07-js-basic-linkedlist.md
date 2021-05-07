---
title: "[JS] Linked List 구현하기"
excerpt: ""
categories: js
tags: data-structure linked-list
---
## Introduction
(1) Array에서 제공하는 메서드를 사용하지 않고, Linked List를 구현해야 하는 이유를 정리해보고, (2) Linked List를 직접 구현해보려고 한다.

## Array의 `shift()`와 `unshift()`
자바스크립트의 배열는 다양한 메서드를 제공하고 있다. 배열의 끝에 데이터를 추가하고 삭제하는 것 뿐만 아니라, `shift()`와 `unshift()` 메서드를 사용하여 배열의 맨 앞에 데이터를 추가하고 삭제할 수 있다. 

이러한 기능들은 분명히 편리하겠지만, 시간 복잡도 관점에서 효율성에 문제가 있을 것이다. 배열의 끝에 데이터를 추가하거나 삭제할 때의 시간 복잡도는 *O(1)* 이다. 하지만 배열의 맨 앞에 데이터를 추가하거나 삭제하면, 배열의 인덱스가 변하기 때문에 배열의 인덱스에 맞게 데이터를 옮겨주는 연산이 동반되고, 시간의 복잡도는 *O(n)*이 될 것이다. 따라서, 배열의 `shift()`과 `unshift()` 메서드를 자주 사용하게 되면 성능상에 문제가 발생할 수 있다.

## Array와 Linked List의 시간복잡도

|구분|Array|Linked List|
|:-:|:-:|:-:|
Index를 이용한 접근|*O(1)*|불가|
검색|*O(n)*|*O(n)*|
추가|*O(n)*|*O(1)*|
삭제|*O(n)*|*O(1)*|

- Array의 검색(`indexOf()`)의 시간 복잡도는 O(n)
- Array는 맨 뒤의 데이터를 추가하고 삭제할 때의 시간 복잡도는 O(1)

<br>
만약 어떤 값이 주어지고, 해당 값의 데이터를 삭제하려고 한다면 (인덱스가 주어지지 않았다고 가정)

Array는 해당 값을 검색하고 데이터의 삭제가 이루어지기 때문에 시간 복잡도는 O(n<sup>2</sup>)가 될 것이다. 반면에 Linked List도 해당 값을 검색하는 과정이 필요하지만, 데이터를 삭제하는데 걸리는 시간이 O(1)이기 때문에 결과적으로 시간 복잡도는 O(n)이다.

따라서, Array의 `shift()`와 `unshift()`를 사용하여 구현할 수는 있겠지만, Linked List와 동일한 성능을 기대할 수 없다.

## Linked List 구현하기
위와 같은 이유로 Array를 사용하지 않고, Linked List를 직접 구현해보려고 한다. 간단하게 데이터를 추가하고, 삭제하는 연산만 구현하였다.

### 1. Linked List 생성하기
```js
function Node(data) {
  this.data = data; // number
  this.next = null; // Node
}

function LinkedList() {
  this.head = null;
}
```

### 2. 모든 데이터 출력하기
```js
LinkedList.prototype.print = function() {
  var current = this.head; // this : LinkedList 인스턴스

  while (current !== null) {
    console.log(current.data);
    current = current.next;
  }
}
```

### 3. 데이터 추가하기
```js
LinkedList.prototype.add = function(data) {
  var current = this.head;
  if (current === null) {
    this.head = new Node(data);
    return;
  }
  
  while (current.next !== null) {
    current = current.next;
  }
  
  current.next = new Node(data);
}
```

### 4. 데이터 삭제하기
데이터를 삭제하는데 성공하면 `true`, 실패하면 `false`를 반환한다.
```js
LinkedList.prototype.remove = function(data) {
  var current = this.head;
  if (current.data === data) {
    this.head = current.next;
    return true;
  }
  
  while (current.next !== null && current.next.data !== data) {
    current = current.next;
  }
  
  if (current.next !== null) {
    current.next = current.next.next;
    return true;
  }
  
  return false;
}
```

### 5. Test & Result
```js
var arr = [1, 2, 3, 4, 5];

var list = new LinkedList();
for (var i = 0; i < arr.length; i++) {
  var data = arr[i];
  list.add(data);
}

list.print();   // [1, 2, 3, 4, 5]

console.log(list.remove(3));    // true
list.print();   // [1, 2, 4, 5]

console.log(list.remove(0));    // false
list.print();   // [1, 2, 4, 5]
```

## Conclusion
Array와 Linked List 각각 장점과 단점이 있기 때문에 상황에 맞게 알맞은 자료구조를 사용하면 될 것 같다. 하지만 자바스크립트에서 편리한 메서드를 제공하고 있다는 이유만으로 Array를 이용하여 Linked List를 구현하는 것은 지양하는 것이 좋을 것 같다.

(잘못된 내용이 있다면 댓글 남겨주시면 수정하도록 하겠습니다.)