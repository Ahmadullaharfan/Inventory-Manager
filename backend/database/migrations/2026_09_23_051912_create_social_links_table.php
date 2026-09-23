<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('social_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('platform', 50);   // linkedin, twitter, github, ...
            $table->string('url', 500);
            $table->timestamps();

            $table->unique(['user_id', 'platform']); // one link per platform per user
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('social_links');
    }
};