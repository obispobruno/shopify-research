from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import random
from dateutil.relativedelta import relativedelta
from typing import List, Optional

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def generate_mock_data(product_id: str, months: int) -> List[dict]:
    data = []
    base_value = random.randint(100, 1000)
    trend = random.uniform(0.98, 1.02)  # Slight trend up or down
    seasonality = [1.2, 1.1, 0.9, 0.8, 0.9, 1.0, 1.1, 1.2, 1.1, 0.9, 0.8, 0.9]  # Monthly seasonality

    start_date = datetime.now() - relativedelta(months=months)

    for i in range(months * 30):  # Daily data
        current_date = start_date + timedelta(days=i)
        month_index = current_date.month - 1

        # Calculate the base value with trend
        current_base = base_value * (trend ** (i / 30))

        # Apply seasonality
        seasonal_value = current_base * seasonality[month_index]

        # Add random noise
        actual = max(0, seasonal_value * random.uniform(0.9, 1.1))

        # For future dates, create forecast with confidence intervals
        is_future = current_date > datetime.now()
        if is_future:
            forecast = seasonal_value
            lower = forecast * 0.8
            upper = forecast * 1.2
            actual = None
        else:
            forecast = None
            lower = None
            upper = None

        data.append({
            "date": current_date.strftime("%Y-%m-%d"),
            "actual": round(actual, 2) if actual is not None else None,
            "forecast": round(forecast, 2) if forecast is not None else None,
            "lower": round(lower, 2) if lower is not None else None,
            "upper": round(upper, 2) if upper is not None else None
        })

    return data

@app.get("/api/forecast/{product_id}")
async def get_forecast(
    product_id: str,
    months: Optional[int] = Query(default=3, ge=1, le=12)
):
    data = generate_mock_data(product_id, months)
    return {
        "product_id": product_id,
        "forecast_period_months": months,
        "data": data
    }

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

