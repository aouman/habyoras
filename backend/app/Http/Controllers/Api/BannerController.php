<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function index(Request $request)
    {
        $query = Banner::where('active', true)
            ->where(function ($q) {
                $q->whereNull('end_date')->orWhere('end_date', '>=', now()->format('Y-m-d'));
            })
            ->where(function ($q) {
                $q->whereNull('start_date')->orWhere('start_date', '<=', now()->format('Y-m-d'));
            })
            ->orderBy('sort_order');

        if ($request->position) {
            $query->whereJsonContains('positions', $request->position);
        }

        return $query->get();
    }

    public function adminIndex()
    {
        return Banner::orderBy('sort_order')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'image_url' => 'required|string|max:2048',
            'positions' => 'required|array|min:1',
            'positions.*' => 'required|in:home_horizontal,home_compact,sidebar_vertical,sidebar_compact,detail_sidebar',
            'link_url' => 'nullable|string|max:2048',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $banner = Banner::create($validated);

        return response()->json($banner, 201);
    }

    public function update(Request $request, $id)
    {
        $banner = Banner::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'image_url' => 'required|string|max:2048',
            'positions' => 'required|array|min:1',
            'positions.*' => 'required|in:home_horizontal,home_compact,sidebar_vertical,sidebar_compact,detail_sidebar',
            'link_url' => 'nullable|string|max:2048',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $banner->update($validated);

        return response()->json($banner);
    }

    public function destroy($id)
    {
        $banner = Banner::findOrFail($id);
        $banner->delete();
        return response()->json(['message' => 'Bannière supprimée.']);
    }
}
