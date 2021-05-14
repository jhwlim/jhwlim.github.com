---
title: "[JS] Class 사용방법 정리"
excerpt: ""
categories: js
---
## Introduction
[드림코딩 by 엘리](https://www.youtube.com/watch?v=_DLhUBWsRtw) YouTube 영상을 시청하고 공부한 
**자바스크립트에서의 Class 사용방법**에 대해서 정리하고자 한다.

## Class 선언
```js
class MyClass {
    constructor() {}  // [1]
    method1() {}      // [2] 
    // ...
}
```
- [1] : 생성자
- [2] : prototype 속성을 정의할 수 있다.

작성한 클래스는 아래와 같이 `new`와 함께 사용하여 인스턴스를 생성할 수 있다. 
```js
new MyClass();
```

### Example
```js
class Person {
    constructor(name, age) {
        // fields
        this.name = name;
        this.age = age;
    }

    // methods
    speak() {
        console.log(`${this.name}: hello!`);
    }
}
```

```js
const person = new Person('test01', 20);
console.log(person.name); // test01
console.log(person.age);  // 20
person.speak();
```


## Getter & Setter
### 1. Setter
`=`을 사용하여 필드에 값이 할당될 때 호출된다. Setter는 유효성 검사시 활용될 수 있다.

```js
class User {
    constructor(firstName, lastName, age) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
    }    
}
```

```js
class User {
    // ...
    set age(value) {        // [1]
        if (value < 0) {    // [2]
            throw Error('Age can not be negative');
        }
        this._age = value;  // [3] 
    }
}
```
- [1] : `=` 을 사용할 때 호출한다.
- [2] : `age`에는 음수 값이 들어가면 에러를 발생시킨다. → 유효성 검사에 활용될 수 있다.  
- [3] : `this.age` 로 작성하게 되면 다시 setter를 호출하기 때문에 무한루프에 빠지게 된다. 이것을 방지하기 위해서 "`_`"를 앞에 붙여준다. 

```js
const user1 = new User('Steve', 'Job', -1); // [1]
```
- [1] : 인스턴스를 생성할 때, `age`에 음수가 들어가기 때문에 에러가 발생한다.

### 2. Getter
`this.이름` 형식으로 데이터를 확인할 때 호출된다.

```js
class User {
    // ...
    get age() { // [1]
        return this._age;
    }
}
```
- [1] `this.age` 를 사용할 때 호출된다.

<br>
따라서, 실제 `User` 클래스의 필드는 `firstName`, `lastName`, `_age`가 있다고 보면 되고, `_age`는 getter 이름을 `age`로 했기 때문에 `this.age`로 접근할 수 있다.

## public & private
최근에 추가된 문법으로 <u>지원하지 않는 브라우저가 많기 때문에 사용시 주의가 필요하다.</u>

`#`를 필드명 앞에 붙여주면 private 변수를 의미하며, 외부에서는 접근할 수 없다.

```js
class Experiment {
    publicField = 2;
    #privateField = 0;  // [1] 
}
```
- [1] : 외부에서는 접근할 수 없다. 접근시 `undefined`

## static
최근에 추가된 문법으로 <u>지원하지 않는 브라우저가 많기 때문에 사용시 주의가 필요하다.</u>

`static`을 변수 또는 메서드 앞에 붙여주면, 인스턴스를 생성하지 않아도 `클래스명.` 형식으로 접근 및 사용이 가능하다.

```js
class Article {
    static publisher = 'test';
    constructor(articleNumber) {
        this.articleNumber = articleNumber;
    }

    static printPublisher() {
        console.log(Article.publisher);
    }
}
```

```js
console.log(Article.publisher); // test
Article.printPublisher();       // test
```

## 상속과 다양성
### 1. 상속
`extends` 키워드를 사용하여 클래스를 상속 받을 수 있다.
```js
class Shape {
    constructor(width, height, color) {
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw() {
        console.log(`drawing ${this.color} color`);
    }

    getArea() {
        return this.width * this.height;
    }
}
```

`Shape` 클래스를 상속받는다.
```js
class Rectangle extends Shape {}
```

```js
const rectangle = new Rectangle(20, 20, 'blue');
rectangle.draw();
```

### 2. 다양성
상속받은 클래스의 메서드를 재정의할 수 있다.
```js
class Triangle extends Shape {
    draw() {
        super.draw();
        console.log('△');
    }

    getArea() {
        return this.width * this.height / 2;
    }
}
```

```js
const triangle = new Triangle(20, 20, 'red');
console.log(triangle.getArea());
triangle.draw();
```

### 3. instanceof
`인스턴스 instanceof 클래스명` : 해당 인스턴스가 클래스인지를 확인한다. true or false를 반환한다.
```js
console.log(rectangle instanceof Rectangle);  // true
console.log(triangle instanceof Rectangle);   // false
console.log(triangle instanceof Triangle);    // true
console.log(triangle instanceof Shape);       // true
console.log(triangle instanceof Object);      // true
```

## References
- <https://www.youtube.com/watch?v=_DLhUBWsRtw>
- <https://ko.javascript.info/class>