import { login } from './actions'

export default function LoginPage() {
    return (
       <div>
           <form>
               <label htmlFor="email">Email:</label>
               <input id="email" name="email" type="email" required />
               <label htmlFor="password">Password:</label>
               <input id="password" name="password" type="password" required />
               <button formAction={login}>Log in</button>
           </form>
           <p>Don't have an account? <a href="/register">Sign up</a></p>
       </div>
    )
}