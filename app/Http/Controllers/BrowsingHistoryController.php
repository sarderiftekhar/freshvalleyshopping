<?php

namespace App\Http\Controllers;

use App\Models\BrowsingHistory;
use Illuminate\Http\Request;

class BrowsingHistoryController extends Controller
{
    public function store(Request $request)
    {
        $request->validate(['product_id' => 'required|exists:products,id']);

        BrowsingHistory::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'product_id' => $request->product_id,
            ],
            ['viewed_at' => now()]
        );

        return response()->json(['ok' => true]);
    }
}
