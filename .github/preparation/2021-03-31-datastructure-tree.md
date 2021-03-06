---
title: "트리"
excerpt: "기본 용어"
categories: datastructure
tags: 
---
## 들어가기전에

## 트리란
데이터 사이의 계층 관계를 나타내는 자료 구조로, 노드(node)와 가지(edge)로 구성되어 있다.

## 기본 용어
#### 루트(Root) 
- 트리의 가장 윗부분에 위치하는 노드

#### 리프(Leaf)
- 트리의 가장 아랫부분에 위치하는 노드
- 더 이상 뻗어나갈 수 없는 마지막 노드
- 끝 노드(Terminal Node) 또는 바깥 노드(External Node)

#### 안쪽 노드
- 루트를 포함하여 리프를 제외한 노드
- 끝이 아닌 노드(non-terminal node)

#### 자식(Child)
- 어떤 노드로부터 가지로 연결된 아래쪽 노드
- 노드는 자식을 여러개 가질 수 있다.
- 리프는 자식을 가질 수 없다.

#### 부모(Parent)
- 어떤 노드에서 가지로 연결된 위쪽 노드
- 노드는 1개의 부모를 가진다.
- 루트는 부모를 가질 수 없다.

#### 형제(Sibling)
- 같은 부모를 가지는 노드

#### 조상(Ancestor)
- 어떤 노드에서 가지로 연결된 위쪽 노드 모두

#### 자손(Descendant)
- 어떤 노드에서 가지로 연결된 아래쪽 노드 모두

#### 레벨(Level)
- 루트로부터 얼마나 떨어져 있는지에 대한 값
- 루트의 레벨은 0이고, 루트로부터 가지가 하나씩 아래로 뻗어나갈 때마다 레벨이 1씩 늘어난다.

#### 차수(Degree)
- 노드가 갖는 자식의 수
- 모든 노드의 차수가 n 이하인 트리를 **n진 트리**라고 한다.

#### 높이(Height)
- 루트로부터 가장 멀리 떨어진 리프까지의 거리(리프 레벨의 최댓값)

#### 서브 트리(Subtree)
- 트리 안에서 다시 어떤 노드를 루트로 정하고 그 자손으로 이루어진 트리

#### 널 트리(Null Tree)
- 노드, 가지가 없는 트리

#### 순서 트리와 무순서 트리
- **순서 트리(Ordered Tree)** : 형제 노드의 순서가 있다.
- **무순서 트리(Unordered Tree)** : 형제 노드의 순서가 없다.
  
## 순서 트리 탐색
- 순서 트리의 노드를 스캔하는 방법
    #### 1. 너비 우선 탐색(BFS, Breadth-First Search)
    낮은 레벨에서 시작해 왼쪽에서 오른쪽 방향으로 검색
    #### 2. 깊이 우선 탐색(DFS, Depth-First Search)
    리프까지 내려가면서 검색

- 깊이 우선 탐색시 노드 방문 방법
    #### 1. 전위 순회(Preorder)
    **노드방문** → 왼쪽자식 → 오른쪽자식

    #### 2. 중위 순회(Inorder)
    왼쪽자식 → **노드방문** → 오른쪽자식
    
    #### 3. 후위 순회(Postorder)
    왼쪽자식 → 오른쪽자식 → **노드방문** 

## 이진 트리(Binary Tree)
- 노드가 왼쪽 자식과 오른쪽 자식을 갖는 트리
- 각 노드의 자식은 2명 이하만 유지해야 한다.
- 왼쪽 자식과 오른쪽 자식을 구분한다.  
    #### 왼쪽 서브 트리(Left Subtree)
    왼쪽 자식을 다시 루트로 하는 서브 트리

    #### 오른쪽 서브 트리(Right Subtree)
    오른쪽 자식을 다시 루트로 하는 서브 트리

## 완전 이진 트리

```
1. 마지막 레벨을 제외한 제외한 레벨은 노드를 가득 채운다.
2. 마지막 레벨은 왼쪽부터 오른쪽 방향으로 노드를 채우되 반드시 끝까지 채울 필요는 없다.
```

- 높이가 k인 완전이진트리가 가질 수 있는 노드의 최댓값은 `2^(k+1) - 1`개
- 따라서, n개의 노드를 저장할 수 있는 완전이진트리의 높이는 `log n`

## 이진검색트리

```
1. 어떤 노드 N을 기준으로 왼쪽 서브 트리 노드의 모든 키 값은 노드 N의 키 값보다 작아야 한다.
2. 오른쪽 서브 트리 노드의 키 값은 노드 N의 키 값보다 커야 한다.
3. 같은 키 값을 갖는 노드는 없다.
```

- 이진검색트리를 중위 순회하면 키 값의 오름차순으로 노드를 얻을 수 있다.
- 구조가 단순하다.
- 이진검색과 비슷한 방식으로 검색이 가능하다.
- 노드의 삽입이 쉽다.

## 이진검색트리 만들기
이진검색트리의 개별 노드
```java
class Node {
	int key;    // 키, 비교 대상
	int data;   // 데이터
	Node left;
	Node right;
}
```

이진검색트리 클래스
```java

```


## 마치면서