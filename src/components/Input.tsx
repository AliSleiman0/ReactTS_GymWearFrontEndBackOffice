import React from 'react';

interface InputProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    required?: boolean;
    type?: string;
}

const Input: React.FC<InputProps> = ({ label, name, value, onChange, required = false, type = 'text' }) => {
    return (
        <div className="flex flex-col gap-1">
            <label className="font-medium">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="input input-bordered w-full"
            />
        </div>
    );
};

export default Input;