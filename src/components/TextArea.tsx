import React from 'react';

interface TextAreaProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    required?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({ label, name, value, onChange, required = false }) => {
    return (
        <div className="flex flex-col gap-1">
            <label className="font-medium">{label}</label>
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="textarea textarea-bordered w-full h-32 resize-none" // Adjust height as needed
            />
        </div>
    );
};

export default TextArea;