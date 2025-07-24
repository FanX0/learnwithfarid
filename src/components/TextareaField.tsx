import { UseFormRegisterReturn } from 'react-hook-form'

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string
    error?: string
    registration?: UseFormRegisterReturn
}

export function TextareaField({ id, label, error, registration, ...rest }: TextareaFieldProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <textarea
                id={id}
                {...rest}
                {...registration}
                className={`mt-1 block w-full border rounded p-2 ${error ? 'border-red-500' : 'border-gray-300'}`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    )
}
