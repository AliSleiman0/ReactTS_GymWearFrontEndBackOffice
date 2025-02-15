import React, { ChangeEvent, FormEvent } from 'react';
import { HiOutlineXMark } from 'react-icons/hi2';
import {  UserRoles, UserSignupDTO, addUser } from '../api/user';
import { toast } from 'react-hot-toast';
import { ImSpinner8 } from 'react-icons/im';
import axios from 'axios';
interface AddDataProps {
    slug: string;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const AddDataUser: React.FC<AddDataProps> = ({ slug, isOpen, setIsOpen }) => {
    const [showModal, setShowModal] = React.useState(false);
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        role: '',
        password: '',
        confirmPassword: ''
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            // Client-side validation
            if (formData.password.length < 6) {
                const message = 'Password must be at least 6 characters';
                setError(message);
                toast.error(message);
                return;
            }

            if (formData.password !== formData.confirmPassword) {
                const message = 'Password and confirmation do not match';
                setError(message);
                toast.error(message);
                return;
            }

            const newUser: UserSignupDTO = {
                name: formData.name,
                email: formData.email,
                role: Number(formData.role) as UserRoles,
                password: formData.password,
                confirmPassword: formData.confirmPassword
            };

            const response = await addUser(newUser);

            if (!response) {
                throw new Error('Failed to create user account');
            }

            toast.success('Account created successfully!');
            handleClose();
            window.location.reload();
        } catch (err) {
            let errorMessage = 'An unexpected error occurred';

            // Handle API validation errors
            if (axios.isAxiosError(err) && err.response?.data?.errors) {
                const apiErrors = err.response.data.errors;
                errorMessage = Object.values(apiErrors)
                    .flat()
                    .join('\n');
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            toast.error(errorMessage, {
                duration: 5000,
                style: { whiteSpace: 'pre-line' }
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleClose = () => {
        setFormData({ name: '', email: '', role: '', password: '', confirmPassword: '' });
        setError(null);
        setShowModal(false);
        setIsOpen(false);
    };

    const formIsValid = formData.name.trim() &&
        formData.email.trim() &&
        formData.role &&
        /\S+@\S+\.\S+/.test(formData.email);

    React.useEffect(() => {
        setShowModal(isOpen);
    }, [isOpen]);

    if (slug === 'user') {
        return (
            <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center bg-black/75 z-[99]">
                <div className={`w-[80%] xl:w-[50%] rounded-lg p-7 bg-base-100 relative transition duration-300 
                               ${showModal ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                    <div className="w-full flex justify-between pb-5 border-b border-base-content border-opacity-30">
                        <button onClick={handleClose} className="absolute top-5 right-3 btn btn-ghost btn-circle">
                            <HiOutlineXMark className="text-xl font-bold" />
                        </button>
                        <span className="text-2xl font-bold">Add new {slug}</span>
                    </div>

                    {error && (
                        <div className="alert alert-error mt-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                        <input
                            type="text"
                            placeholder="Name"
                            className="input input-bordered w-full"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            className="input input-bordered w-full"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="input input-bordered w-full"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                        />
                        <input
                            type="confirmPassword"
                            placeholder="Confirm Password"
                            className="input input-bordered w-full"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                        />


                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Select Role</span>
                            </div>
                            <select
                                className="select select-bordered"
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            >
                                <option value="" disabled>Select one</option>
                                <option value="1">Admin</option>
                                <option value="2">Staff</option>
                                <option value="3">Guest</option>
                                <option value="4">Customer</option>
                            </select>
                        </label>

                        <button
                            type="submit"
                            className={`mt-5 btn btn-primary btn-block col-span-full font-semibold ${isSubmitting ? 'btn-disabled' : ''
                                }`}
                            disabled={!formIsValid || isSubmitting}
                        >
                            {isSubmitting ? (
                                <ImSpinner8 className="animate-spin text-xl" />
                            ) : (
                                'Submit'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return null;
};

export default AddDataUser;