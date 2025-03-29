import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
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
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        console.error('GetMe error:', error);
        
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { message: "Invalid token" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { message: "An error occurred while getting user information" },
            { status: 500 }
        );
    }
}