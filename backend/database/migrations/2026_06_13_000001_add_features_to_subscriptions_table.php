<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->boolean('unlimited_properties')->default(false)->after('max_properties');
            $table->boolean('can_message')->default(true)->after('unlimited_properties');
            $table->boolean('has_advanced_stats')->default(false)->after('can_message');
            $table->boolean('has_priority_support')->default(false)->after('has_advanced_stats');
            $table->boolean('has_featured')->default(false)->after('has_priority_support');
        });

        DB::statement('ALTER TABLE subscriptions MODIFY max_properties INT DEFAULT 5');
    }

    public function down()
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropColumn(['unlimited_properties', 'can_message', 'has_advanced_stats', 'has_priority_support', 'has_featured']);
        });
    }
};
