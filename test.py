import requests
import json

# --- CONFIGURATION ---
# Your Supabase URL
SUPABASE_URL = "https://dkpdimzmzfebebhyfesx.supabase.co"

# Your LONG Key (JWT) - Required for the 'Authorization' header
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrcGRpbXptemZlYmViaHlmZXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NTgwMzIsImV4cCI6MjA3NzMzNDAzMn0.OunPAODre0MixyscOVuuewok-BcwYfeC6DAVp7By1Y0"

# The table you want to test.
# CHANGE THIS if you don't have a 'users' table (try 'todos', 'posts', etc.)
TABLE_NAME = "events" 

def test_supabase_connection():
    print(f"Testing connection to: {SUPABASE_URL}")
    print(f"Target Table: {TABLE_NAME}\n")

    # The standard Supabase REST API endpoint
    endpoint = f"{SUPABASE_URL}/rest/v1/{TABLE_NAME}?select=*"

    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.get(endpoint, headers=headers)

        # --- HANDLE RESPONSES ---
        
        # 200 OK: Connection successful and data found
        if response.status_code == 200:
            data = response.json()
            print("✅ SUCCESS! Connection established.")
            print(f"Found {len(data)} rows in '{TABLE_NAME}'.")
            # Print first 2 items as a sample
            print(json.dumps(data[:2], indent=2))

        # 404 Not Found: Connected, but table does not exist
        elif response.status_code == 404:
            print("⚠️  CONNECTED, BUT TABLE NOT FOUND.")
            print(f"The table '{TABLE_NAME}' does not exist in your database.")
            print("Try changing the TABLE_NAME variable in the script.")

        # 401 Unauthorized: Key is wrong or RLS is blocking
        elif response.status_code == 401:
            print("❌ AUTHENTICATION FAILED (401).")
            print("Your key might be invalid, or you don't have permission to view this table.")
            print("Server message:", response.text)

        # Other errors
        else:
            print(f"❌ Error {response.status_code}: {response.text}")

    except Exception as e:
        print(f"❌ CRITICAL ERROR: {str(e)}")

if __name__ == "__main__":
    test_supabase_connection()