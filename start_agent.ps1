# Professional Agent Setup for Algoscope
# This script configures your environment to use Claude Code with local Ollama models.

Write-Host "--- Algoscope Agent Setup ---" -ForegroundColor Cyan

# 1. Environment Configuration
$env:ANTHROPIC_BASE_URL="http://localhost:11434/v1"
$env:ANTHROPIC_AUTH_TOKEN="ollama"
$env:ANTHROPIC_API_KEY="not-needed-for-ollama"

Write-Host "[✓] Environment variables set for Ollama." -ForegroundColor Green

# 2. Model Recommendations (based on your 16GB RAM)
Write-Host "`nRecommended models for your setup:" -ForegroundColor Yellow
Write-Host " - qwen2.5-coder:7b     (Fast, excellent balance)"
Write-Host " - deepseek-coder-v2:16b (Powerful, slower)"
Write-Host " - deepseek-coder:6.7b  (Already installed)"

# 3. Quick Pull (Optional)
# Uncomment the line below if you want this script to pull the best model automatically
# Write-Host "`nPulling qwen2.5-coder:7b..." -ForegroundColor Gray
# ollama pull qwen2.5-coder:7b

# 4. Launch Claude Code
Write-Host "`nLaunching Claude agent..." -ForegroundColor Cyan
Write-Host "Type 'claude --model <model_name>' if it doesn't start automatically."
claude --model deepseek-coder:6.7b
