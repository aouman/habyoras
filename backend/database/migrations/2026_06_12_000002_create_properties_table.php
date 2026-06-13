<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->decimal('price', 15, 0);
            $table->string('type');
            $table->string('transaction');
            $table->string('city');
            $table->string('commune');
            $table->string('country')->default('');
            $table->integer('bedrooms')->default(0);
            $table->integer('bathrooms')->default(0);
            $table->integer('surface')->default(0);
            $table->integer('parking')->default(0);
            $table->boolean('furnished')->default(false);
            $table->text('description')->nullable();
            $table->json('images')->nullable();
            $table->json('amenities')->nullable();
            $table->string('google_maps_link')->nullable();
            $table->string('status')->default('Actif');
            $table->string('moderation')->default('En attente');
            $table->boolean('featured')->default(false);
            $table->boolean('reported')->default(false);
            $table->integer('views')->default(0);
            $table->decimal('rating', 3, 1)->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('properties');
    }
};
