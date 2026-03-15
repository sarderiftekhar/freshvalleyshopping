import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { User, KeyRound, ArrowRight, Unlock } from 'lucide-react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {/* Login Section */}
                <div className="bg-orfarm-grey rounded-xl p-6 sm:p-10">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <Unlock className="size-5 text-orfarm-blue" />
                        </div>
                        <div>
                            <h4 className="text-lg font-heading font-semibold text-orfarm-blue">Login Here</h4>
                            <p className="text-sm text-orfarm-body/70 leading-relaxed mt-1">
                                Your personal data will be used to support your experience throughout this website, to manage access to your account.
                            </p>
                        </div>
                    </div>

                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 rounded-lg px-4 py-3">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div className="mb-3">
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-orfarm-body/50">
                                    <User className="size-4" />
                                </span>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    autoComplete="username"
                                    autoFocus
                                    placeholder="Email address"
                                    className="w-full h-[60px] pl-14 pr-5 bg-white border-0 rounded-lg text-sm placeholder:text-orfarm-body/40 focus:outline-none focus:ring-2 focus:ring-orfarm-green/30"
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                            </div>
                            <InputError message={errors.email} className="mt-1.5" />
                        </div>

                        <div className="mb-3">
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-orfarm-body/50">
                                    <KeyRound className="size-4" />
                                </span>
                                <input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    className="w-full h-[60px] pl-14 pr-5 bg-white border-0 rounded-lg text-sm placeholder:text-orfarm-body/40 focus:outline-none focus:ring-2 focus:ring-orfarm-green/30"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                            </div>
                            <InputError message={errors.password} className="mt-1.5" />
                        </div>

                        <div className="flex items-center justify-between mb-5">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 rounded border-border text-orfarm-green focus:ring-orfarm-green/30"
                                />
                                <span className="text-sm text-orfarm-body/70">Remember me</span>
                            </label>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-orfarm-body/70 hover:text-orfarm-green transition-colors"
                                >
                                    Forgot Password?
                                </Link>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full h-[60px] bg-orfarm-green text-white rounded-lg font-semibold text-base hover:bg-orfarm-green-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            Login Now
                            <ArrowRight className="size-5" />
                        </button>
                    </form>
                </div>

                {/* Register Section */}
                <div className="bg-orfarm-grey rounded-xl p-6 sm:p-10">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <KeyRound className="size-5 text-orfarm-blue" />
                        </div>
                        <div>
                            <h4 className="text-lg font-heading font-semibold text-orfarm-blue">Sign Up</h4>
                            <p className="text-sm text-orfarm-body/70 leading-relaxed mt-1">
                                Your personal data will be used to support your experience throughout this website, to manage access to your account.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center h-[calc(100%-120px)] text-center">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <User className="size-8 text-orfarm-body/40" />
                        </div>
                        <p className="text-orfarm-body/70 text-sm mb-6 max-w-xs">
                            Don't have an account yet? Create one now to enjoy a faster checkout experience.
                        </p>
                        <Link
                            href={route('register')}
                            className="w-full h-[60px] border-2 border-orfarm-blue text-orfarm-blue rounded-lg font-semibold text-base hover:bg-orfarm-blue hover:text-white transition-all flex items-center justify-center gap-3"
                        >
                            Register Now
                            <ArrowRight className="size-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
