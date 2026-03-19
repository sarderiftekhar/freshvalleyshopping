<?php

namespace App\Http\Controllers;

use App\Models\Favourite;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FavouriteController extends Controller
{
    public function index(Request $request)
    {
        $favourites = $request->user()
            ->favourites()
            ->with('images')
            ->paginate(20);

        return Inertia::render('Favourites', [
            'favourites' => $favourites,
        ]);
    }

    public function toggle(Request $request)
    {
        $request->validate(['product_id' => 'required|exists:products,id']);

        $existing = Favourite::where('user_id', $request->user()->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($existing) {
            $existing->delete();
            return back()->with('success', 'Removed from favourites.');
        }

        Favourite::create([
            'user_id' => $request->user()->id,
            'product_id' => $request->product_id,
        ]);

        return back()->with('success', 'Added to favourites.');
    }
}
