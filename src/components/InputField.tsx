import { UseFormRegisterReturn } from 'react-hook-form'

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
    registration?: UseFormRegisterReturn
}

export const InputField = ({ id, label, error, registration, ...rest }: InputFieldProps) => {
    return (
        <div>
            <label htmlFor={id} className="block font-medium">
                {label}
            </label>
            <input
                id={id}
                {...rest}
                {...registration}
                className={`w-full border p-2 rounded ${error ? 'border-red-500' : 'border-gray-300'}`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    )
}
