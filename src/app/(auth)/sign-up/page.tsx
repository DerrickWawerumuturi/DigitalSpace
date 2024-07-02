"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { ArrowRight, Icon, Import } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AuthCredentialsValidator, TAuthCredentialsValidator } from "@/lib/Validators/account-credentials-validator";
import { trpc } from "@/trpc/client";
import { toast } from 'sonner';
import { ZodError } from "zod";
import { useReducer } from "react";
import { useRouter } from "next/navigation";

const Page = () => {

    const { register, handleSubmit, formState: { errors } } = useForm<TAuthCredentialsValidator>({
        resolver: zodResolver(AuthCredentialsValidator)
    })

    const router = useRouter()

    const { mutate, isLoading } = trpc.auth.createPayloadUser.useMutation({
        onError: (err) => {
            if (err.data?.code === 'CONFLICT') {
                toast.error('This email already exist.Sign in instead?')

                return
            }



            if (err instanceof ZodError) {
                toast.error(err.issues[0].message)

                return
            }


            toast.error('Something went wrong. Please try again')
        },
        onSuccess: ({ sentToEmail }) => {
            toast.success(`Verification email sent to ${sentToEmail}`)
            router.push('/verify-email?to=' + sentToEmail)
        }
    })

    const onSubmit = ({ email, password }: TAuthCredentialsValidator) => {
        mutate({ email, password })
    }

    return <>
        <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col items-center space-y-2 text-center">
                    <Image
                        src="/digitalSpace.png"
                        alt="icon"
                        width={80}
                        height={80}
                        className="rounded-full"
                    />
                    <h1 className="text-2xl font-bold">
                        Create an account
                    </h1>

                    <Link href="/sign-in" className={buttonVariants({
                        variant: "link",
                        className: "text-blue-700 gap-1.5"

                    })}>
                        Already have an account? Sign in
                        <ArrowRight className="h-4 w-4"></ArrowRight>
                    </Link>
                </div>
                <div className="grid gap-6">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-3">
                            <div className="grid gap-1 py-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    {...register("email")}
                                    className={cn(
                                        {
                                            "focus-visible:ring-red-500": errors.email
                                        }
                                    )} placeholder="you@example.com" />
                                {errors?.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                            </div>
                            <div className="grid gap-3">
                                <div className="grid gap-1 py-2">
                                    <Label htmlFor="paasword">Password</Label>
                                    <Input
                                        {...register("password")}
                                        type="password"
                                        className={cn(
                                            {
                                                "focus-visible:ring-red-500": errors.password
                                            }
                                        )} placeholder="Password" />
                                    {errors?.password && <p className="text-sm text-red-500">{errors.password.message}</p>}

                                </div>
                                <Button>Sign Up</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>

}

export default Page;