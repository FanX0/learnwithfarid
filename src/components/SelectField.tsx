import { UseFormRegisterReturn } from 'react-hook-form'

type Option = {
    value: string | number
    label: string
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    id: string
    label: string
    options: Option[]
    error?: string
    registration?: UseFormRegisterReturn
}

export function SelectField({
                                id,
                                label,
                                options,
                                error,
                                registration,
                                ...rest
                            }: SelectFieldProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <select
                id={id}
                {...rest}
                {...registration}
                className={`mt-1 block w-full border rounded p-2 ${
                    error ? 'border-red-500' : 'border-gray-300'
                }`}
            >
                <option value="">-- Pilih kategori --</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    )
}
