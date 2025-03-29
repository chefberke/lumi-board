import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
    try {
        await connect();
        
        const body = await req.json();
        const { username, email, password } = body;
    
        if (!username || !email || !password) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }
    
        const existingUser = await User.findOne({ username });
        const existingEmail = await User.findOne({ email });
        
        if (existingUser || existingEmail) {
            return NextResponse.json(
                { message: "User with this username or email already exists" },
                { status: 409 }
            );
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });
    
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET!, {
            expiresIn: "7d",
        });
    
        const response = NextResponse.json(
            {
                message: "User created successfully",
                user: {
                    _id: newUser._id,
                    username: newUser.username,
                    email: newUser.email
                }
            },
            { status: 201 }
        );
    
        response.cookies.set('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 // 7 days
        });
    
        return response;
    
    } catch (error) {
        console.error('Sign-up error:', error);
        return NextResponse.json(
            { message: "An error occurred during sign up" },
            { status: 500 }
        );
    }
}