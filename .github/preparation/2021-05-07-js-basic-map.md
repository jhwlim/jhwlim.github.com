# Set
## 생성
```js
new Set();
```

## API Summary
### Properties
|Property|Description|
|:--|:--|
|size||

### Methods
|Method|Parameters|Return|Description|
|:--|:--|:--|:--|
|add()|||
|delete()|||
|has()|||

# Map
## 생성
```js
new Map();
```

## API Summary
### Properties
|Property|Description|
|:--|:--|
|size||

### Methods
|Method|Parameters|Return|Description|
|:--|:--|:--|:--|
|set()|key<br>value|void|
|get()|key|value|
|has()|key|Boolean|
|delete()|key|Boolean|
|forEach()|callbackFunction||

### forEach()
```js
var map = new Map();

map.set('a', 'A');
map.set('b', 'B');
map.set('c', 'C');

map.forEach(function(key, value) {
  console.log(key, value); // key, value
});
```

## 반올림, 올림, 내림
```js
Math.round(number);
Math.ceil(number);
Math.floor(number);
```