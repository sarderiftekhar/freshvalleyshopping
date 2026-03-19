<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriberController extends Controller
{
    public function index(Request $request)
    {
        $subscribers = NewsletterSubscriber::query()
            ->when($request->search, fn ($q, $s) => $q->where('email', 'like', "%{$s}%")
                ->orWhere('name', 'like', "%{$s}%"))
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        $counts = [
            'total' => NewsletterSubscriber::count(),
            'subscribed' => NewsletterSubscriber::subscribed()->count(),
            'unsubscribed' => NewsletterSubscriber::where('status', 'unsubscribed')->count(),
        ];

        return Inertia::render('Admin/Marketing/Subscribers/Index', [
            'subscribers' => $subscribers,
            'counts' => $counts,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:2048',
        ]);

        $file = $request->file('file');
        $handle = fopen($file->getPathname(), 'r');
        $header = fgetcsv($handle);
        $imported = 0;

        while (($row = fgetcsv($handle)) !== false) {
            $data = array_combine($header, $row);
            $email = $data['email'] ?? $data['Email'] ?? null;
            if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) continue;

            NewsletterSubscriber::firstOrCreate(
                ['email' => strtolower(trim($email))],
                [
                    'name' => $data['name'] ?? $data['Name'] ?? null,
                    'status' => 'subscribed',
                    'subscribed_at' => now(),
                ]
            );
            $imported++;
        }

        fclose($handle);

        return back()->with('success', "{$imported} subscribers imported.");
    }

    public function export()
    {
        $subscribers = NewsletterSubscriber::all();

        $csv = "Email,Name,Status,Subscribed At\n";
        foreach ($subscribers as $s) {
            $csv .= implode(',', [
                $s->email,
                '"' . ($s->name ?? '') . '"',
                $s->status,
                $s->subscribed_at?->format('Y-m-d') ?? '',
            ]) . "\n";
        }

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="subscribers-' . now()->format('Y-m-d') . '.csv"',
        ]);
    }

    public function destroy(NewsletterSubscriber $subscriber)
    {
        $subscriber->delete();
        return back()->with('success', 'Subscriber removed.');
    }
}
