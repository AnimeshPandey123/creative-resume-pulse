---
title: 'A Comprehensive Guide to Learning Laravel: Mastering the PHP Framework for Web Development'
excerpt: 'Start a Laravel project with Composer and Artisan. Covers routing, controllers, Eloquent, Form Requests, migrations, and Blade—with accurate API references.'
publishDate: '2024-12-09'
tags: [laravel, php, web-development, backend-development]
---

# Getting started with Laravel

Laravel is the PHP framework I reach for when I need CRUD APIs, admin panels, or full-stack apps with sane defaults. This guide covers the fundamentals—enough to build a small task manager—not every Laravel feature.

**Scope note**: Laravel 11+ simplifies the default file structure (fewer boilerplate files). The concepts below apply across recent versions; command output may vary slightly.

## Project setup

Create a new project with Composer:

```bash
composer create-project laravel/laravel task-manager
cd task-manager
php artisan serve
```

Visit `http://localhost:8000`. Laravel ships with SQLite by default in recent versions; configure MySQL or PostgreSQL in `.env` for production.

Useful Artisan commands:

```bash
php artisan make:model Task -m          # model + migration
php artisan make:controller TaskController --resource
php artisan make:request StoreTaskRequest
php artisan migrate
```

## Routing

Routes live in `routes/web.php`. The `Route` facade registers URL-to-handler mappings:

```php
// routes/web.php
use App\Http\Controllers\TaskController;

Route::get('/tasks', [TaskController::class, 'index'])->name('tasks.index');
Route::post('/tasks', [TaskController::class, 'store'])->name('tasks.store');
```

Run `php artisan route:list` to inspect registered routes.

## Controllers

Generate controllers with Artisan—there is no "Controller facade":

```bash
php artisan make:controller TaskController
```

```php
// app/Http/Controllers/TaskController.php
namespace App\Http\Controllers;

use App\Models\Task;
use App\Http\Requests\StoreTaskRequest;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::latest()->get();
        return view('tasks.index', compact('tasks'));
    }

    public function store(StoreTaskRequest $request)
    {
        Task::create($request->validated());
        return redirect()->route('tasks.index');
    }
}
```

Controllers extend `App\Http\Controllers\Controller` and return views, JSON, or redirects.

## Eloquent ORM

Models map to database tables. Generate one with a migration:

```php
// app/Models/Task.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = ['name', 'description'];
}
```

Query examples:

```php
Task::all();
Task::where('name', 'like', '%deploy%')->get();
Task::findOrFail($id);
```

## Validation with Form Requests

Form Requests are classes—not facades. Generate one with Artisan:

```bash
php artisan make:request StoreTaskRequest
```

```php
// app/Http/Requests/StoreTaskRequest.php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
        ];
    }
}
```

Type-hint the request in your controller (`store(StoreTaskRequest $request)`). Laravel validates automatically and returns 422 on failure.

## Database migrations

Migrations version-control your schema:

```php
// database/migrations/xxxx_create_tasks_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
```

Apply migrations:

```bash
php artisan migrate
```

## Blade templates

Blade is Laravel's templating engine. A simple task list view:

```blade
{{-- resources/views/tasks/index.blade.php --}}
<h1>Tasks</h1>

<ul>
    @foreach ($tasks as $task)
        <li>{{ $task->name }} — {{ $task->description }}</li>
    @endforeach
</ul>

<form method="POST" action="{{ route('tasks.store') }}">
    @csrf
    <label for="name">Name</label>
    <input type="text" id="name" name="name" value="{{ old('name') }}">
    @error('name') <span>{{ $message }}</span> @enderror

    <label for="description">Description</label>
    <textarea id="description" name="description">{{ old('description') }}</textarea>
    @error('description') <span>{{ $message }}</span> @enderror

    <button type="submit">Create Task</button>
</form>
```

## What to learn next

Once the basics click, explore:

- **API routes** (`routes/api.php`) with Laravel Sanctum for token auth
- **Eloquent relationships** (`hasMany`, `belongsTo`)
- **Queues and jobs** for background work
- **Pest or PHPUnit** for testing (`php artisan make:test TaskTest`)

Laravel's documentation at [laravel.com/docs](https://laravel.com/docs) is excellent—this guide is a starting point, not a replacement.
