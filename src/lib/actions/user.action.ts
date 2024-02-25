"use server"

import { connect } from "http2";
import User from "../database/model/user.model"
import { connectToDatabase } from "../database/mongoose"
import { handleError } from "../utils";
import { revalidatePath } from "next/cache";



//Create User
export async function createUser(user : CreateUserParams) {
try {
    await connectToDatabase();

    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
} catch (error) {
    handleError(error)
}
}


//Get User
export async function getUserByID(userId : string) {
    try {
        await connectToDatabase();
        const user = await User.findOne({clerkId : userId})

        if(!user) throw new Error('User not found');

        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        handleError(error)
    }
}

//Update User
export async function updateUser(clerkId:string, user : UpdateUserParams) {
    try {
        await connectToDatabase();

        const updateUser = await User.findOneAndUpdate({clerkId}, user, {
            new :true,
        })

        return JSON.parse(JSON.stringify(updateUser))
    } catch (error) {
        handleError(error)
    }
}
//Delete
export async function deleteUser(clerkId:string) {
    try {
        await connectToDatabase();

        const userToDelete = await User.findOne({clerkId});

        if(!userToDelete) {
            throw new Error('User not found');
        }

        // Delete user

        const deleteUser = await User.findByIdAndDelete(userToDelete._id);
        revalidatePath('/');

        return deleteUser ? JSON.parse(JSON.stringify(deleteUser)) : null;
    } catch (error) {
        handleError(error);
    }
}


// Use Credits

export async function updateCredits(userId:string, creditFee: number) {
    try {
        await connectToDatabase();

        const updateUserCredits = await User.findOneAndUpdate(
            {_id: userId},
            {$inc: {creditBalance: creditFee}},
            {new :true}
        )

        if(!updateUserCredits) throw new Error("User credits update failed")

        return JSON.parse(JSON.stringify(updateUserCredits))
    } catch (error) {
        handleError(error);
    }
}

