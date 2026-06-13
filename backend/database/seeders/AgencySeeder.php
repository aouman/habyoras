<?php

namespace Database\Seeders;

use App\Models\Agency;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AgencySeeder extends Seeder
{
    public function run()
    {
        $agencies = [
            ['name' => 'Ivoire Immo', 'email' => 'contact@ivoireimmo.ci', 'phone_call' => '+225 01 02 03 04 01', 'phone_whatsapp' => '+225 01 02 03 04 01', 'city' => 'Abidjan - Plateau', 'description' => "Leader de l'immobilier résidentiel à Abidjan depuis 2010.", 'verified' => true],
            ['name' => 'Atlantic Realty', 'email' => 'contact@atlanticrealty.ci', 'phone_call' => '+225 01 02 03 04 02', 'phone_whatsapp' => '+225 01 02 03 04 02', 'city' => 'Abidjan - Marcory', 'description' => 'Spécialiste des espaces professionnels et bureaux premium.', 'verified' => true],
            ['name' => 'Cocody Prestige', 'email' => 'contact@cocodyprestige.ci', 'phone_call' => '+225 01 02 03 04 03', 'phone_whatsapp' => '+225 01 02 03 04 03', 'city' => 'Abidjan - Cocody', 'description' => "Villas de luxe et propriétés d'exception en Côte d'Ivoire.", 'verified' => true],
            ['name' => 'Lagune Habitat', 'email' => 'contact@lagunehabitat.ci', 'phone_call' => '+225 01 02 03 04 04', 'phone_whatsapp' => '+225 01 02 03 04 04', 'city' => 'Abidjan - Yopougon', 'description' => 'Terrains, immeubles de rapport et investissements rentables.', 'verified' => true],
            ['name' => 'Bassam Immobilier', 'email' => 'contact@bassamimmo.ci', 'phone_call' => '+225 01 02 03 04 05', 'city' => 'Grand-Bassam', 'description' => 'Propriétés en bord de mer et résidences secondaires.', 'verified' => false],
            ['name' => 'Bingerville Estates', 'email' => 'contact@bingerville.ci', 'phone_call' => '+225 01 02 03 04 06', 'city' => 'Abidjan - Bingerville', 'description' => 'Maisons familiales et terrains constructibles.', 'verified' => true],
        ];

        foreach ($agencies as $a) {
            Agency::create(array_merge($a, ['password' => Hash::make('password')]));
        }
    }
}
