<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('stripe_charge_id')->nullable()->after('stripe_payment_intent_id');
            $table->decimal('refund_amount', 10, 2)->default(0)->after('total');
            $table->string('refund_reason')->nullable()->after('refund_amount');
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('preparing_at')->nullable();
            $table->timestamp('dispatched_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->string('cancellation_reason')->nullable();
            $table->text('admin_notes')->nullable();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['assigned_to']);
            $table->dropColumn([
                'stripe_charge_id', 'refund_amount', 'refund_reason',
                'confirmed_at', 'preparing_at', 'dispatched_at',
                'delivered_at', 'cancelled_at', 'cancellation_reason',
                'admin_notes', 'assigned_to',
            ]);
        });
    }
};
