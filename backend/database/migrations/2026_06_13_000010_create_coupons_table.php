<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->unsignedTinyInteger('discount_percent')->nullable()->comment('Pourcentage de réduction (ex: 20 = -20%)');
            $table->unsignedInteger('discount_amount')->nullable()->comment('Montant fixe en XOF');
            $table->json('applicable_plans')->nullable()->comment('Plans concernés: ["Premium","Gold"] ou null=tous');
            $table->unsignedInteger('max_uses')->default(0)->comment('0 = illimité');
            $table->unsignedInteger('used_count')->default(0);
            $table->date('valid_from')->nullable();
            $table->date('valid_until')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('coupons');
    }
};
