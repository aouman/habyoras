<?php

namespace Database\Seeders;

use App\Models\Property;
use Illuminate\Database\Seeder;

class PropertySeeder extends Seeder
{
    public function run()
    {
        $properties = [
            ['agency_id' => 3, 'title' => 'Villa moderne avec piscine', 'price' => 250000000, 'type' => 'Villa', 'transaction' => 'Vente', 'city' => 'Abidjan', 'commune' => 'Cocody', 'bedrooms' => 5, 'bathrooms' => 4, 'surface' => 420, 'parking' => 3, 'description' => "Magnifique villa contemporaine située dans un quartier résidentiel huppé de Cocody.", 'moderation' => 'Approuvé', 'featured' => true, 'rating' => 4.9, 'amenities' => ['Piscine', 'Jardin paysagé', 'Climatisation', 'Cuisine équipée', 'Garage', 'Sécurité 24h/24']],
            ['agency_id' => 1, 'title' => 'Appartement meublé standing', 'price' => 850000, 'type' => 'Appartement', 'transaction' => 'Location', 'city' => 'Abidjan', 'commune' => 'Plateau', 'bedrooms' => 3, 'bathrooms' => 2, 'surface' => 130, 'parking' => 1, 'description' => "Bel appartement meublé au cœur du Plateau, proche des centres d'affaires.", 'moderation' => 'Approuvé', 'featured' => true, 'rating' => 4.7, 'furnished' => true, 'amenities' => ['Climatisation', 'Wifi haut débit', 'Cuisine équipée', 'Eau chaude', 'Ascenseur', 'Sécurité 24h/24']],
            ['agency_id' => 2, 'title' => 'Bureau open-space premium', 'price' => 1500000, 'type' => 'Bureau', 'transaction' => 'Location', 'city' => 'Abidjan', 'commune' => 'Plateau', 'bedrooms' => 0, 'bathrooms' => 2, 'surface' => 200, 'parking' => 4, 'description' => "Espace de bureau moderne en open-space avec salles de réunion.", 'moderation' => 'Approuvé', 'featured' => true, 'rating' => 4.6, 'amenities' => ['Climatisation', 'Fibre optique', 'Salles de réunion', 'Parking dédié', 'Ascenseur', 'Sécurité 24h/24']],
            ['agency_id' => 4, 'title' => 'Terrain constructible 800m²', 'price' => 45000000, 'type' => 'Terrain', 'transaction' => 'Vente', 'city' => 'Grand-Bassam', 'commune' => 'Grand-Bassam', 'bedrooms' => 0, 'bathrooms' => 0, 'surface' => 800, 'parking' => 0, 'description' => "Terrain plat et viabilisé idéal pour construction de villa ou immeuble.", 'moderation' => 'Approuvé', 'rating' => 4.5],
            ['agency_id' => 1, 'title' => 'Appartement vue lagune', 'price' => 650000, 'type' => 'Appartement', 'transaction' => 'Location', 'city' => 'Abidjan', 'commune' => 'Marcory', 'bedrooms' => 2, 'bathrooms' => 1, 'surface' => 95, 'parking' => 1, 'description' => "Appartement lumineux avec vue imprenable sur la lagune Ébrié.", 'moderation' => 'Approuvé', 'rating' => 4.4, 'amenities' => ['Climatisation', 'Balcon', 'Cuisine équipée', 'Eau chaude']],
            ['agency_id' => 3, 'title' => 'Villa familiale avec jardin', 'price' => 180000000, 'type' => 'Villa', 'transaction' => 'Vente', 'city' => 'Abidjan', 'commune' => 'Bingerville', 'bedrooms' => 4, 'bathrooms' => 3, 'surface' => 350, 'parking' => 2, 'description' => "Spacieuse villa familiale avec grand jardin arboré dans le calme de Bingerville.", 'moderation' => 'Approuvé', 'rating' => 4.8, 'amenities' => ['Jardin paysagé', 'Garage', 'Climatisation', 'Cuisine équipée', 'Terrasse']],
            ['agency_id' => 2, 'title' => 'Studio meublé centre-ville', 'price' => 350000, 'type' => 'Appartement', 'transaction' => 'Location', 'city' => 'Abidjan', 'commune' => 'Cocody', 'bedrooms' => 1, 'bathrooms' => 1, 'surface' => 45, 'parking' => 1, 'description' => "Studio moderne entièrement meublé, idéal pour jeune professionnel.", 'moderation' => 'Approuvé', 'rating' => 4.2, 'furnished' => true, 'amenities' => ['Climatisation', 'Wifi haut débit', 'Cuisine équipée', 'Eau chaude']],
            ['agency_id' => 4, 'title' => 'Immeuble de rapport R+3', 'price' => 420000000, 'type' => 'Immeuble', 'transaction' => 'Vente', 'city' => 'Abidjan', 'commune' => 'Yopougon', 'bedrooms' => 12, 'bathrooms' => 12, 'surface' => 900, 'parking' => 6, 'description' => "Immeuble de rapport entièrement loué, excellent rendement locatif.", 'moderation' => 'Approuvé', 'rating' => 4.6, 'amenities' => ['Ascenseur', 'Parking', 'Sécurité 24h/24', 'Groupe électrogène', 'Forage / eau']],
            ['agency_id' => 3, 'title' => 'Villa de luxe bord de mer', 'price' => 520000000, 'type' => 'Villa', 'transaction' => 'Vente', 'city' => 'Grand-Bassam', 'commune' => 'Grand-Bassam', 'bedrooms' => 6, 'bathrooms' => 5, 'surface' => 600, 'parking' => 4, 'description' => "Villa d'exception en bord de mer avec accès direct à la plage.", 'moderation' => 'Approuvé', 'featured' => true, 'rating' => 5.0, 'amenities' => ['Piscine', 'Jardin paysagé', 'Climatisation', 'Cuisine équipée', 'Garage', 'Sécurité 24h/24', 'Terrasse']],
            ['agency_id' => 1, 'title' => 'Appartement 4 pièces neuf', 'price' => 950000, 'type' => 'Appartement', 'transaction' => 'Location', 'city' => 'Abidjan', 'commune' => 'Cocody', 'bedrooms' => 3, 'bathrooms' => 2, 'surface' => 145, 'parking' => 2, 'description' => "Appartement neuf dans résidence sécurisée avec piscine commune.", 'moderation' => 'Approuvé', 'rating' => 4.7, 'amenities' => ['Climatisation', 'Cuisine équipée', 'Balcon', 'Parking', 'Sécurité 24h/24']],
        ];

        foreach ($properties as $p) {
            Property::create($p);
        }
    }
}
