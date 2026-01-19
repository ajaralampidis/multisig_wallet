#!/usr/bin/env bash

set -euo pipefail

echo "=== Multisig Wallet Setup Script ==="
echo "This script will:"
echo "  1. Ask for network (anvil/sepolia/etc). Keystore account name will be multisig_<network>"
echo "  2. Run 'cast wallet import' interactively (paste your private key here)"
echo "  3. Ask for password and save it to .env.local as PASS_MULTISIG_<network>"
echo "  4. Fetch address and save it as ADDRESS_MULTISIG_<network>"
echo ""
echo "Your private key is NEVER stored or logged by this script."
echo "Only password and address go into .env.local (git-ignored)."
echo ""

# ──────────────────────────────────────────────────────
# Step 1: Network Selection
# ──────────────────────────────────────────────────────

echo "Step 1: Select network"
read -p "Network name: " NETWORK_NAME_RAW

NETWORK_NAME=$(echo "$NETWORK_NAME_RAW" | tr '[:lower:]' '[:upper:]' | tr -d ' -_')

if [[ -z "$NETWORK_NAME" ]]; then
  NETWORK_NAME="ANVIL"
  echo "No network entered → defaulting to ANVIL"
fi

ENV_KEY_PASS="PASS_MULTISIG_${NETWORK_NAME}"
ENV_KEY_ADDR="ADDRESS_MULTISIG_${NETWORK_NAME}"

echo "Using env vars:"
echo "  $ENV_KEY_PASS=..."
echo "  $ENV_KEY_ADDR=..."


# ──────────────────────────────────────────────────────
# Step 2: Interactive import — user pastes key directly
# ──────────────────────────────────────────────────────

KEYSTORE_NAME="multisig_${NETWORK_NAME,,}"

echo ""
echo "Step 2: Interactive import"
echo "Your keystore account name will be: $KEYSTORE_NAME"
echo "Now paste your private key when prompted and set a password."
echo "cast wallet import "$KEYSTORE_NAME" --interactive"
echo "Press Enter to continue..."
read -r

# Run cast import interactively — no piping, no history pollution
cast wallet import "$KEYSTORE_NAME" --interactive

echo ""
echo "Import complete. Press Enter to continue..."
read -r

# ──────────────────────────────────────────────────────
# Step 3: Get password (hidden input)
# ──────────────────────────────────────────────────────

echo ""
echo "Step 3: Enter the password you just set for '$KEYSTORE_NAME'"
read -s -p "Password: " PASSWORD

# ──────────────────────────────────────────────────────
# Step 4: Fetch address
# ──────────────────────────────────────────────────────

echo "Fetching address..."
ADDRESS=$(cast wallet address --account "$KEYSTORE_NAME" 2>/dev/null || echo "")

if [[ -z "$ADDRESS" ]]; then
  echo "Error: Could not fetch address. Check keystore name."
  exit 1
fi

echo "Address: $ADDRESS"

# ──────────────────────────────────────────────────────
# Step 5: Save to .env.local
# ──────────────────────────────────────────────────────

ENV_FILE=".env.local"

# Remove old lines if they exist
sed -i "/^$ENV_KEY_PASS=/d" "$ENV_FILE" 2>/dev/null || true
sed -i "/^$ENV_KEY_ADDR=/d" "$ENV_FILE" 2>/dev/null || true

# Append new values
echo "$ENV_KEY_PASS=$PASSWORD" >> "$ENV_FILE"
echo "$ENV_KEY_ADDR=$ADDRESS" >> "$ENV_FILE"

echo ""
echo "Saved:"
echo "  $ENV_KEY_PASS=*** (hidden)"
echo "  $ENV_KEY_ADDR=$ADDRESS"
echo ""
echo "To deploy, use:"
echo "forge script ... --account ${KEYSTORE_NAME,,} --sender \$ADDRESS_MULTISIG_${NETWORK_NAME} --password \$PASS_MULTISIG_${NETWORK_NAME} ..."
echo ""
echo "Done! Remember: .env.local is git-ignored."