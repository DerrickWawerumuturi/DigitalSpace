"use client"

import { useAuth } from "@/hooks/use-auth";
import { Button, buttonVariants } from "./ui/button";


const LogOut = () => {
    const { signOut } = useAuth()
    return (
        <Button
            className={buttonVariants({ variant: "red" })}
            onClick={signOut}
        >
            Log Out
        </Button>
    )

}

export default LogOut
