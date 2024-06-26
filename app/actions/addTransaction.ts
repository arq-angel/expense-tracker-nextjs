'use server';
import {auth} from "@clerk/nextjs/server";
import {db} from "@/lib/db";
import {revalidatePath} from "next/cache";

interface TransactionData {
    text: string;
    amount: number;
    userId: string;
}

interface TransactionResult {
    data?: TransactionData;
    error?: string;
}

async function addTransaction(formData: FormData): Promise<TransactionResult> {
    const textValue = formData.get('text');
    const amountValue = formData.get('amount');

    // Check for input values
    if (!textValue || textValue === '' || amountValue === '') {
        return {
            error: 'Text or amount is missing',
        };
    }

    // Get logged in user
    const {userId} = auth();

    // Check for user
    if (!userId) {
        return {error: 'User not found'};
    }

    const text: string = textValue.toString(); // Ensure text is a string
    const amount: number = parseFloat((amountValue ?? '').toString()); // Parse amount as number

    try {
        // Explicitly define the type of transactionData to match TransactionData
        const transactionData: TransactionData = await db.transaction.create({
            data: {
                text,
                amount,
                userId
            }
        });

        revalidatePath('/');

        // Correctly return the data structure
        return {data: transactionData};
    } catch (error) {
        return {error: "Transaction not added"};
    }
}

export default addTransaction;
