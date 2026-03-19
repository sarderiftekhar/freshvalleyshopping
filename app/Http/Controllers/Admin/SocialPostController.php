<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\PublishSocialPost;
use App\Models\ActivityLog;
use App\Models\Product;
use App\Models\SocialPost;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SocialPostController extends Controller
{
    public function index(Request $request)
    {
        $posts = SocialPost::with(['creator', 'product'])
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Marketing/Social/Index', [
            'posts' => $posts,
            'filters' => $request->only(['status']),
        ]);
    }

    public function create()
    {
        $products = Product::select('id', 'name')->where('is_active', true)->orderBy('name')->get();

        return Inertia::render('Admin/Marketing/Social/Create', [
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string|max:2000',
            'platforms' => 'required|array|min:1',
            'platforms.*' => 'in:facebook,instagram,whatsapp,telegram',
            'product_id' => 'nullable|exists:products,id',
            'image' => 'nullable|image|max:5120',
            'scheduled_at' => 'nullable|date|after:now',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('social-posts', 'public');
        }

        $post = SocialPost::create([
            'content' => $request->content,
            'platforms' => $request->platforms,
            'product_id' => $request->product_id,
            'image' => $imagePath,
            'status' => $request->scheduled_at ? 'scheduled' : 'draft',
            'scheduled_at' => $request->scheduled_at,
            'created_by' => $request->user()->id,
        ]);

        ActivityLog::log('social_post.created', $post);

        return redirect()->route('admin.social-posts.index')->with('success', 'Social post created.');
    }

    public function edit(SocialPost $socialPost)
    {
        $products = Product::select('id', 'name')->where('is_active', true)->orderBy('name')->get();

        return Inertia::render('Admin/Marketing/Social/Edit', [
            'post' => $socialPost,
            'products' => $products,
        ]);
    }

    public function update(Request $request, SocialPost $socialPost)
    {
        abort_if($socialPost->status === 'posted', 403, 'Cannot edit a posted item.');

        $request->validate([
            'content' => 'required|string|max:2000',
            'platforms' => 'required|array|min:1',
            'platforms.*' => 'in:facebook,instagram,whatsapp,telegram',
            'product_id' => 'nullable|exists:products,id',
            'image' => 'nullable|image|max:5120',
            'scheduled_at' => 'nullable|date|after:now',
        ]);

        $data = $request->only(['content', 'platforms', 'product_id', 'scheduled_at']);
        $data['status'] = $request->scheduled_at ? 'scheduled' : 'draft';

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('social-posts', 'public');
        }

        $socialPost->update($data);

        return redirect()->route('admin.social-posts.index')->with('success', 'Social post updated.');
    }

    public function destroy(SocialPost $socialPost)
    {
        abort_if($socialPost->status === 'posted', 403);
        $socialPost->delete();
        return back()->with('success', 'Social post deleted.');
    }

    public function publish(SocialPost $socialPost)
    {
        abort_if(!in_array($socialPost->status, ['draft', 'scheduled']), 403);

        PublishSocialPost::dispatch($socialPost);
        $socialPost->update(['status' => 'posted', 'posted_at' => now()]);

        ActivityLog::log('social_post.published', $socialPost);

        return back()->with('success', 'Post is being published to selected platforms.');
    }
}
