---
title: "[Laravel] 기초 (Laravel 5.8)"
excerpt: ""
categories: php
---
## 설치
```
composer create-project laravel/laravel project-name "5.8.*"
```

## 서버 실행하기
```
php artisan serve
```

## 폴더 구조 - 자주 사용하는 폴더
```
app
    ┣ Http
        ┣ Controller    : (MVC) Controller 
        ┠ Middleware
        └ Kernel.php
    └ User.php : (MVC) Model
database
resources
    ├ js    : Vue.js 파일
    ├ lang
    ├ sass
    └ views : (MVC) blade 파일
routes
    ┗ web.php : url 경로 설정
```

## 기본 라우팅
```php
// /routes/web.php
Route::get('/', function() {
    return view('welcome'); // /resources/views/welcome.blade.php
});
```