import { auth, currentUser } from '@clerk/nextjs/server';
import crypto from 'crypto';
import { NextRequest } from 'next/server';
import PRODUCTS from './blvck-spades-products.json';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams ?? new URLSearchParams();
    const wonTricksValue = searchParams.get('wonTricks') ?? '0'; 
    const wonTricks = isNaN(parseInt(wonTricksValue)) ? 0 : parseInt(wonTricksValue);
    
    const user = await currentUser();
    const subscriberEmail = user?.emailAddresses[0].emailAddress;
    const subscriberHash = crypto.createHash('md5').end(subscriberEmail).digest('hex');
    const listId = 'fcb096428a';

    const randomProduct = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];

    try {
        const res = await fetch(`https://us20.api.mailchimp.com/3.0/lists/${listId}/members/${subscriberHash}?skip_merge_validation=true`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Basic ${Buffer.from(`anystring:${process.env.MAILCHIMP_API_KEY}`).toString('base64')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email_address: subscriberEmail,
                status: "subscribed",
                merge_fields: {
                    PLAYD_SPDS: 1,
                    DISC_PCT: `${10 * wonTricks}%`,
                    PRIZE_LINK: randomProduct.permalink,
                }
            }),
        });

        const json = await res.json();
        return Response.json(json);
    } catch (error) {
        console.log('An error has occurred:', error);
        return Response.json({ error })
    }
}