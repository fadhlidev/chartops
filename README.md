# ChartOps

AI-powered chart operations platform.

## What It Does

ChartOps provides intelligent chart operations through four core capabilities:

### 1. Suggest
Analyzes your data and recommends the most effective chart types for visualization. Simply provide your dataset, and it suggests the top chart types with explanations for each recommendation.

### 2. Extract
Reverse-engineers existing chart configurations to extract the underlying data. Perfect for recovering data from charts or migrating between charting libraries.

### 3. Generate
Generates production-ready chart configurations from your data and preferred chart type. Just specify your data, chart type, and optional styling—get a complete, properly configured chart ready to use.

### 4. Insight
Analyzes any chart configuration and produces human-readable business insights. Understand the story behind your data without manually interpreting complex charts.

## Quick Start

```bash
# Backend
cd backend && bun dev

# Frontend
cd frontend && bun dev
```

## API

Access all four operations via REST API at `/api/v1/ai`. OpenAPI documentation available at `/swagger` when running locally.