<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('banners', function (Blueprint $table) {
            $table->dropColumn('position');
        });

        Schema::table('banners', function (Blueprint $table) {
            $table->json('positions')->after('image_url');
            $table->date('start_date')->nullable()->after('positions');
            $table->date('end_date')->nullable()->after('start_date');
        });
    }

    public function down()
    {
        Schema::table('banners', function (Blueprint $table) {
            $table->dropColumn(['positions', 'start_date', 'end_date']);
        });

        Schema::table('banners', function (Blueprint $table) {
            $table->enum('position', ['home_horizontal', 'home_compact', 'sidebar_vertical', 'sidebar_compact', 'detail_sidebar'])
                  ->default('home_horizontal')->after('image_url');
        });
    }
};
