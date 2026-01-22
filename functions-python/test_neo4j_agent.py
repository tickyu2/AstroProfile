"""
Quick test script for Neo4j Agent connection
Run: python test_neo4j_agent.py
"""

import os
import base64
import requests
from dotenv import load_dotenv

# Load .env file
load_dotenv()

def test_auth_methods():
    """Test different authentication methods"""
    agent_url = os.environ.get("NEO4J_AGENT_URL")
    client_id = os.environ.get("NEO4J_CLIENT_ID")
    client_secret = os.environ.get("NEO4J_CLIENT_SECRET")

    print("Testing Neo4j Agent Authentication Methods...")
    print("-" * 60)
    print(f"Agent URL: {agent_url[:60]}..." if agent_url else "NOT SET")
    print(f"Client ID: {client_id}" if client_id else "NOT SET")
    print("-" * 60)

    payload = {"message": "Hello", "context": {}}

    # Method 1: Bearer with client_secret
    print("\n1. Bearer token with client_secret:")
    try:
        r = requests.post(agent_url, headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {client_secret}"
        }, json=payload, timeout=15)
        print(f"   Status: {r.status_code}")
        print(f"   Response: {r.text[:200]}" if r.text else "   (empty)")
    except Exception as e:
        print(f"   Error: {e}")

    # Method 2: Basic auth with client_id:client_secret
    print("\n2. Basic auth (client_id:client_secret):")
    try:
        basic = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
        r = requests.post(agent_url, headers={
            "Content-Type": "application/json",
            "Authorization": f"Basic {basic}"
        }, json=payload, timeout=15)
        print(f"   Status: {r.status_code}")
        print(f"   Response: {r.text[:200]}" if r.text else "   (empty)")
    except Exception as e:
        print(f"   Error: {e}")

    # Method 3: No auth (check if endpoint is open)
    print("\n3. No authentication:")
    try:
        r = requests.post(agent_url, headers={
            "Content-Type": "application/json"
        }, json=payload, timeout=15)
        print(f"   Status: {r.status_code}")
        print(f"   Response: {r.text[:200]}" if r.text else "   (empty)")
    except Exception as e:
        print(f"   Error: {e}")

    # Method 4: X-API-Key header
    print("\n4. X-API-Key header with client_secret:")
    try:
        r = requests.post(agent_url, headers={
            "Content-Type": "application/json",
            "X-API-Key": client_secret
        }, json=payload, timeout=15)
        print(f"   Status: {r.status_code}")
        print(f"   Response: {r.text[:200]}" if r.text else "   (empty)")
    except Exception as e:
        print(f"   Error: {e}")

    print("\n" + "-" * 60)
    print("If all methods return 401, the agent External access may not be enabled.")
    print("Try testing the agent in the Neo4j Aura console chat first.")

if __name__ == "__main__":
    test_auth_methods()
