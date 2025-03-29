import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/lib/db';
import User from '@/models/User';

export async function GET(req: NextRequest) {
    try {
        await connect();
        const username = req.nextUrl.searchParams.get('username');

        if (!username) {
            return NextResponse.json(
                { message: "Username is required" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ username }).select('-password');

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            user: {
                _id: user._id,
                username: user.username,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        console.error('GetUserProfile error:', error);
        return NextResponse.json(
            { message: "An error occurred while fetching user profile" },
            { status: 500 }
        );
    }
}