import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { User, KeyRound, Mail, ArrowRight, Lock, Unlock } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {/* Login Redirect Section */}
                <div className="bg-orfarm-grey rounded-xl p-6 sm:p-10 order-2 lg:order-1">
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

                    <div className="flex flex-col items-center justify-center h-[calc(100%-120px)] text-center">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <Unlock className="size-8 text-orfarm-body/40" />
                        </div>
                        <p className="text-orfarm-body/70 text-sm mb-6 max-w-xs">
                            Already have an account? Log in to access your orders and manage your profile.
                        </p>
                        <Link
                            href={route('login')}
                            className="w-full h-[60px] border-2 border-orfarm-blue text-orfarm-blue rounded-lg font-semibold text-base hover:bg-orfarm-blue hover:text-white transition-all flex items-center justify-center gap-3"
                        >
                            Login Now
                            <ArrowRight className="size-5" />
                        </Link>
                    </div>
                </div>

                {/* Register Section */}
                <div className="bg-orfarm-grey rounded-xl p-6 sm:p-10 order-1 lg:order-2">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <Lock className="size-5 text-orfarm-blue" />
                        </div>
                        <div>
                            <h4 className="text-lg font-heading font-semibold text-orfarm-blue">Sign Up</h4>
                            <p className="text-sm text-orfarm-body/70 leading-relaxed mt-1">
                                Your personal data will be used to support your experience throughout this website, to manage access to your account.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={submit}>
                        <div className="mb-3">
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-orfarm-body/50">
                                    <User className="size-4" />
                                </span>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    autoComplete="name"
                                    autoFocus
                                    placeholder="Full name"
                                    className="w-full h-[60px] pl-14 pr-5 bg-white border-0 rounded-lg text-sm placeholder:text-orfarm-body/40 focus:outline-none focus:ring-2 focus:ring-orfarm-green/30"
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                            </div>
                            <InputError message={errors.name} className="mt-1.5" />
                        </div>

                        <div className="mb-3">
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-orfarm-body/50">
                                    <Mail className="size-4" />
                                </span>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    autoComplete="username"
                                    placeholder="Email address"
                                    className="w-full h-[60px] pl-14 pr-5 bg-white border-0 rounded-lg text-sm placeholder:text-orfarm-body/40 focus:outline-none focus:ring-2 focus:ring-orfarm-green/30"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
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
                                    autoComplete="new-password"
                                    placeholder="Password"
                                    className="w-full h-[60px] pl-14 pr-5 bg-white border-0 rounded-lg text-sm placeholder:text-orfarm-body/40 focus:outline-none focus:ring-2 focus:ring-orfarm-green/30"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                            </div>
                            <InputError message={errors.password} className="mt-1.5" />
                        </div>

                        <div className="mb-3">
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-orfarm-body/50">
                                    <KeyRound className="size-4" />
                                </span>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    autoComplete="new-password"
                                    placeholder="Confirm password"
                                    className="w-full h-[60px] pl-14 pr-5 bg-white border-0 rounded-lg text-sm placeholder:text-orfarm-body/40 focus:outline-none focus:ring-2 focus:ring-orfarm-green/30"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                            </div>
                            <InputError message={errors.password_confirmation} className="mt-1.5" />
                        </div>

                        <div className="mb-5">
                            <Link
                                href={route('login')}
                                className="text-sm text-orfarm-body/70 hover:text-orfarm-green transition-colors"
                            >
                                Already have an account?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full h-[60px] bg-orfarm-blue text-white rounded-lg font-semibold text-base hover:bg-orfarm-green transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            Register Now
                            <ArrowRight className="size-5" />
                        </button>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
