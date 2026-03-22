import os
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import stripe

app = FastAPI(title="Plainwork Stripe Server")

# Enable CORS for the frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict this to "https://sonsoftheland.com" in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Securely pull the Stripe key from env
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

class CheckoutRequest(BaseModel):
    kit_type: str # 'vibe', 'designer', 'master', 'deposit'
    price: int    # 12, 19, 29, 188
    
@app.post("/api/create-checkout-session")
async def create_checkout_session(req: CheckoutRequest):
    try:
        # Define the product details based on the PMOS "Whack" Architecture
        products = {
            "vibe": {
                "name": "The Vibe Kit (4 Custom Tones)",
                "description": "Specify your colour family in the order notes.",
                "amount": 1200 # Stripe uses cents (S$12.00)
            },
            "designer": {
                "name": "The Designer's Deck (12 Bestsellers)",
                "description": "12 of our safest, most requested architectural hits.",
                "amount": 1900 # S$19.00
            },
            "master": {
                "name": "The Master Studio (52 Tones)",
                "description": "The full mineral spectrum library.",
                "amount": 2900 # S$29.00
            },
            "deposit": {
                "name": "Site Assessment Deposit",
                "description": "Reserves your installation slot and covers the physical site assessment.",
                "amount": 18800 # S$188.00
            }
        }
        
        selected_product = products.get(req.kit_type)
        if not selected_product:
            raise HTTPException(status_code=400, detail="Invalid product selected")

        # Create Stripe Checkout Session
        session = stripe.checkout.Session.create(
            payment_method_types=['card', 'paynow', 'grabpay'],
            line_items=[{
                'price_data': {
                    'currency': 'sgd',
                    'product_data': {
                        'name': selected_product['name'],
                        'description': selected_product['description'],
                    },
                    'unit_amount': selected_product['amount'],
                },
                'quantity': 1,
            }],
            mode='payment',
            payment_intent_data={
                "statement_descriptor": "ORIGINAL*PLAINWORK"
            },
            # Change these URLs to your live domain
            success_url="https://sonsoftheland.com/success.html",
            cancel_url="https://sonsoftheland.com/",
            shipping_address_collection={"allowed_countries": ["SG"]} if req.kit_type != 'deposit' else None,
        )

        return {"checkout_url": session.url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
