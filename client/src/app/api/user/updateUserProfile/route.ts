import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function PUT(req: NextRequest) {
    try {
        await connect();

        const token = req.cookies.get('jwt')?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized - No token provided" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        const body = await req.json();
        const { username } = body;

        if (!username) {
            return NextResponse.json(
                { message: "Username is required" },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ 
            username,
            _id: { $ne: decoded.userId }
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "Username is already taken" },
                { status: 409 }
            );
        }

        const updatedUser = await User.findByIdAndUpdate(
            decoded.userId,
            { username },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Profile updated successfully",
            user: {
                _id: updatedUser._id,
                username: updatedUser.username,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt
            }
        });

    } catch (error) {
        console.error('UpdateUserProfile error:', error);

        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { message: "Invalid token" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { message: "An error occurred while updating profile" },
            { status: 500 }
        );
    }
}