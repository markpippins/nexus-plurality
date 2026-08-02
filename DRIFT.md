# DRIFT.md — plurality-ui Client vs Backend API Mismatches

**Date:** 2026-07-23
**Compared:** `src/services/RealBackendService.ts` + `src/types.ts` ↔ unknown backend (no dedicated `plurality-srv` found)
**Status:** 1 critical, 1 medium

---

## Critical

### C1 — No Dedicated Backend Service Found

Plurality-ui's `RealBackendService` targets `http://localhost:8000` — a **generic port** not matching any dedicated backend service in the `nexus/typescript/` tree. The available backends use ports 3100–3400+ and 8100. Port 8000 is often reserved for development proxies or unrelated services.

| Client Base URL | Expected Service | Found? |
|---|---|---|
| `http://localhost:8000` | `plurality-srv` or equivalent | ❌ Not in `nexus/typescript/` |

**Confirmed (2026-07-23):** Port `8000` has **no process listening**. The `RealBackendService` will always fail to connect. The client defaults to mock mode (`SimulatedBackendService`), which is the only working path.

**Remediation:** Options:
1. Create a `plurality-srv` REST backend mounted on a documented port (e.g., 3112)
2. Point `RealBackendService` at an existing service (e.g., conduit-mcp on 3100 or nebula-srv on 8100)
3. Document that plurality-ui is mock-only and remove the live backend option

---

## Medium

### M1 — Status Mapping Drift

The client maps backend status values to internal status values via `statusMap`:

| Backend (`WorkRequestResponse.status`) | Client (`WorkRequest.status`) |
|---|---|
| `NEW` | `NEW` ✅ |
| `PLANNING` | `PLAN` ❌ (truncated) |
| `REVIEW` | `REVIEW` ✅ |
| `APPROVAL` | `APPROVAL` ✅ |
| `SPEC` | `SPEC` ✅ |
| `EXECUTING` | `EXEC` ❌ (truncated) |
| `VALIDATING` | `VALIDATE` ❌ (truncated) |
| `COMPLETE` | Not mapped — would fall through to default ❌ |

**Impact:** If the backend returns statuses with different naming conventions than the client map expects, the status display may show incorrect or default values. The truncation of `PLANNING`→`PLAN` and `EXECUTING`→`EXEC` loses server-side nuance.

**Remediation:** Either align the client `AppState` type to use full backend status names, or document the mapping explicitly in both directions.

---

## Response Shape Drifts

### `POST /work-requests/` — Create Work Request

| Field | Client (`WorkRequestCreate`) | Backend (unknown) |
|---|---|---|
| `intent` | string (required) | Unknown |
| `constraints` | Object (optional) | Unknown |
| `priority` | number (optional) | Unknown |
| `context` | Object (optional) | Unknown |

**No backend to compare against** — response shape unknown.

### `GET /work-requests/{dbId}` — Get Work Request

| Field | Client (`WorkRequestResponse`) | Verdict |
|---|---|---|
| `id` | number (dbId) | Unknown — likely UUID |
| `wr_id` | string | Unknown |
| `intent` | string | Unknown |
| `status` | string | Unknown |
| `created_at` / `updated_at` | string (ISO) | Unknown |
| `constraints` / `priority` / `context` | optional | Unknown |

---

## Summary

| Priority | Area | Actions |
|---|---|---|
| **Critical** | No backend found | Create or identify the target backend service for port 8000 |
| **Medium** | Status mapping drift | Align `AppState` with actual backend status values |
| **Low** | Response shapes | Can't verify until backend is identified |
