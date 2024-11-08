import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { Button } from "~/components/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/card"
import { Input, Password } from "~/components/input"
import { Label } from "~/components/label"

export function Login() {
	return (
		<div tw="animate-enter px-3 sm:container min-h-screen grid items-center">
			<LoginForm />
		</div>
	)
}

interface FormData {
	username: string
	password: string
}

export function LoginForm() {
	const { register, handleSubmit } = useForm<FormData>()
	const navigate = useNavigate()
	return (
		<form
			onSubmit={handleSubmit(_data => {
				navigate("/")
			})}
		>
			<Card tw="mx-auto w-full max-w-[350px]">
				<CardHeader>
					<CardTitle>Login</CardTitle>
				</CardHeader>
				<CardContent>
					<div tw="grid w-full items-center gap-4 caret-primary">
						<div tw="grid gap-y-1.5">
							<Label>Username</Label>
							<Input {...register("username")} />
						</div>
						<div tw="grid gap-y-1.5">
							<Label>Password</Label>
							<Password {...register("password")} />
						</div>
					</div>
				</CardContent>
				<CardFooter>
					<Button type="submit" tw="w-full">
						Login
					</Button>
				</CardFooter>
			</Card>
		</form>
	)
}
