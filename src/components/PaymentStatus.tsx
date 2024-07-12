"use client"

import { useCart } from "@/hooks/use-cart"
import { trpc } from "@/trpc/client"
import { useRouter } from "next/navigation"

import { useEffect } from "react"

interface PaymentStatusProps {
    orderEmail: string
    orderId: string
    isPaid: boolean
    purchasedItemIds: string[]
}

const PaymentStatus = ({ orderEmail, orderId, isPaid, purchasedItemIds }: PaymentStatusProps) => {

    const { data } = trpc.payment.pollOrderStatus.useQuery({ orderId }, {
        enabled: isPaid === false,
        refetchInterval: (data) => (data?.isPaid ? false : 1000)
    })
    const router = useRouter()
    const { removeItem } = useCart()

    useEffect(() => {
        if (data?.isPaid) {
            purchasedItemIds.forEach((itemId) => {
                removeItem(itemId)
            })
            router.refresh()
        }
    }, [data?.isPaid, router, removeItem, purchasedItemIds])
    return (
        <div className="mt-16 grid grid-cols-2 text-sm text-gray-600">
            <div >
                <p className="font-medium text-gray-900">Shipping To</p>
                <p>{orderEmail}</p>
            </div>
            <div>
                <p className="font-medium text-gray-900">Order Status</p>
                <p>
                    {
                        isPaid
                            ? 'Payment successful'
                            : 'Pending Payment'
                    }
                </p>
            </div>
        </div>
    )
}

export default PaymentStatus