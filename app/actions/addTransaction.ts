'use server';
import {auth} from "@clerk/nextjs/server";
import {db} from "@/lib/db";
import {revalidatePath} from "next/cache";

interface TransactionData {
    text: string,
    amount: number,
}

interface TransactionResult {
    data?: TransactionData;
    error?: String;
}

async function addTransaction(formData: FormData): Promise<TransactionResult> {
    const textValue = formData.get('text');
    const amountValue = formData.get('amount');

    // check for input values
    if (!textValue || textValue === '' || amountValue === '') {
        return {
            error: 'Text or amount is missing',
        };
    }

    // Get logged in user
    const {userId} = auth();

    // check for user
    if (!userId) {
        return {error: 'User not found'};
    }

    const text: string = textValue.toString(); // ensure text is a string
    // @ts-ignore
    const amount: number = parseFloat(amountValue.toString()); // parse amount as number

    try {
        // @ts-ignore
        const transactionData: TransactionResult = await db.transaction.create({
            data: {
                text,
                amount,
                userId
            }
        });

        revalidatePath('/');

        return {data: transactionData};
    } catch (error) {
        return {error: "Transaction not added"};
    }

}

export default addTransaction;
