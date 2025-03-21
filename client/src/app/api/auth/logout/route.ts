import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const response = NextResponse.json(
            { message: "Logged out successfully" },
            { status: 200 }
        );

        response.cookies.set('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(0)
        });

        return response;

    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { message: "An error occurred during logout" },
            { status: 500 }
        );
    }
}