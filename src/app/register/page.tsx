import { signup } from './actions'

export default function RegisterPage() {
    return (
        <div>
            <form action={signup}>
                <label htmlFor="name">Name:</label>
                <input id="name" name="name" type="name" required />
                <label htmlFor="email">Email:</label>
                <input id="email" name="email" type="email" required />
                <label htmlFor="password">Password:</label>
                <input id="password" name="password" type="password" required />
                <button >Sign up</button>
            </form>
            <p>Already have an account? <a href="/login">Log in</a></p>
        </div>


    )
}