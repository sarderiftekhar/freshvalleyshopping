import { Head, router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Calendar, Plus, Trash2, Clock, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import ConfirmDialog from '@/Components/admin/ConfirmDialog';

interface DeliverySlot {
    id: number;
    delivery_date: string;
    label: string;
    start_time: string;
    end_time: string;
    max_orders: number;
    current_orders: number;
    delivery_fee: string;
    is_active: boolean;
}

interface Props {
    slots: { data: DeliverySlot[]; links: any[] };
    filters: { date_from?: string; date_to?: string };
}

function addHours(time: string, hours: number): string {
    if (!time) return '';
    const [h, m] = time.split(':').map(Number);
    const newH = Math.min(h + hours, 23);
    return `${String(newH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function formatDate(dateStr: string): string {
    if (!dateStr) return '';
    // Handle both "2026-03-29" and "2026-03-29T00:00:00.000000Z" formats
    const d = new Date(dateStr.includes('T') ? dateStr : dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(time: string): string {
    if (!time) return '';
    const [h, m] = time.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${String(m).padStart(2, '0')} ${ampm}`;
}

const today = new Date().toISOString().split('T')[0];

export default function DeliverySlotsIndex({ slots, filters }: Props) {
    const { errors } = usePage().props as any;
    const [showCreate, setShowCreate] = useState(false);
    const [showBulk, setShowBulk] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const createForm = useForm({
        delivery_date: '',
        start_time: '',
        end_time: '',
        max_orders: 10,
        delivery_fee: '3.99',
    });

    const bulkForm = useForm({
        date_from: '',
        date_to: '',
        days_of_week: [1, 2, 3, 4, 5] as number[],
        slots: [{ start_time: '09:00', end_time: '15:00', max_orders: 10, delivery_fee: '3.99' }],
    });

    // Auto-set end time to start_time + 6 hours for single create
    useEffect(() => {
        if (createForm.data.start_time) {
            const autoEnd = addHours(createForm.data.start_time, 6);
            if (!createForm.data.end_time || createForm.data.end_time <= createForm.data.start_time) {
                createForm.setData('end_time', autoEnd);
            }
        }
    }, [createForm.data.start_time]);

    // Auto-set end time to start_time + 6 hours for bulk create
    useEffect(() => {
        const slot = bulkForm.data.slots[0];
        if (slot.start_time) {
            const autoEnd = addHours(slot.start_time, 6);
            if (!slot.end_time || slot.end_time <= slot.start_time) {
                bulkForm.setData('slots', [{ ...slot, end_time: autoEnd }]);
            }
        }
    }, [bulkForm.data.slots[0]?.start_time]);

    const createTimeError = createForm.data.start_time && createForm.data.end_time && createForm.data.end_time <= createForm.data.start_time
        ? 'End time must be after start time' : '';

    const bulkTimeError = bulkForm.data.slots[0].start_time && bulkForm.data.slots[0].end_time && bulkForm.data.slots[0].end_time <= bulkForm.data.slots[0].start_time
        ? 'End time must be after start time' : '';

    const handleFilter = (key: string, value: string) => {
        router.get('/admin/delivery-slots', { ...filters, [key]: value }, { preserveState: true });
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (createTimeError) return;
        createForm.post('/admin/delivery-slots', {
            onSuccess: () => { setShowCreate(false); createForm.reset(); },
        });
    };

    const handleBulkCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (bulkTimeError) return;
        bulkForm.post('/admin/delivery-slots/bulk', {
            onSuccess: () => { setShowBulk(false); bulkForm.reset(); },
        });
    };

    const toggleDay = (day: number) => {
        const days = bulkForm.data.days_of_week.includes(day)
            ? bulkForm.data.days_of_week.filter(d => d !== day)
            : [...bulkForm.data.days_of_week, day];
        bulkForm.setData('days_of_week', days);
    };

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const inputClass = 'w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500';
    const inputErrorClass = 'w-full border border-red-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500';
    const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
    const errorTextClass = 'text-xs text-red-500 mt-1 flex items-center gap-1';

    return (
        <AdminLayout>
            <Head title="Delivery Slots" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-green-600" />
                        Delivery Slots
                    </h1>
                    <div className="flex gap-2">
                        <button onClick={() => setShowBulk(true)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                            Bulk Create
                        </button>
                        <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-2 transition-colors">
                            <Plus className="w-4 h-4" /> Add Slot
                        </button>
                    </div>
                </div>

                {/* Date filters */}
                <div className="flex gap-4 items-end">
                    <div>
                        <label className={labelClass}>From Date</label>
                        <input type="date" value={filters.date_from || ''} min={today} onChange={e => handleFilter('date_from', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>To Date</label>
                        <input type="date" value={filters.date_to || ''} min={filters.date_from || today} onChange={e => handleFilter('date_to', e.target.value)} className={inputClass} />
                    </div>
                </div>

                {/* Slots table */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time Slot</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {slots.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        No delivery slots found. Create one to get started.
                                    </td>
                                </tr>
                            )}
                            {slots.data.map(slot => (
                                <tr key={slot.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {formatDate(slot.delivery_date)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {slot.label || `${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}`}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={slot.current_orders >= slot.max_orders ? 'text-red-600 font-medium' : 'text-gray-600'}>
                                            {slot.current_orders}/{slot.max_orders}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">£{Number(slot.delivery_fee).toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${slot.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {slot.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => setDeleteId(slot.id)} className="text-red-500 hover:text-red-700 transition-colors p-1 rounded hover:bg-red-50">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {slots.links && slots.links.length > 3 && (
                    <div className="flex justify-center gap-1">
                        {slots.links.map((link: any, i: number) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                className={`px-3 py-1.5 text-sm rounded-lg ${link.active ? 'bg-green-600 text-white' : 'bg-white border text-gray-700 hover:bg-gray-50'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}

                {/* Create Slot Modal */}
                {showCreate && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowCreate(false)}>
                        <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                            <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
                                <Plus className="w-5 h-5" /> Add Delivery Slot
                            </h3>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <label className={labelClass}>Delivery Date *</label>
                                    <input
                                        type="date"
                                        value={createForm.data.delivery_date}
                                        min={today}
                                        onChange={e => createForm.setData('delivery_date', e.target.value)}
                                        className={createForm.errors.delivery_date ? inputErrorClass : inputClass}
                                        required
                                    />
                                    {createForm.errors.delivery_date && (
                                        <p className={errorTextClass}><AlertCircle className="w-3 h-3" /> {createForm.errors.delivery_date}</p>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Start Time *</label>
                                        <input
                                            type="time"
                                            value={createForm.data.start_time}
                                            onChange={e => createForm.setData('start_time', e.target.value)}
                                            className={createForm.errors.start_time ? inputErrorClass : inputClass}
                                            required
                                        />
                                        {createForm.errors.start_time && (
                                            <p className={errorTextClass}><AlertCircle className="w-3 h-3" /> {createForm.errors.start_time}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className={labelClass}>End Time *</label>
                                        <input
                                            type="time"
                                            value={createForm.data.end_time}
                                            onChange={e => createForm.setData('end_time', e.target.value)}
                                            className={createTimeError || createForm.errors.end_time ? inputErrorClass : inputClass}
                                            required
                                        />
                                        {createTimeError && (
                                            <p className={errorTextClass}><AlertCircle className="w-3 h-3" /> {createTimeError}</p>
                                        )}
                                        {createForm.errors.end_time && (
                                            <p className={errorTextClass}><AlertCircle className="w-3 h-3" /> {createForm.errors.end_time}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Max Orders *</label>
                                        <input
                                            type="number"
                                            value={createForm.data.max_orders}
                                            onChange={e => createForm.setData('max_orders', Number(e.target.value))}
                                            className={createForm.errors.max_orders ? inputErrorClass : inputClass}
                                            min="1"
                                            required
                                        />
                                        {createForm.errors.max_orders && (
                                            <p className={errorTextClass}><AlertCircle className="w-3 h-3" /> {createForm.errors.max_orders}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className={labelClass}>Delivery Fee (£) *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={createForm.data.delivery_fee}
                                            onChange={e => createForm.setData('delivery_fee', e.target.value)}
                                            className={createForm.errors.delivery_fee ? inputErrorClass : inputClass}
                                            min="0"
                                            required
                                        />
                                        {createForm.errors.delivery_fee && (
                                            <p className={errorTextClass}><AlertCircle className="w-3 h-3" /> {createForm.errors.delivery_fee}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 transition-colors">Cancel</button>
                                    <button
                                        type="submit"
                                        disabled={createForm.processing || !!createTimeError}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
                                    >
                                        {createForm.processing ? 'Creating...' : 'Create Slot'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Bulk Create Modal */}
                {showBulk && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowBulk(false)}>
                        <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
                            <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5" /> Bulk Create Delivery Slots
                            </h3>
                            <form onSubmit={handleBulkCreate} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>From Date *</label>
                                        <input
                                            type="date"
                                            value={bulkForm.data.date_from}
                                            min={today}
                                            onChange={e => {
                                                bulkForm.setData('date_from', e.target.value);
                                                if (bulkForm.data.date_to && bulkForm.data.date_to < e.target.value) {
                                                    bulkForm.setData('date_to', e.target.value);
                                                }
                                            }}
                                            className={bulkForm.errors.date_from ? inputErrorClass : inputClass}
                                            required
                                        />
                                        {bulkForm.errors.date_from && (
                                            <p className={errorTextClass}><AlertCircle className="w-3 h-3" /> {bulkForm.errors.date_from}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className={labelClass}>To Date *</label>
                                        <input
                                            type="date"
                                            value={bulkForm.data.date_to}
                                            min={bulkForm.data.date_from || today}
                                            onChange={e => bulkForm.setData('date_to', e.target.value)}
                                            className={bulkForm.errors.date_to ? inputErrorClass : inputClass}
                                            required
                                        />
                                        {bulkForm.errors.date_to && (
                                            <p className={errorTextClass}><AlertCircle className="w-3 h-3" /> {bulkForm.errors.date_to}</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Days of Week *</label>
                                    <div className="flex gap-2">
                                        {dayNames.map((name, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => toggleDay(i)}
                                                className={`px-3 py-1.5 rounded-lg text-sm border transition-all duration-200 ${
                                                    bulkForm.data.days_of_week.includes(i)
                                                        ? 'bg-green-600 text-white border-green-600 shadow-sm'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
                                                }`}
                                            >
                                                {name}
                                            </button>
                                        ))}
                                    </div>
                                    {bulkForm.errors.days_of_week && (
                                        <p className={errorTextClass}><AlertCircle className="w-3 h-3" /> {bulkForm.errors.days_of_week}</p>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Start Time *</label>
                                        <input
                                            type="time"
                                            value={bulkForm.data.slots[0].start_time}
                                            onChange={e => bulkForm.setData('slots', [{ ...bulkForm.data.slots[0], start_time: e.target.value }])}
                                            className={bulkForm.errors['slots.0.start_time'] ? inputErrorClass : inputClass}
                                            required
                                        />
                                        {bulkForm.errors['slots.0.start_time'] && (
                                            <p className={errorTextClass}><AlertCircle className="w-3 h-3" /> {bulkForm.errors['slots.0.start_time']}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className={labelClass}>End Time *</label>
                                        <input
                                            type="time"
                                            value={bulkForm.data.slots[0].end_time}
                                            onChange={e => bulkForm.setData('slots', [{ ...bulkForm.data.slots[0], end_time: e.target.value }])}
                                            className={bulkTimeError || bulkForm.errors['slots.0.end_time'] ? inputErrorClass : inputClass}
                                            required
                                        />
                                        {bulkTimeError && (
                                            <p className={errorTextClass}><AlertCircle className="w-3 h-3" /> {bulkTimeError}</p>
                                        )}
                                        {bulkForm.errors['slots.0.end_time'] && (
                                            <p className={errorTextClass}><AlertCircle className="w-3 h-3" /> {bulkForm.errors['slots.0.end_time']}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Max Orders *</label>
                                        <input
                                            type="number"
                                            value={bulkForm.data.slots[0].max_orders}
                                            onChange={e => bulkForm.setData('slots', [{ ...bulkForm.data.slots[0], max_orders: Number(e.target.value) }])}
                                            className={bulkForm.errors['slots.0.max_orders'] ? inputErrorClass : inputClass}
                                            min="1"
                                            required
                                        />
                                        {bulkForm.errors['slots.0.max_orders'] && (
                                            <p className={errorTextClass}><AlertCircle className="w-3 h-3" /> {bulkForm.errors['slots.0.max_orders']}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className={labelClass}>Fee (£) *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={bulkForm.data.slots[0].delivery_fee}
                                            onChange={e => bulkForm.setData('slots', [{ ...bulkForm.data.slots[0], delivery_fee: e.target.value }])}
                                            className={bulkForm.errors['slots.0.delivery_fee'] ? inputErrorClass : inputClass}
                                            min="0"
                                            required
                                        />
                                        {bulkForm.errors['slots.0.delivery_fee'] && (
                                            <p className={errorTextClass}><AlertCircle className="w-3 h-3" /> {bulkForm.errors['slots.0.delivery_fee']}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button type="button" onClick={() => setShowBulk(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 transition-colors">Cancel</button>
                                    <button
                                        type="submit"
                                        disabled={bulkForm.processing || !!bulkTimeError}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
                                    >
                                        {bulkForm.processing ? 'Creating...' : 'Create Slots'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <ConfirmDialog
                    open={deleteId !== null}
                    onClose={() => setDeleteId(null)}
                    onConfirm={() => {
                        if (deleteId) router.delete(`/admin/delivery-slots/${deleteId}`);
                        setDeleteId(null);
                    }}
                    title="Delete Delivery Slot"
                    message="Are you sure you want to delete this delivery slot? This action cannot be undone."
                    variant="danger"
                />
            </div>
        </AdminLayout>
    );
}
