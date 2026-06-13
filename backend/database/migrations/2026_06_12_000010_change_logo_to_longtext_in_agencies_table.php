<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        DB::statement('ALTER TABLE agencies MODIFY logo LONGTEXT NULL');
    }

    public function down()
    {
        DB::statement('ALTER TABLE agencies MODIFY logo TEXT NULL');
    }
};
