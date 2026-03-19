<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\DeliverySlot;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeliverySlotController extends Controller
{
    public function index(Request $request)
    {
        $slots = DeliverySlot::query()
            ->when($request->date_from, fn ($q, $d) => $q->whereDate('delivery_date', '>=', $d))
            ->when($request->date_to, fn ($q, $d) => $q->whereDate('delivery_date', '<=', $d))
            ->orderBy('delivery_date')
            ->orderBy('start_time')
            ->paginate(30)
            ->withQueryString();

        return Inertia::render('Admin/DeliverySlots/Index', [
            'slots' => $slots,
            'filters' => $request->only(['date_from', 'date_to']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'delivery_date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'max_orders' => 'required|integer|min:1',
            'delivery_fee' => 'required|numeric|min:0',
        ]);

        $label = Carbon::createFromFormat('H:i', $request->start_time)->format('g:i A')
            . ' - '
            . Carbon::createFromFormat('H:i', $request->end_time)->format('g:i A');

        DeliverySlot::create([
            'delivery_date' => $request->delivery_date,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'label' => $label,
            'max_orders' => $request->max_orders,
            'delivery_fee' => $request->delivery_fee,
        ]);

        return back()->with('success', 'Delivery slot created.');
    }

    public function update(Request $request, DeliverySlot $deliverySlot)
    {
        $request->validate([
            'max_orders' => 'required|integer|min:1',
            'delivery_fee' => 'required|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $deliverySlot->update($request->only(['max_orders', 'delivery_fee', 'is_active']));

        return back()->with('success', 'Delivery slot updated.');
    }

    public function destroy(DeliverySlot $deliverySlot)
    {
        $deliverySlot->delete();
        return back()->with('success', 'Delivery slot deleted.');
    }

    public function bulkCreate(Request $request)
    {
        $request->validate([
            'date_from' => 'required|date|after_or_equal:today',
            'date_to' => 'required|date|after_or_equal:date_from',
            'slots' => 'required|array|min:1',
            'slots.*.start_time' => 'required|date_format:H:i',
            'slots.*.end_time' => 'required|date_format:H:i|after:slots.*.start_time',
            'slots.*.max_orders' => 'required|integer|min:1',
            'slots.*.delivery_fee' => 'required|numeric|min:0',
            'days_of_week' => 'required|array|min:1',
            'days_of_week.*' => 'integer|between:0,6',
        ]);

        $start = Carbon::parse($request->date_from);
        $end = Carbon::parse($request->date_to);
        $count = 0;

        for ($date = $start->copy(); $date->lte($end); $date->addDay()) {
            if (!in_array($date->dayOfWeek, $request->days_of_week)) continue;

            foreach ($request->slots as $slot) {
                $label = Carbon::createFromFormat('H:i', $slot['start_time'])->format('g:i A')
                    . ' - '
                    . Carbon::createFromFormat('H:i', $slot['end_time'])->format('g:i A');

                DeliverySlot::firstOrCreate(
                    ['delivery_date' => $date->toDateString(), 'start_time' => $slot['start_time']],
                    [
                        'end_time' => $slot['end_time'],
                        'label' => $label,
                        'max_orders' => $slot['max_orders'],
                        'delivery_fee' => $slot['delivery_fee'],
                    ]
                );
                $count++;
            }
        }

        ActivityLog::log('delivery_slots.bulk_created', null, ['count' => $count]);

        return back()->with('success', "{$count} delivery slots created.");
    }
}
