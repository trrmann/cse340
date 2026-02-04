# TODO: Add CHECK constraints for inventory data integrity (version b only)

- The S09 -- validate inventory data integrity.sql script expects the following, but only for version b:
  - [x] A CHECK constraint on inv_price to prevent negative values (e.g., inv_price >= 0)
  - [x] A CHECK constraint on inv_year to enforce a valid year range (e.g., inv_year >= 1900 AND inv_year <= 2100)
- These constraints should only be present in the version b update scripts, not in the original schema.
- The version b update SQL scripts now include both constraints and this task is complete.
