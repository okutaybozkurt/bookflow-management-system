<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('title')->index();
            $table->string('isbn', 20)->nullable()->unique();
            $table->decimal('price', 10, 2);
            $table->unsignedInteger('stock')->default(0);
            $table->string('cover_image')->nullable();
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('page_count')->nullable();
            $table->unsignedSmallInteger('published_year')->nullable();
            $table->string('language', 30)->default('Türkçe');
            $table->boolean('is_active')->default(true)->index();
            $table->foreignId('author_id')->constrained()->restrictOnDelete();
            $table->foreignId('category_id')->constrained()->restrictOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
