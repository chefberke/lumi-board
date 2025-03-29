import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
    try {
        await connect();
        
        const body = await req.json();
        const { email, password } = body;
    
        if (!email || !password) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }
    
        const user = await User.findOne({ email });
    
        if (!user) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
    
        if (!isPasswordValid) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }
    
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
            expiresIn: "7d",
        });
    
        const response = NextResponse.json(
            {
                message: "Logged in successfully",
                user: {
                    _id: user._id,
                    email: user.email,
                }
            },
            { status: 200 }
        );
    
        response.cookies.set("jwt", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    
        return response;
    } catch (error) {
        console.error("Error in signIn:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
