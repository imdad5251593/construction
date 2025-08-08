<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Subcategory;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Electrical',
                'description' => 'Electrical work and installations',
                'color_code' => '#FFA500',
                'subcategories' => [
                    'Wiring',
                    'Switches & Sockets',
                    'Lighting',
                    'Circuit Breakers',
                    'Electrical Panels'
                ]
            ],
            [
                'name' => 'Plumbing',
                'description' => 'Plumbing and water systems',
                'color_code' => '#0066CC',
                'subcategories' => [
                    'Water Supply',
                    'Drainage',
                    'Fixtures',
                    'Pipes & Fittings',
                    'Water Heaters'
                ]
            ],
            [
                'name' => 'Ceiling',
                'description' => 'Ceiling work and installations',
                'color_code' => '#9966CC',
                'subcategories' => [
                    'False Ceiling',
                    'Ceiling Fans',
                    'Ceiling Lights',
                    'Ceiling Materials',
                    'Ceiling Insulation'
                ]
            ],
            [
                'name' => 'Red Structure',
                'description' => 'Main structural work (red structure)',
                'color_code' => '#CC0000',
                'subcategories' => [
                    'Foundation',
                    'Columns',
                    'Beams',
                    'Slabs',
                    'Reinforcement'
                ]
            ],
            [
                'name' => 'Masonry',
                'description' => 'Brick work and masonry',
                'color_code' => '#996633',
                'subcategories' => [
                    'Brick Work',
                    'Block Work',
                    'Plastering',
                    'Mortar',
                    'Stone Work'
                ]
            ],
            [
                'name' => 'Finishing',
                'description' => 'Finishing work and materials',
                'color_code' => '#009966',
                'subcategories' => [
                    'Painting',
                    'Tiles',
                    'Flooring',
                    'Doors & Windows',
                    'Hardware'
                ]
            ]
        ];

        foreach ($categories as $categoryData) {
            $subcategories = $categoryData['subcategories'];
            unset($categoryData['subcategories']);
            
            $category = Category::create($categoryData);
            
            foreach ($subcategories as $subcategoryName) {
                Subcategory::create([
                    'category_id' => $category->id,
                    'name' => $subcategoryName,
                    'description' => "Subcategory for {$subcategoryName} under {$category->name}"
                ]);
            }
        }
    }
}
