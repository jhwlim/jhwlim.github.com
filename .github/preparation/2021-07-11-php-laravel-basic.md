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

## 블레이드 레이아웃
`@yield('section_name', 'default_value')`

`@extends('layout_name')`

```php
@section('section_name')

@endsection
```

```php
// resources/views/layout.blode.php
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>@yield('title', 'Laravel')</title>
</head>
<body>
<ul>
    <li><a href="/">Welcome</a></li>
    <li><a href="/contact">Contact</a></li>
    <li><a href="/hello">Hello</a></li>
</ul>
@yield('content')
</body>
</html>
```

title에 대하여 별도로 지정을 안했기 때문에 layout.blade.php에서 default로 설정한 값이 들어간다.
```php
// resources/views/welcome.blade.php
@extends('layout')

@section('content')
    <h1>Welcome</h1>
@endsection
```


```php
// resources/views/hello.blade.php
@extends('layout')

@section('title')
Hello
@endsection

@section('content')
    <h1>Hello</h1>
@endsection
```

## 블레이드로 데이터 보내기

```php
// web.php
Route::get('/', function () {
    $books = [
        'Harry Potter',
        'Laravel',
    ];
    return view('welcome', [
        'books' => $books,
    ]); // resources/views/welcome.blade.php
});
```

또는 아래와 같이 작성할 수 있다.
```php
Route::get('/', function () {
    // ...
    return view('welcome')->with([
        'books' => $books,
    ]); 
});
```

또는 아래와 같이 작성할 수 있다. 이때, `with이름` 형태로 작성해준다.
```php
Route::get('/', function () {
    // ...
    return view('welcome')->withBooks($books);
});
```

```php
// welcome.blade.php
<ul>
<?php
    foreach($books as $book) {
        echo "<li>{$book}</li>";
    }
?>
</ul>
```

또는 아래와 같이 작성할 수도 있다. 아래와 같이 작성하는 것이 더 안전하다. (자바스크립트가 실행이 안되고 텍스트가 그대로 출력된다.)
```php
// welcome.blade.php
<ul>
    @foreach($books as $book)
        <li>{{ $book }}</li>
    @endforeach
</ul>
```

## Controller
### 생성하기
HomeController 생성하기
```
php artisan make:controller HomeController
```
`/app/Http/Controllers/HomeController.php` 생성된다.

```php
// HomeController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index() {
        $books = [
            'Harry Potter',
            'Laravel',
        ];
        return view('welcome', [
            'books' => $books
        ]);
    }

    public function hello() {
        return view('hello');
    }

    public function contact() {
        return view('contact');
    }

}
```

```php
// web.php
Route::get('/', 'App\Http\Controllers\HomeController@index'); // HomeController의 index() function을 실행한다.
Route::get('/hello', 'App\Http\Controllers\HomeController@hello');
Route::get('/contact', 'App\Http\Controllers\HomeController@contact');
```
또는
```php
// web.php
use App\Http\Controllers\HomeController;

Route::get('/', [HomeController::class, 'index']); 
Route::get('/hello', [HomeController::class, 'hello']);
Route::get('/contact', [HomeController::class, 'contact']);
```

## Database : MySQL
`/.env` 파일에서 DB 관련 설정을 할 수 있다.
```
// .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=1234
```

`/database/migrations`

파일 순서대로 migration을 진행하기 때문에 파일 순서도 중요하다.

테이블 생성하기
```
php artisan migrate
```

Rollback
- migrates 테이블의 id 값이 이전 번호부터 시작한다.
```
php artisan migrate:rollback
```

Fresh
- migrates 테이블의 id 값이 1번부터 시작한다.
```
php artisan migrate:fresh
```

## Model
### 새로운 테이블 생성을 위한 migration 파일 생성하기
```
php artisan make:migration create_테이블이름(복수형)_table
```


### Model 생성하기
```
php artisan make:model 모델명(단수형)
```

`/app/Models`에 생성된다.

### 예제
#### 테이블 생성
```
php artisan make:migration create_projects_table
```

```php
// /database/migrations/create_projects_table.php
class CreateProjectsTable extends Migration
{
    public function up()
        {
            Schema::create('projects', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->longText('description');
                $table->timestamps(); // created_at, updated_at 을 자동으로 생성해준다.
            });
        }
```

#### Model 생성
```
php artisan make:model Project
```

```php
// /app/Models/Project.php
class Project extends Model
{
    use HasFactory;
}
```

#### 페이지 생성
```php
// /resoureces/views/projects/index.blade.php
@extends('layout')

@section('content')
    <h1>Project List</h1>
    @foreach($projects as $project)
        Title: {{ $project->title }} <br>
        Description: {{ $project->description }} <br>
    @endforeach
@endsection
```

#### Controller 생성
```
php artisan make:controller ProjectController
```

```php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;

class ProjectController extends Controller
{
    public function index() {
        $projects = Project::all(); // 모든 데이터를 담아준다.

        return view('projects.index', [
            'projects' => $projects
        ]); // projects/index.blade.php
    }
}
```

## tailwindcss 설치하기
npm을 이용하여 css framework 설치하기
```
npm install tailwindcss
```

```css
/* /resoureces/css/tailwind.css */
@tailwind base;

@tailwind components;

@tailwind utilities;
```

```js
// /webpack.mix.js
mix.js('resources/js/app.js', 'public/js')
    // ...
    .postCss('resources/css/tailwind.css', 'public/css', [ // 추가
        require('tailwindcss'),
    ]); 
```

아래의 명령어를 실행하면 `/public/css/tailwind.css` 파일이 생성된다. 
```
npm run dev
```

```php
// /resoureces/views/layout.blade.php
<link rel="stylesheet" href="{{ mix('css/tailwind.css') }}">
```

아래와 같이 사용할 수 있다.
```php
<div class="bg-red-400">hello</div>
```

## 태스크 MVC 파일 생성하기
Model, Controller, Migration 파일 한번에 생성하기
```
php artisan make:model 모델이름 -c -m
```

### Example
```
php artisan make:model Task -c -m
```

#### 테이블 생성
```php
// create_tasks_table.php
class CreateTasksTable extends Migration
{
    public function up()
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('title');
            $table->longText('body');
            $table->timestamps();
        });
    }
```

```
php artisan migrate
```

#### 페이지 생성
```php
// /resources/views/tasks/index.blade.php
@extends('layout')

@section('title')
    Tasks
@endsection

@section('content')
    <h1 class="font-bold text-3xl">Tasks List</h1>
@endsection
```

```php
// /resources/views/tasks/create.blade.php
@extends('layout')

@section('title', 'Create Task')

@section('content')
    <h1 class="font-bold text-3xl">Create Task</h1>
@endsection
```

#### Controller 수정
```php
// TaskController
class TaskController extends Controller
{
    public function index() {
        return view('tasks.index');
    }

    public function create() {
        return view('tasks.create');
    }

}
```

#### Routes 수정
```php
// web.php
use App\Http\Controllers\TaskController;

Route::get('/tasks', [TaskController::class, 'index']);
Route::get('/tasks/create', [TaskController::class, 'create']);
```