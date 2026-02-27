# Phase 1: Theme Configuration (Archived)

> This feature was implemented and later removed in v1.2.0. This document is retained for historical reference.

## What Was Built

A theme customization system that allowed admins to set per-exam visual styles through a JSONB column in PostgreSQL.

### Database

Added `theme_config` JSONB column to the `exams` table. Migration handled by Alembic (`add_theme_config.py`).

### API

A `ThemeConfig` Pydantic model validated incoming payloads:

| Field            | Type   | Validation                              |
|-----------------|--------|-----------------------------------------|
| `primary_color` | string | HEX format: `^#(?:[0-9a-fA-F]{3}){1,2}$` |
| `surface_color` | string | HEX format: `^#(?:[0-9a-fA-F]{3}){1,2}$` |
| `font_family`   | string | Typeface name (e.g., "Space Grotesk")   |
| `background_url`| string | Optional HTTP/HTTPS URL                  |

Omitting `theme_config` or sending null used the default platform styling.

### Frontend

CSS custom properties (`--exam-primary`, `--exam-surface`) were injected into the DOM based on the config. Fonts loaded via `next/font/google`.

## Why It Was Removed

The feature added complexity without clear user demand. In v1.2.0, the admin dashboard was simplified — the Aesthetic Customization Engine panel and `LivePreview` component were removed to focus on core exam functionality.

The `theme_config` column remains in the database schema but is no longer read or written by any frontend or backend code.
