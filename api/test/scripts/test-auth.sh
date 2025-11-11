#!/bin/bash

# Script de teste da API de Autenticação

echo "🧪 Testando API de Autenticação - ESOrbit"
echo "=========================================="
echo ""

BASE_URL="http://localhost:4000/api"

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Registrar usuário
echo -e "${BLUE}1. Registrando novo usuário...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "senha123",
    "username": "Usuário Teste"
  }')

echo "$REGISTER_RESPONSE" | jq '.'

# Extrair access token
ACCESS_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.accessToken')

if [ "$ACCESS_TOKEN" != "null" ] && [ -n "$ACCESS_TOKEN" ]; then
  echo -e "${GREEN}✓ Registro bem-sucedido!${NC}"
else
  echo -e "${RED}✗ Erro no registro${NC}"
  exit 1
fi

echo ""

# 2. Testar /me com token
echo -e "${BLUE}2. Testando GET /auth/me com token...${NC}"
ME_RESPONSE=$(curl -s -X GET "${BASE_URL}/auth/me" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

echo "$ME_RESPONSE" | jq '.'

if echo "$ME_RESPONSE" | jq -e '.user' > /dev/null; then
  echo -e "${GREEN}✓ Autenticação com access token funcionando!${NC}"
else
  echo -e "${RED}✗ Erro na autenticação${NC}"
fi

echo ""

# 3. Fazer login
echo -e "${BLUE}3. Fazendo login...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "senha123"
  }')

echo "$LOGIN_RESPONSE" | jq '.'

NEW_ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.accessToken')

if [ "$NEW_ACCESS_TOKEN" != "null" ] && [ -n "$NEW_ACCESS_TOKEN" ]; then
  echo -e "${GREEN}✓ Login bem-sucedido!${NC}"
  ACCESS_TOKEN="$NEW_ACCESS_TOKEN"
else
  echo -e "${RED}✗ Erro no login${NC}"
fi

echo ""

# 4. Testar refresh token
echo -e "${BLUE}4. Testando refresh token (com cookie)...${NC}"
REFRESH_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/refresh" \
  -b cookies.txt \
  -c cookies.txt)

echo "$REFRESH_RESPONSE" | jq '.'

NEW_ACCESS_TOKEN=$(echo "$REFRESH_RESPONSE" | jq -r '.accessToken')

if [ "$NEW_ACCESS_TOKEN" != "null" ] && [ -n "$NEW_ACCESS_TOKEN" ]; then
  echo -e "${GREEN}✓ Refresh token funcionando!${NC}"
  ACCESS_TOKEN="$NEW_ACCESS_TOKEN"
else
  echo -e "${RED}✗ Erro no refresh${NC}"
fi

echo ""

# 5. Testar /me novamente com novo token
echo -e "${BLUE}5. Testando /me com novo access token...${NC}"
ME_RESPONSE=$(curl -s -X GET "${BASE_URL}/auth/me" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

echo "$ME_RESPONSE" | jq '.'

if echo "$ME_RESPONSE" | jq -e '.user' > /dev/null; then
  echo -e "${GREEN}✓ Novo token funcionando!${NC}"
else
  echo -e "${RED}✗ Erro com novo token${NC}"
fi

echo ""

# 6. Fazer logout
echo -e "${BLUE}6. Fazendo logout...${NC}"
LOGOUT_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/logout" \
  -b cookies.txt)

echo "$LOGOUT_RESPONSE" | jq '.'

if echo "$LOGOUT_RESPONSE" | jq -e '.ok' > /dev/null; then
  echo -e "${GREEN}✓ Logout bem-sucedido!${NC}"
else
  echo -e "${RED}✗ Erro no logout${NC}"
fi

echo ""

# 7. Tentar refresh após logout (deve falhar)
echo -e "${BLUE}7. Tentando refresh após logout (deve falhar)...${NC}"
REFRESH_AFTER_LOGOUT=$(curl -s -X POST "${BASE_URL}/auth/refresh" \
  -b cookies.txt)

echo "$REFRESH_AFTER_LOGOUT" | jq '.'

if echo "$REFRESH_AFTER_LOGOUT" | jq -e '.statusCode' > /dev/null; then
  echo -e "${GREEN}✓ Refresh bloqueado após logout (comportamento esperado)${NC}"
else
  echo -e "${RED}✗ Refresh não deveria funcionar após logout${NC}"
fi

echo ""
echo -e "${GREEN}=========================================="
echo "✅ Todos os testes concluídos!"
echo -e "==========================================${NC}"

# Limpar arquivo de cookies
rm -f cookies.txt
